
import type { Action } from '../actions/types';
import { SET_USER, LOGIN_REQUEST, LOGIN_SUCCES } from '../actions/user';

export type State = {
    name: string
}

const initialState = {
  name: '',
  user : {},
  token : null,
  loginInProgress : false,
  loginCompleted : false
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === SET_USER) {
    return {
      ...state,
      name: action.payload,
    };
  }
  if (action.type === LOGIN_REQUEST) {
    return {
      ...state,
      loginInProgress : true
    }
  }
  if (action.type === LOGIN_SUCCES) {
    return {
      ...state,
      user : action.user,
      token : action.token,
      loginInProgress : false,
      loginCompleted : true
    }
  }
  return state;
}
