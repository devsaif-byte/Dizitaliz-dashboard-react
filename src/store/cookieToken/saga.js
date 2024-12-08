import { takeLatest, put } from "redux-saga/effects";
import { ADD_TOKEN, REMOVE_TOKEN, UPDATE_TOKEN } from "./actions";

function* handleAddToken(action) {
	try {
		console.log("Token added:", action.payload);
		// Add side effects here (e.g., API call)
	} catch (error) {
		console.error("Error adding token:", error);
	}
}

function* handleRemoveToken(action) {
	try {
		console.log("Token removed:", action.payload);
		// Add side effects here (e.g., API call)
	} catch (error) {
		console.error("Error removing token:", error);
	}
}
function* handleUpdateToken(action) {
	try {
		console.log("Token updated:", action.payload);
		// Add side effects here (e.g., API call)
	} catch (error) {
		console.error("Error updating token:", error);
	}
}

export default function* tokenSaga() {
	yield takeLatest(ADD_TOKEN, handleAddToken);
	yield takeLatest(REMOVE_TOKEN, handleRemoveToken);
	yield takeLatest(UPDATE_TOKEN, handleUpdateToken);
}
