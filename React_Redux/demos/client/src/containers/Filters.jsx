import React from 'react';
import { connect } from 'react-redux';
import { filtersCreator } from 'actions';

let Filters = ({dispatch}) => {
  return (
    <div>
      <button value = 'all' onClick = {e => {
        dispatch(filtersCreator(e.target.value));
      }} >all</button>
      <button value = 'completed' onClick = {e => {
        dispatch(filtersCreator(e.target.value));
      }} >completed</button>
      <button value = 'uncompleted' onClick = {e => {
        dispatch(filtersCreator(e.target.value));
      }} >uncompleted</button>
    </div>
  )
};

Filters = connect()(Filters);

export default Filters;