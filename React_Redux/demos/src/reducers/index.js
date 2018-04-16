import { combineReducers } from 'redux';
import todos from 'reducers/todos';
import filters from 'reducers/filters';

const todoApp = combineReducers({
  todos,
  filters
});

export default todoApp;