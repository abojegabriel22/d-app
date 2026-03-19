
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WalletProvider from './context/WalletProvider';
import SolanaWalletProvider from './context/solana_context/SolanaProvider.jsx';
import { Buffer } from 'buffer';

// This makes Buffer available globally in the browser
window.Buffer = window.Buffer || Buffer;

createRoot(document.getElementById('root')).render(
    <WalletProvider>
      <SolanaWalletProvider>
        <App />
      </SolanaWalletProvider>
    </WalletProvider>
)
