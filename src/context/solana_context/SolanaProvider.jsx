
import { solanaReducer, initialState } from "./solanaReducer"
import { SolanaContext } from "./SolanaContext"
import { useReducer } from "react"


const SolanaWalletProvider = ({children}) => {
    const [solState, solDispatch] = useReducer(solanaReducer, initialState)
    return(
        <SolanaContext.Provider value={{solState, solDispatch}}>
            {children}
        </SolanaContext.Provider>
    )
}

export default SolanaWalletProvider