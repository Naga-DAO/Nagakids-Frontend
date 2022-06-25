import Web3 from 'web3'
import { ethers } from 'ethers'
import { MerkleTree } from 'merkletreejs'
import contractInterface from './abi.json'

const blockchainNetworkConfig = {
  chainId: Web3.utils.toHex(10),
  chainName: 'Optimism',
  nativeCurrency: {
    name: 'Ethereum',
    decimals: 18,
    symbol: 'ETH'
  },
  rpcUrls: ['https://rpc.ankr.com/optimism'],
  blockExplorerUrls: ['https://optimistic.etherscan.io']
}

async function addBlockchainNetwork () {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [blockchainNetworkConfig]
    })

    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

const WL_ROUND = '0x68e7d51fdb912cb107dda2e59b053d87fcca666dd0ef5339cd3474ccb5276bba'
const NG_ROUND = '0xb3c595e55271590809f54e2f4fc3a582754f45b104dd3c41666e2ad310493db3'

const whitelistRoundAddresses = [
  ['0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', 2, WL_ROUND],
  ['0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', 3, NG_ROUND],
  ['0x5150CfFff28a33E1d1F3211B4D2799a1DB3F82e8', 3, NG_ROUND],
  ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 3, NG_ROUND]
]

const hashKeccak256 = (data) => {
  let [address, amount, round] = data
  address = ethers.utils.getAddress(address)

  return ethers.utils.solidityKeccak256(['address', 'uint256', 'bytes32'], [address, amount, round])
}

const leafNodes = whitelistRoundAddresses.map(hashKeccak256)
const merkleTree = new MerkleTree(leafNodes, ethers.utils.keccak256, { sortPairs: true })

// console.log('leaft1', merkleTree.getHexProof(hashKeccak256(whitelistRoundAddresses[2])))
console.log('leaf', leafNodes[2].toString('hex'))
// console.log('leaf', merkleTree.getHexProof(leafNodes[2]))
console.log('ROOT', merkleTree.getHexRoot())
// console.log(merkleTree.verify(merkleTree.getHexProof(leafNodes[2]), leafNodes[2], merkleTree.getRoot()))

export {
  addBlockchainNetwork,
  whitelistRoundAddresses,
  merkleTree,
  hashKeccak256,
  contractInterface
}
