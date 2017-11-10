
import type { Action } from '../actions/types';
import clone from "clone";

import { 
    SURVEY_LIST_REQUEST, 
    SURVEY_LIST_SUCCESS,
    SHOW_NEXT_QUESTION,
    SHOW_PREVIOUS_QUESTION,
    SET_SELECTED_SURVEY,
    INITIALIZE_NAVIGATION_STATE,
    UPDATE_CHOICES,
    UPDATE_SURVEY_FLAGS,
    COMPLETED_SURVEY_LIST_SUCCESS,
    COMPLETED_SURVEY_LAST5MIN_LIST_SUCCESS,
    SET_SELECTED_COMPLETED_SURVEY,
    FILTER_SURVEY_LIST,
    START_SURVEY,
    SET_SELECTED_DISTRICT_OPTIONS,
    UPDATE_CHOICE_OWNER_NAME
} from '../actions/actionTypes';

export type State = {
    name: string
}

const initialState = {
    surveyList : [], // filtered survey list
    originalSurveyList : [], // un-filtered original survey list
    choiceOwner : {
        all : {
            completedSurveyList : [],
            choiceOwnerList : []
        },
        last5Min : {
            completedSurveyList : [],
            choiceOwnerList : []
        }
    },
    filter : {
        text : ""
    },
    surveyWizard : {
        selectedSurvey : {},
        selectedChoiceOwner : {
            name: "",
            age: null,
            gender: null,
            districtId: null,
            neighbourhoodId: null
        },
        navigationState : {
            index: 0,
            routes: [],
            editMode : false,
            // ilk ekranda back açık çünkü geri gidince ilçe-mahalle soruyoruz.
            backDisabled : false, 
            forwardDisabled : false,
            surveyCompleted : false,
            showBottomButtons : false,
            showChoiceOwnerSetup : true
        },
        flags : {
            editMode : false,
            surveySaveInProgress : false,
            surveySaveCompleted : false
        }
    }
};

