const todos = (state = [], action) => {
  if(action.type === 'ADD_TODO'){
    return [
      ...state,
      {
        text: action.todoContent,
        id: action.id,
        complete: false
      }
    ];
  }else if(action.type === 'COMPLETE_TODO'){
    let newState = state.map((s) => {
      if(s.id === action.id){
        s.complete = true;
      }
      return s;
    });
    return newState;
  }
  return state;
};

export default todos;
