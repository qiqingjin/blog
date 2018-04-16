const filters = (state = 'all', action) => {
  if(action.type === 'FILTER'){
    return action.filter;
  }
  return state;
};

export default filters;