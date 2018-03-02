import { connect } from 'react-redux';
import TodoList from 'components/TodoList';

const mapStateToProps = (state) => {
  let filteredTodos = [];
  filteredTodos = state.todos.filter((todo) => {
    return (todo.id % 2 === 0);
  });
  return ({
    todos: filteredTodos
  });
};

const FilteredTodoList = connect(mapStateToProps)(TodoList);

export default FilteredTodoList;