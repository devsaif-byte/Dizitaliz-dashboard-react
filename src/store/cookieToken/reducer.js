import { ADD_TOKEN, REMOVE_TOKEN, UPDATE_TOKEN } from "./actions";

const initialState = {
	tokens: [], // Token list
};

const tokenReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_TOKEN:
			return {
				...state,
				tokens: [...state.tokens, action.payload],
			};
		case REMOVE_TOKEN:
			return {
				...state,
				tokens: state.tokens.filter((token) => token.id !== action.payload),
			};
		case "UPDATE_TOKEN":
			return {
				...state,
				tokens: state.tokens.map((token) =>
					token.id === action.payload.id
						? { ...token, str: action.payload.str }
						: token
				),
			};
		case "LOAD_TOKENS":
			return { ...state, tokens: action.payload };
		default:
			return state;
	}
};

export default tokenReducer;
