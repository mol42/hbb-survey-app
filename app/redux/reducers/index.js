import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import user from "./user";
import auth from "./auth";
import survey from "./survey";
import district from "./district";

export default combineReducers({
  form: formReducer,
  user,
  auth,
  survey,
  district
});
