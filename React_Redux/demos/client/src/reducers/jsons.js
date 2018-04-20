import { REQUEST_JSON, RECEIVE_JSON } from 'actions';

function posts(state = {
	isFetching: false,
	isInvalidated: false,
	json: {}
}, action){
	switch(action.type){
		case REQUEST_JSON:
			return Object.assign({}, state, {
				isFetching: true,
				isInvalidated: false
			});
		case RECEIVE_JSON:
			return Object.assign({}, state, {
				isFetching: false,
				isInvalidated: false,
				json: action.json,
				lastUpdated: action.receivedAt
			});
		default:
			return state;
	}
}

function postsByName(state = {}, action){
	switch(action.type){
		case REQUEST_JSON:
		case RECEIVE_JSON:
			return Object.assign({}, state, {
				[action.name]: posts(state[action.name], action)
			});
		default:
			return state;
	}
}

export default postsByName;
