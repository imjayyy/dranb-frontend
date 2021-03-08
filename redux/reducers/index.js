import {combineReducers} from "redux";
import auth from './auth'
import homeFilter from "./homeFilter";
import brandFilter from "./brandFilter";

export default combineReducers({auth, homeFilter, brandFilter})
