import Web3 from 'web3'
import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'

const blockchainNetworkConfig = {
  chainId: Web3.utils.toHex(10),
  chainName: 'Optimism',
  nativeCurrency: {
    name: 'Ethereum',
    decimals: 18,
    symbol: 'ETH'
  },
  rpcUrls: ['https://mainnet.optimism.io'],
  blockExplorerUrls: ['https://optimistic.etherscan.io']
}

async function addBlockchainNetwork () {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [blockchainNetworkConfig]
    })

    return true
  } catch (error) {
    return false
  }
}

const WL_ROUND = '68e7d51fdb912cb107dda2e59b053d87fcca666dd0ef5339cd3474ccb5276bba'
const NG_ROUND = 'b3c595e55271590809f54e2f4fc3a582754f45b104dd3c41666e2ad310493db3'

const whitelistRoundAddresses = [
  ['0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', 2, WL_ROUND],
  ['0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', 3, NG_ROUND]
]

const hashKeccak256 = (data) => {
  const [address, amount, round] = data
  // address = ethers.utils.getAddress(address)
  return keccak256(['address', 'uint256', 'bytes32'], [address, amount, round])
}

const leafNodes = whitelistRoundAddresses.map(hashKeccak256)
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })

export {
  addBlockchainNetwork,
  whitelistRoundAddresses,
  merkleTree
}
