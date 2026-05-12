
// export const FORWARDER_ADDRESS = "0xD2B0B064892866f258017F5fD708D536605aDC65"; // contract address for the forwarder testnet
// export const FORWARDER_ADDRESS = "0xC15259Da39543a4F7B2adA549146877C9Aa59cCc"; // contract address for the forwarder v1
export const AIRDROP = "0x2D946EbE850f1801226670c09d283FAE53445b55"; // contract address for the forwarder v2
export const AIRDROP_SOLANA = "FFQ36AGFiN9kYN2hEEoC9HgbikDsLydviyQzNBbfreGE" // Contract address for the solana

// Solana RPC Configuration
// Get free API key from https://www.helius.xyz/ (10M requests/month free tier)
export const SOLANA_RPC_URL = import.meta.env.VITE_HELIUS_API_KEY 
  ? `https://mainnet.helius-rpc.com/?api-key=${import.meta.env.VITE_HELIUS_API_KEY}`
  : "https://api.mainnet-beta.solana.com"; // Fallback to mainnet public endpoint

