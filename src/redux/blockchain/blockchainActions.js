import Web3EthContract from 'web3-eth-contract'
import Web3 from 'web3'
import { fetchData } from '../data/dataActions'
import { addBlockchainNetwork, whitelistRoundAddresses, hashKeccak256, merkleTree } from '../../helpers'

const connectRequest = () => {
  return {
    type: 'CONNECTION_REQUEST'
  }
}

const connectSuccess = (payload) => {
  return {
    type: 'CONNECTION_SUCCESS',
    payload: payload
  }
}

const connectFailed = (payload) => {
  return {
    type: 'CONNECTION_FAILED',
    payload: payload
  }
}

const updateAccountRequest = (payload) => {
  return {
    type: 'UPDATE_ACCOUNT',
    payload: payload
  }
}

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest())
    const abiResponse = await fetch('/config/abi.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    const abi = await abiResponse.json()
    const configResponse = await fetch('/config/config.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    const CONFIG = await configResponse.json()
    const { ethereum } = window
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask

    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum)
      const web3 = new Web3(ethereum)
      try {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts'
        })

        const networkId = await ethereum.request({
          method: 'net_version'
        })

        if (networkId === `${CONFIG.NETWORK.ID}`) {
          const nanaMintContract = new Web3EthContract(
            abi,
            CONFIG.CONTRACT_ADDRESS
          )

          const round = await nanaMintContract.methods.currentMintRound().call()

          const proofs = whitelistRoundAddresses.filter((w) => {
            return w[0].toLowerCase() === accounts[0].toLowerCase() && w[2].toLowerCase() === round.toLowerCase()
          })

          let maxMintAmount = 0
          if (proofs.length === 1) {
            maxMintAmount = proofs[0][1]
          }

          const hash = hashKeccak256(proofs[0])
          const mkp = merkleTree.getHexProof(hash)
          console.log('mkp', mkp)

          proofs[0].push(mkp)

          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: nanaMintContract,
              web3,
              round,
              proofs,
              maxMintAmount
            })
          )

          console.log('dispatched')

          // Add listeners start
          ethereum.on('accountsChanged', (accounts) => {
            // dispatch(updateAccount(accounts[0]))
            window.location.reload()
          })
          ethereum.on('chainChanged', () => {
            window.location.reload()
          })
          // Add listeners end
        } else {
          const isAddBlockchainNetwork = await addBlockchainNetwork()

          if (!isAddBlockchainNetwork) {
            dispatch(connectFailed(`Change network to ${CONFIG.NETWORK.NAME}.`))
          }
        }
      } catch (err) {
        console.log(err)
        dispatch(connectFailed('Something went wrong.'))
      }
    } else {
      dispatch(connectFailed('Install Metamask.'))
    }
  }
}

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }))
    dispatch(fetchData(account))
  }
}
