import { 
  GET_DISTRICT_LIST_SUCCESS,
  GET_NEIGHBOURHOOD_OF_DISTRICT_SUCCESS
} from '../actions/actionTypes';

const initialState = {
  districtList : [],
  activeNeighbourHoods : []
};

export default function (state = initialState, action) {
 
  if (action.type === GET_DISTRICT_LIST_SUCCESS) {
      return {
        ...initialState,        
        districtList: action.districtList,
      };
  }

  if (action.type == GET_NEIGHBOURHOOD_OF_DISTRICT_SUCCESS) {
    return {
      ...state,
      activeNeighbourHoods : action.neighbourHoodList
    }
  }

  return state;
}
