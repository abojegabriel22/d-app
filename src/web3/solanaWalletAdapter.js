import { Connection, Transaction } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  SolongWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const SOLANA_NETWORK = WalletAdapterNetwork.Mainnet;
const SOLANA_RPC_ENDPOINT = "https://falling-old-breeze.solana-mainnet.quiknode.pro/3e17bcb1b159df5936c696c22e1ac467452d72e6/";

const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed");
let solanaAdapters;

const createSolanaAdapters = () => [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter({ network: SOLANA_NETWORK }),
  new TorusWalletAdapter(),
  new SolongWalletAdapter(),
];

export const getSolanaWalletAdapters = () => {
  if (!solanaAdapters) {
    solanaAdapters = createSolanaAdapters();
  }
  return solanaAdapters;
};

export const getSolanaWalletNames = () => getSolanaWalletAdapters().map((adapter) => adapter.name);

export const findSolanaWalletAdapter = (walletName) => {
  if (!walletName) return null;
  return getSolanaWalletAdapters().find(
    (adapter) => adapter.name.toLowerCase() === walletName.toLowerCase()
  );
};

export const connectSolanaWallet = async (walletName = null) => {
  const adapters = getSolanaWalletAdapters();
  let adapter = null;

  if (walletName) {
    adapter = findSolanaWalletAdapter(walletName);
  }

  if (!adapter) {
    adapter = adapters.find((item) => item.readyState === "Installed") || adapters[0];
  }

  if (!adapter) {
    throw new Error("No Solana wallet adapters are available in this browser.");
  }

  if (!adapter.connected) {
    await adapter.connect();
  }

  return {
    adapter,
    address: adapter.publicKey?.toString() || null,
  };
};

export const disconnectSolanaWallet = async (adapter) => {
  if (adapter?.connected) {
    await adapter.disconnect();
  }
};

export const getSolanaConnection = () => connection;

export const sendSolanaTransactionWithAdapter = async (
  adapter,
  instructions,
  signers = []
) => {
  if (!adapter || !adapter.publicKey) {
    throw new Error("Solana wallet adapter is not connected.");
  }

  const transaction = new Transaction();
  instructions.forEach((instruction) => transaction.add(instruction));
  signers.forEach((signer) => transaction.partialSign(signer));
  transaction.feePayer = adapter.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;

  if (typeof adapter.signTransaction === "function") {
    const signed = await adapter.signTransaction(transaction);
    const txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid, "confirmed");
    return txid;
  }

  if (typeof adapter.sendTransaction === "function") {
    return adapter.sendTransaction(transaction, connection);
  }

  throw new Error("The selected Solana wallet adapter cannot sign or send transactions.");
};