export default function (state:State = initialState, action:Action): State {

    if (action.type === SURVEY_LIST_SUCCESS) {
        return {
            ...state,
            surveyWizard : {
                ...initialState.surveyWizard
            },
            filter : {
                text : ""
            },
            originalSurveyList : action.surveyList,
            surveyList : action.surveyList
        }
    }

    if (action.type === SHOW_NEXT_QUESTION) {
        
        let {selectedChoices, selectedSurvey} = state.surveyWizard;
        let {routes, index} = state.surveyWizard.navigationState;
        let newIndex = index;
        let surveyCompleted = false;
        let forwardDisabled = false;
        let backDisabled = false;

        let activeQuestion = selectedSurvey.questions[index];
        let activeQuestionHasAnswer = findIfQuestionHasActiveAnswer(activeQuestion);

        if (!activeQuestionHasAnswer && activeQuestion.mandatory) {
            forwardDisabled = false;
        } else {

            let nextVisibleQuestionIndex = index;

            for (let i = (index + 1); i < selectedSurvey.questions.length; i++) {
                if (selectedSurvey.questions[i].visible) {
                    nextVisibleQuestionIndex = i;
                    break;
                }
            }
    
            let isLastScreen = (index === nextVisibleQuestionIndex);
    
            if (!isLastScreen) {
                newIndex = nextVisibleQuestionIndex;
            } else {
                surveyCompleted = true;
                forwardDisabled = true;
            }
        }

        backDisabled = newIndex > 0 ? false : true;
        
        let newState = {
            ...state,
            surveyWizard : {
                ...state.surveyWizard,
                navigationState : {
                    ...state.surveyWizard.navigationState,
                    index : newIndex,
                    forwardDisabled,
                    backDisabled,
                    surveyCompleted
                }
            }
        }
        return newState;
    }

    if (action.type === SHOW_PREVIOUS_QUESTION) {

        let {routes, index, surveyCompleted} = state.surveyWizard.navigationState;
        let isFirstScreen = index == 0;
        let newIndex = isFirstScreen ? 0 :  (surveyCompleted ? index :  index - 1);

        let newState = {
            ...state,
            surveyWizard : {
                ...state.surveyWizard,
                navigationState : {
                    ...state.surveyWizard.navigationState,
                    index : newIndex,
                    backDisabled : false,
                    forwardDisabled : false,
                    showBottomButtons : isFirstScreen ? false : true,
                    surveyCompleted : false,
                    showChoiceOwnerSetup : isFirstScreen ? true : false
                }
            }
        }
        return newState;
    }

    if (action.type === INITIALIZE_NAVIGATION_STATE) {

        return {
            ...state,
            surveyWizard : {
                ...state.surveyWizard,
                navigationState : {
                    routes : action.routes,
                    index : 0,
                    backDisabled : true,
                    forwardDisabled : false,
                    surveyCompleted : false,
                    showBottomButtons : false,
                    showChoiceOwnerSetup : true
                }
            }            
        }
    }

    if (action.type === SET_SELECTED_SURVEY) {

        let clonedSurvey = clone(action.survey);
        return setSelectedSurvey(state, clonedSurvey);
    }

    if (action.type === UPDATE_CHOICES) {

        let {selectedSurvey, flags} = state.surveyWizard;
        let {question, answer, index, answerText} = action;

        let newState = {
            ...state,
            surveyWizard : {
                ...state.surveyWizard,
                navigationState : {
                    ...state.surveyWizard.navigationState
                }
            }
        };

        if (question.type == 1) {
            question.answers[0].freeText = answerText;
        } else {
            // multi choice single selection
            if (question.type == 2) {
                question.answers.forEach((answer) => {
                    answer.checked = false;
                });
            }
            let changedAnswer = question.answers[index];
            changedAnswer.checked = changedAnswer.checked ? false : true;
        }

        runRelations(selectedSurvey);

        return newState;
    }

    if (action.type === UPDATE_SURVEY_FLAGS) {

        let {surveySaveInProgress, surveySaveCompleted} = action;

        let newState = {
            ...state,
            surveyWizard : {
                ...state.surveyWizard,
                flags : {
                    surveySaveInProgress,
                    surveySaveCompleted
                }
            }
        };

        return newState;
    }

    if (action.type === COMPLETED_SURVEY_LIST_SUCCESS) {

        let {completedSurveyList} = action;
        let choiceOwnerList = createChoiceOwnerList(completedSurveyList);

        return {
            ...state,
            surveyWizard : {
                ...state.surveyWizard
            },
            choiceOwner : {
                ...state.choiceOwner,
                all : {
                    choiceOwnerList,
                    completedSurveyList : action.completedSurveyList
                }
            }
        }
    }

    if (action.type === COMPLETED_SURVEY_LAST5MIN_LIST_SUCCESS) {
        
        let {completedSurveyList} = action;
        let choiceOwnerList = createChoiceOwnerList(completedSurveyList);

        return {
            ...state,
            surveyWizard : {
                ...state.surveyWizard
            },
            choiceOwner : {
                ...state.choiceOwner,
                last5Min : {
                    choiceOwnerList,
                    completedSurveyList : action.completedSurveyList
                }
            }
        }
    }

    if (action.type === SET_SELECTED_COMPLETED_SURVEY) {

        let {choiceOwnerId} = action;
        
        let choiceOwner = state.choiceOwner.last5Min.choiceOwnerList.filter((choiceOwner) => {
            return choiceOwner.choiceOwnerId == choiceOwnerId;
        })[0];

        if(!choiceOwner) {
            choiceOwner = state.choiceOwner.all.choiceOwnerList.filter((choiceOwner) => {
                return choiceOwner.choiceOwnerId == choiceOwnerId;
            })[0];
        }

        let {survey, choices, district, neighbourhood} = choiceOwner;
        let clonedSurvey = clone(survey);

        let newState = setSelectedSurvey(state, clonedSurvey);

        // tamamlanmış anketin sorularının içine
        clonedSurvey.questions.forEach((question) => {

            question.answers.forEach((answer) => {
                
                choices.forEach((choice) => {

                    if (answer.answerId == choice.answer.answerId) {
                        if (question.type == 1) {
                            answer.freeText = choice.freeText;
                        } else {
                            answer.checked = true;
                        }
                    }
                });
            });
        });

        runRelations(clonedSurvey);

        newState.surveyWizard.flags.editMode = true;
        newState.surveyWizard.selectedChoiceOwner = {
            ...choiceOwner,
            districtId : district ? district.districtId : null,
            neighbourhoodId : neighbourhood ? neighbourhood.neighbourhoodId : null
        };

        return newState;
    }

    if (action.type === FILTER_SURVEY_LIST) {

        let {originalSurveyList} = state;

        let newList = originalSurveyList.filter((survey) => {
            if (action.newText && action.newText != "") {
                return survey.name.toUpperCase().includes(action.newText.toUpperCase());
            }
            return true;
        });

        return {
            ...state,
            surveyWizard : {
                ...state.surveyWizard
            },
            filter : {
                text : action.newText
            },
            surveyList : newList
        }        
    }

    if (action.type === START_SURVEY) {

        let newState = {
            ...state,
            surveyWizard : {
                ...state.surveyWizard,
                navigationState : {
                    ...state.surveyWizard.navigationState,
                    backDisabled: false,
                    showBottomButtons : true,
                    showChoiceOwnerSetup : false
                },
                flags : {
                    ...state.surveyWizard.flags
                }
            }
        }
        return newState;        
    }

    if (action.type === SET_SELECTED_DISTRICT_OPTIONS) {

        let newState = {
          ...state
        };
        
        newState.surveyWizard.selectedChoiceOwner = {
            ...newState.surveyWizard.selectedChoiceOwner,
            districtId : action.districtId,
            neighbourhoodId : action.neighbourhoodId
        }

        return newState;
    }

    if (action.type === UPDATE_CHOICE_OWNER_NAME) {

        let newState = {
            ...state
          };
          
          newState.surveyWizard.selectedChoiceOwner = {
              ...newState.surveyWizard.selectedChoiceOwner,
              name : action.name
          }

          return newState;        
    }

    return state;
}


