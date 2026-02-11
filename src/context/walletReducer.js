
export const initialState = {
    address: null,
    provider: null,
    signer: null,
    balance: null,
    usdBalance: null,
};

export const walletReducer = (state, action) => {
    switch(action.type){
        case "CONNECT_WALLET":
            return {
                ...state,
                address: action.payload.address,
                provider: action.payload.provider,
                signer: action.payload.signer,
            };

        case "SET_BALANCE":
            return {
                ...state,
                balance: action.payload,
            };

        case "SET_USD_VALUE":
            return {
                ...state,
                usdBalance: action.payload,
            }

        default:
            return state;
    }
}