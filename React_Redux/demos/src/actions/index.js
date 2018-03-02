let nextTodoId = 0;
export const addTodoCreator = (todoContent) => ({
  type: 'ADD_TODO',
  todoContent,
  id: nextTodoId++
});
