import React from 'react';
import AddTodo from 'containers/AddTodo';
import FilteredTodoList from 'containers/FilteredTodoList';
import Filters from 'containers/Filters';

const App = () => (
  <div>
    <h3>TODO</h3>
    <AddTodo />
    <FilteredTodoList />
    <Filters />
  </div>
);

export default App;