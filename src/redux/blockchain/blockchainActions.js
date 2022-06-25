import Web3EthContract from 'web3-eth-contract'
import Web3 from 'web3'
import {
  addBlockchainNetwork,
  whitelistRoundAddresses,
  hashKeccak256,
  merkleTree,
  contractInterface
} from '../../helpers'
import store from '../store'

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

const updateData = (payload) => {
  return {
    type: 'UPDATE_DATA',
    payload: payload
  }
}

const fetchSignature = async (url, address) => {
  const signatureResponse = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ address })
  })
  const content = await signatureResponse.json()
  return content.signature
}

export const prepareData = () => {
  return async (dispatch) => {
    const contract = store.getState().blockchain.smartContract
    const account = store.getState().blockchain.account
    const signatureUrl = store.getState().blockchain.signatureUrl

    if (!contract || !account || !signatureUrl) {
      return
    }

    const [privateRound, isPrivate, isPublic, totalSupply] = await Promise.all([
      contract.methods.currentPrivateRound().call(),
      contract.methods.isPrivate().call(),
      contract.methods.isPublic().call(),
      contract.methods.getTotalSupply().call()
    ])

    let maxMintAmount = 0
    let proofs = []

    if (isPrivate) {
      proofs = whitelistRoundAddresses.filter((w) => {
        return w[0].toLowerCase() === account.toLowerCase() && w[2].toLowerCase() === privateRound.toLowerCase()
      })

      if (proofs.length === 1) {
        maxMintAmount = proofs[0][1]

        const hash = hashKeccak256(proofs[0])
        const mkp = merkleTree.getHexProof(hash)

        proofs[0].push(mkp)
      }
    }

    let signature = ''
    if (isPublic) {
      maxMintAmount = 1
      signature = store.getState().blockchain.signature

      if (signature === '' || signature === undefined || signature === null) {
        signature = await fetchSignature(signatureUrl, account)
      }
    }

    dispatch(updateData({
      privateRound,
      isPrivate,
      isPublic,
      proofs,
      maxMintAmount,
      signature,
      totalSupply
    }))
  }
}

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest())

    const configResponse = await fetch('/config/config.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    const CONFIG = await configResponse.json()
    console.log('CONFIG', CONFIG)

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
          const saleContract = new Web3EthContract(
            contractInterface,
            CONFIG.CONTRACT_ADDRESS
          )

          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: saleContract,
              web3,
              signatureUrl: CONFIG.SIGNATURE_API_ENDPOINT
            })
          )

          ethereum.on('accountsChanged', (_) => {
            window.location.reload()
          })

          ethereum.on('chainChanged', () => {
            window.location.reload()
          })
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
