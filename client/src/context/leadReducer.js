export default (state, action) => {
  switch (action.type) {
    case "SENDING_EMAILS":
    case "SENDING_FORM":
      return {
        ...state,
        sending: true,
        successMessage: null,
        errorMessage: null,
      };
    case "EMAILS_SENT":
    case "FORM_SENT":
      return { ...state, sending: false, successMessage: action.payload };
    case "EMAILS_ERROR":
    case "FORM_ERROR":
      return { ...state, sending: false, errorMessage: action.payload };
    default:
      return state;
  }
};
