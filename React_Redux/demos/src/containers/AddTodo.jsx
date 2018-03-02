import React from 'react';
import { connect } from 'react-redux';
import { addTodoCreator } from 'actions';
import { filterTodoCreator } from 'actions';

let AddTodo = ({dispatch}) => {
  let input;
  return (
    <div>
      <input ref = {instance => {
        input = instance;
      }} type="text"/>
      <button onClick = {e => {
        input && dispatch(addTodoCreator(input.value));
        input && (input.value = '');
      }} >add</button>
    </div>
  )
};

AddTodo = connect()(AddTodo);

export default AddTodo;