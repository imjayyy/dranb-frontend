import {combineReducers} from "redux";
import auth from './auth'
import siteType from './siteType'
import exploreType from "./exploreType";
import gender from "./gender";
import period from "./period";

export default combineReducers({auth, siteType, exploreType, gender, period})
