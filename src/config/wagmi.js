import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'


const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, sepolia],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'GitCoin Secure',
  projectId: '52f6cb3aa44b4279eaa42930b6f07dbf', // Get this from https://cloud.walletconnect.com
  chains
})

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export { chains }

