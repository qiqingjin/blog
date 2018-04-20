import React from 'react';
import AddTodo from 'containers/AddTodo';
import FilteredTodoList from 'containers/FilteredTodoList';
import Filters from 'containers/Filters';
import FetchJSON from 'containers/FetchJSON';

const App = () => (
  <div>
    <h3>TODO</h3>
    <AddTodo />
    <FilteredTodoList />
    <Filters />
    <FetchJSON />
  </div>
);

export default App;