export const initialReportsState = {
  reports: [],
  isLoading: false,
  error: null,
  lastSubmitted: null,
};

export function reportsReducer(state, action) {
  switch (action.type) {
    case 'SUBMIT_START':
      return { ...state, isLoading: true, error: null, lastSubmitted: null };
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isLoading: false,
        reports: [action.payload, ...state.reports],
        lastSubmitted: action.payload.id,
        error: null,
      };
    case 'SUBMIT_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'CLEAR_LAST':
      return { ...state, lastSubmitted: null };
    default:
      return state;
  }
}
