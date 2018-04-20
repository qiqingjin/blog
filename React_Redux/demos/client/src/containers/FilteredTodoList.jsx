import { connect } from 'react-redux';
import TodoList from 'components/TodoList';
import { completeToDoCreator } from '../actions';

const mapStateToProps = (state) => {
  let filteredTodos = [];
  filteredTodos = state.todos.filter((todo) => {
    switch (state.filters) {
      case 'completed':
      return todo.complete === true;
      case 'uncompleted':
      return todo.complete === false;
      default:
      return todo.id > -1;
    }
  });
  return ({
    todos: filteredTodos
  });
};

const mapDispatchToProps = {
  completeToDoCreator
}

const FilteredTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

export default FilteredTodoList;