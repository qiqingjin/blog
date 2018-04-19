import fetch from 'cross-fetch';

export const REQUEST_JSON = 'REQUEST_JSON';
export const RECEIVE_JSON = 'RECEIVE_JSON';

function requestJSON(name){
	return {
		type: REQUEST_JSON,
		name
	}
}

function receiveJSON(name, json){
	return {
		type: RECEIVE_JSON,
		name,
		json: json,
		receivedAt: Date.now()
	}
}

function fetchJSON(name){
	return dispatch => {
		dispatch(requestJSON(name));
		return fetch(`http://${name}?f=json`)
			.then(response => response.json())
			.then(json => dispatch(receiveJSON(name, json)));
	}
}

function shouldFetchJSON(state, name){
	const posts = state.postsByName[name];
	if(!posts){
		return true;
	}else if(posts.isFetching){
		return false;
	}else{
		return posts.isInvalidated;
	}
}

export function fetchJSONIfNeeded(name){
	return (dispatch, getState) => {
		if(shouldFetchJSON(getState(), name)){
			return dispatch(fetchJSON(name));
		}
	}
}
