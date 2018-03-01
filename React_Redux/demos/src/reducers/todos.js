const todos = (state = [], action) => {
  if(action.type === 'ADD_TODO'){
    return [
      ...state,
      {
        text: action.todoContent,
        id: action.id
      }
    ];
  }
  return state;
};

export default todos;