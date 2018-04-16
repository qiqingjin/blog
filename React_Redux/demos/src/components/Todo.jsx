import React from 'react';

export default ({content, onTodoClick, complete}) => {
  return (
    <li onClick = {onTodoClick} style={{color: complete ? 'gray' : 'blue',
    cursor: 'pointer'}}>{content}</li>
  );
};