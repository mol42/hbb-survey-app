import { combineReducers } from "redux";
import user from "./user";
import auth from "./auth";
import survey from "./survey";
import district from "./district";

export default combineReducers({
  user,
  auth,
  survey,
  district
});
