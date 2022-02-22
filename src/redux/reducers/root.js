import { combineReducers } from 'redux'
import errors from './errors'
import details from './details'
import values from './values'

export default combineReducers({ errors, details, values })
