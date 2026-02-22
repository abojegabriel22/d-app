
export const initialState = {
  coins: [],
  loading: false,
  error: false,
  initialLoading: true
};

export const ACTIONS = {
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",
};

export const liveChartReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: false, initialLoading: state.coins.length === 0  }; // only true on first fetch
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, initialLoading: false, coins: action.payload };
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
};
