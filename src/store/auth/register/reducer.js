import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
} from "./actionTypes"

const initialState = {
  registrationError: null,
  message: null,
  loading: false,
  user: null,
<<<<<<< HEAD
  success: false
=======
>>>>>>> master
}

const account = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      state = {
        ...state,
        loading: true,
<<<<<<< HEAD
        success: false,
=======
>>>>>>> master
        registrationError: null,
      }
      break
    case REGISTER_USER_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        user: action.payload,
<<<<<<< HEAD
        success: true,
=======
>>>>>>> master
        registrationError: null,
      }
      break
    case REGISTER_USER_FAILED:
      state = {
        ...state,
        user: null,
        loading: false,
<<<<<<< HEAD
        success: false,
=======
>>>>>>> master
        registrationError: action.payload,
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default account
