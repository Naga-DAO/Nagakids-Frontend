import Web3 from 'web3'
import { ethers } from 'ethers'
import { MerkleTree } from 'merkletreejs'
import contractInterface from './abi.json'
import holderAddress from './holders.json'

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

const hashKeccak256 = (data) => {
  let [address, amount, round] = data
  address = ethers.utils.getAddress(address)

  return ethers.utils.solidityKeccak256(['address', 'uint256', 'bytes32'], [address, amount, round])
}
const whitelistRoundAddresses = holderAddress.NagaHolders

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
