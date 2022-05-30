const init_state = {
  id: 0,
  name: '',
  email: '',
  phone_number: '',
};

export default (state = init_state, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        phone_number: action.payload.phone_number,
      };
    case 'UPDATE_PHONE':
      return {
        ...state,
        phone_number: action.payload,
      };
    case 'USER_LOGOUT':
      return init_state;
    default:
      return state;
  }
};
