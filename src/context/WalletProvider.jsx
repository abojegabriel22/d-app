
import { walletReducer, initialState } from "./walletReducer";
import { WalletContext } from "./WalletContext";
import { useReducer } from "react";

const WalletProvider = ({ children }) => {
    const [state, dispatch] = useReducer(walletReducer, initialState);
    return (
        <WalletContext.Provider value={{ state, dispatch }}>
            {children}
        </WalletContext.Provider>
    );
}

export default WalletProvider;