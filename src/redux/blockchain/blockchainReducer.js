const initialState = {
  loading: false,
  account: null,
  smartContract: null,
  web3: null,
  errorMsg: '',
  round: '0x0000000000000000000000000000000000000000000000000000000000000000',
  maxMintAmount: 0,
  proofs: []
}

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONNECTION_REQUEST':
      return {
        ...initialState,
        loading: true
      }
    case 'CONNECTION_SUCCESS':
      return {
        ...state,
        loading: false,
        account: action.payload.account,
        smartContract: action.payload.smartContract,
        tokenContract: action.payload.tokenContract,
        web3: action.payload.web3,
        maxMintAmount: action.payload.maxMintAmount,
        proofs: action.payload.proofs
      }
    case 'CONNECTION_FAILED':
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload
      }
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        account: action.payload.account
      }
    default:
      return state
  }
}

export default blockchainReducer
