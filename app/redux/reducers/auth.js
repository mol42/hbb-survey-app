
import type { Action } from '../actions/types';
import { 
  LOGIN_REQUEST, 
  LOGIN_SUCCESS 
} from '../actions/actionTypes';

export type State = {
    name: string
}

const initialState = {
  user : {},
  token : null,
  loginInProgress : false,
  loginCompleted : false
};

export default function (state:State = initialState, action:Action): State {
  if (action.type === LOGIN_REQUEST) {
    return {
      ...state,
      loginInProgress : true
    }
  }
  if (action.type === LOGIN_SUCCESS) {
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
