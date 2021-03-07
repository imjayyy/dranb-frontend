import {combineReducers} from "redux";
import auth from './auth'
import siteType from './siteType'
import filters from "./filters";

export default combineReducers({auth, siteType, filters})
