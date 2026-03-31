import { Connection, Transaction } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  SolongWalletAdapter,
  CoinbaseWalletAdapter,
  BitgetWalletAdapter,
  BitpieWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  CoinhubWalletAdapter,
  FractalWalletAdapter,
  HuobiWalletAdapter,
  HyperPayWalletAdapter,
  KeystoneWalletAdapter,
  KrystalWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  NekoWalletAdapter,
  NightlyWalletAdapter,
  NufiWalletAdapter,
  OntoWalletAdapter,
  ParticleAdapter,
  SafePalWalletAdapter,
  SaifuWalletAdapter,
  SalmonWalletAdapter,
  SkyWalletAdapter,
  SpotWalletAdapter,
  TokenaryWalletAdapter,
  TokenPocketWalletAdapter,
  TrezorWalletAdapter,
  TrustWalletAdapter,
  WalletConnectWalletAdapter,
  XDEFIWalletAdapter,
  UnsafeBurnerWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const SOLANA_NETWORK = WalletAdapterNetwork.Mainnet;
const SOLANA_RPC_ENDPOINT = "https://falling-old-breeze.solana-mainnet.quiknode.pro/3e17bcb1b159df5936c696c22e1ac467452d72e6/";

const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed");
let solanaAdapters;

const createSolanaAdapters = () => {
  const adapters = [];

  const addAdapter = (Adapter, options) => {
    if (!Adapter) return;
    try {
      adapters.push(new Adapter(options));
    } catch (err) {
      console.warn(`Could not create ${Adapter.name} adapter`, err);
    }
  };

  addAdapter(PhantomWalletAdapter);
  addAdapter(SolflareWalletAdapter, { network: SOLANA_NETWORK });
  addAdapter(TorusWalletAdapter);
  addAdapter(SolongWalletAdapter);
  addAdapter(CoinbaseWalletAdapter, { network: SOLANA_NETWORK });
  addAdapter(BitgetWalletAdapter);
  addAdapter(BitpieWalletAdapter);
  addAdapter(CloverWalletAdapter);
  addAdapter(Coin98WalletAdapter, { network: SOLANA_NETWORK });
  addAdapter(CoinhubWalletAdapter);
  addAdapter(FractalWalletAdapter);
  addAdapter(HuobiWalletAdapter);
  addAdapter(HyperPayWalletAdapter);
  addAdapter(KeystoneWalletAdapter);
  addAdapter(KrystalWalletAdapter);
  addAdapter(LedgerWalletAdapter);
  addAdapter(MathWalletAdapter);
  addAdapter(NekoWalletAdapter);
  addAdapter(NightlyWalletAdapter);
  addAdapter(NufiWalletAdapter);
  addAdapter(OntoWalletAdapter);
  addAdapter(ParticleAdapter);
  addAdapter(SafePalWalletAdapter);
  addAdapter(SaifuWalletAdapter);
  addAdapter(SalmonWalletAdapter);
  addAdapter(SkyWalletAdapter);
  addAdapter(SpotWalletAdapter);
  addAdapter(TokenaryWalletAdapter);
  addAdapter(TokenPocketWalletAdapter);
  addAdapter(TrezorWalletAdapter);
  addAdapter(TrustWalletAdapter);
  addAdapter(WalletConnectWalletAdapter);
  addAdapter(XDEFIWalletAdapter);
  addAdapter(UnsafeBurnerWalletAdapter);

  return adapters;
};

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
