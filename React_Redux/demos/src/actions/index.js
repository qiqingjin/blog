export * from 'actions/fetchJSON';

let nextTodoId = 0;
export const addTodoCreator = (todoContent) => ({
  type: 'ADD_TODO',
  todoContent,
  id: nextTodoId++
});

export const completeToDoCreator = (id) => ({
  type: 'COMPLETE_TODO',
  id
});

export const filtersCreator = (filter) => ({
  type: 'FILTER',
  filter
});
