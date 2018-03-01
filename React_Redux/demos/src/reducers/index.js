import { combineReducers } from 'redux';
import todos from 'reducers/todos';

const todoApp = combineReducers({
  todos
});

export default todoApp;