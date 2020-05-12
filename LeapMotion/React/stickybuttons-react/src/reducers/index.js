import { combineReducers } from 'redux';

import btnsReducer from './btnsReducer';

export default combineReducers({
  buttons: btnsReducer
});