function setSelectedSurvey(state, survey) {

    // soruları questionOrder sıralamasına göre sıralıyoruz..
    survey.questions.sort((q1, q2) => {
        return q1.questionOrder > q2.questionOrder ? 1 : -1;
    });

    // init visible değerini saklıyoruz ki reset yaparken kullanabilelim..
    survey.questions.forEach((question) => {
        question.initialVisible = question.visible;

        // her sorunun cevaplarını answerOrder değerine göre sırala.
        question.answers.sort((a1, a2) => {
            return a1.answerOrder > a2.answerOrder ? 1 : -1;
        })
    });

    return {
        ...state,
        surveyWizard : {
            ...initialState.surveyWizard,
            navigationState : {
                ...initialState.surveyWizard.navigationState,
                showBottomButtons : false,
                showChoiceOwnerSetup : true
            },
            flags : {
                ...initialState.surveyWizard.flags
            },
            selectedSurvey : {
                ...survey
            }
        }
    }
}

function runRelations(survey) {

    // relation aksiyonlarını teker teker uygula..
    survey.relations.forEach((relation, index) => {
        
        let {selectedQuestionUid, selectedAnswerUid, actionType, targetQuestionUid} = relation;
        let {questions} = survey;

        let selectedQuestion = survey.questions.filter((question) => question.uid == selectedQuestionUid)[0];
        let selectedAnswer = selectedQuestion.answers.filter((answer) => answer.uid == selectedAnswerUid)[0];
        let questionOfTargetAnswer = questions.filter((question) => question.uid == targetQuestionUid)[0];

        // visible flagi sadece sistem içinde kullandığımız özel bir flagtır
        // bu flag sayesinde bir soruyu gösterip göstermemeyi ayarlayabiliyoruz.
        if (selectedAnswer.checked) {
            questionOfTargetAnswer.visible = (actionType == 1) ? true : false;
        } else {
            questionOfTargetAnswer.visible = questionOfTargetAnswer.initialVisible;
        }
    });
}

function findIfQuestionHasActiveAnswer(question) {
    let questionHasAnswer = false;

    question.answers.forEach((answer) => {

        if (question.type == 1) {

            if (answer.freeText) {
                questionHasAnswer = true;
            }
        } else {

            if (answer.checked) {
                questionHasAnswer = true;
            }
        }
    });

    return questionHasAnswer;
}

function createChoiceOwnerList(completedSurveyList) {
    let choiceOwnerList = [];
    
    // survey nesnesini kolay ulaşmak için choiceOwner içine set ediyoruz
    completedSurveyList.forEach((completedSurvey) => {

        completedSurvey.choiceOwnerList.forEach((choiceOwner) => {

            choiceOwner.survey = completedSurvey.survey;
            choiceOwnerList.push(choiceOwner);
        }); 
    });

    return choiceOwnerList;
}