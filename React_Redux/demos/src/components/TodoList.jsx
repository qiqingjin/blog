import React from 'react';
import Todo from 'components/Todo';

export default ({todos, completeToDoCreator}) => {
  return (
    <ul>
      {todos.map(todo =>
        <Todo key = {todo.id} content = {todo.text} complete ={todo.complete}
        onTodoClick = {() => completeToDoCreator(todo.id)}/>
      )}
    </ul>
  );
};