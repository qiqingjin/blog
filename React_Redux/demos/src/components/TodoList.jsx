import React from 'react';
import Todo from 'components/Todo';

export default ({dispatch, todoList}) => {
  return (
    <ul>
      {todoList.map((todo) => {
        <Todo key = {todo.id} content = {todo.text} />;
      })}
    </ul>
  );
};