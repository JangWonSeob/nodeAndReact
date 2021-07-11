import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "./../actions/type";

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
      break;
    case REGISTER_USER:
      return { ...state, registerSuccess: action.payload };
      break;
    case AUTH_USER:
      return { ...state, authUserData: action.payload };
      break;
    default:
      return state;
  }
}
