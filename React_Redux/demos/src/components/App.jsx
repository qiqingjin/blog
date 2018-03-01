import React from 'react';
import AddTodo from 'containers/AddTodo';
import FilteredTodoList from 'containers/FilteredTodoList';

const App = () => (
  <div>
    <h3>TODO</h3>
    <AddTodo />
    <FilteredTodoList />
  </div>
);

export default App;