// log
// import Web3 from 'web3'
// import store from '../store'
// import { whitelistRoundAddresses } from '../../helpers'

const fetchDataRequest = () => {
  return {
    type: 'CHECK_DATA_REQUEST'
  }
}

// const fetchDataSuccess = (payload) => {
//   return {
//     type: 'CHECK_DATA_SUCCESS',
//     payload: payload
//   }
// }

// const fetchMerkleProof = (payload) => {
//   return {
//     type: 'FETCH_MERKLE_PROOF',
//     payload: payload
//   }
// }

// const fetchDataFailed = (payload) => {
//   return {
//     type: 'CHECK_DATA_FAILED',
//     payload: payload
//   }
// }

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest())

    try {
      // const totalSupply = await store
      //   .getState()
      //   .blockchain.smartContract.methods.mintedAmount()
      //   .call()

      // let cost = await store
      //   .getState()
      //   .blockchain.smartContract.methods.cost()
      //   .call();
      // const whitelist = await store
      //   .getState()
      //   .blockchain.smartContract.methods.whitelist(store.getState().blockchain.account)
      //   .call()
      // let approved = await store
      //   .getState()
      //   .blockchain.tokenContract.methods.allowance(store.getState().blockchain.account, '0xb71751FB0C6551324f2F96040D8c54e9560dBa82')
      //   .call()
      // approved = parseFloat(Web3.utils.fromWei(approved)) >= 0.03
      // console.log('WHITELIST', whitelist, store.getState().blockchain.account)
      // console.log(approved)

      // const addr = store.getState().blockchain.account
      // console.log('HELLO', addr)

      // const proofs = whitelistRoundAddresses.filter((w) => {
      //   return w[0].toLowerCase() === addr.toLowerCase()
      // })

      // dispatch(
      //   fetchDataSuccess({
      //     totalSupply,
      //     round: 'b3c595e55271590809f54e2f4fc3a582754f45b104dd3c41666e2ad310493db3'
      //     // proofs
      //     // whitelist,
      //     // approved
      //     // cost,
      //   })
      // )
    } catch (err) {
      console.log(err)
      // dispatch(fetchDataFailed("Could not load data from contract."));
    }
  }
}
