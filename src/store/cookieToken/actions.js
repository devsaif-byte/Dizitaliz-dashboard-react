export const ADD_TOKEN = "ADD_TOKEN";
export const REMOVE_TOKEN = "REMOVE_TOKEN";
export const UPDATE_TOKEN = "UPDATE_TOKEN";
export const LOAD_TOKENS = "LOAD_TOKENS";

export const addToken = (token) => ({
	type: ADD_TOKEN,
	payload: token,
});

export const removeToken = (tokenId) => ({
	type: REMOVE_TOKEN,
	payload: tokenId,
});

export const updateToken = (id, str) => ({
	type: UPDATE_TOKEN,
	payload: { id, str },
});

export const loadTokens = (tokens) => ({
	type: "LOAD_TOKENS",
	payload: tokens,
});
