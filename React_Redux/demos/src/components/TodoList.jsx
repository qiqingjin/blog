import React from 'react';
import Todo from 'components/Todo';

export default ({todos}) => {
  return (
    <ul>
      {todos.map(todo => 
        <Todo key = {todo.id} content = {todo.text} />
      )}
    </ul>
  );
};