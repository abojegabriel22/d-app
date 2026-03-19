
export const initialState = {
    address: null,
    balance: null
}

export const solanaReducer = (state, action) => {
    switch(action.type){
        case "CONNECT_SOLANA":
            return {...state, address: action.payload.address}
        case "SET_SOL_BAL":
            return {...state, balance: action.payload}
        default:
            return state
    }
}