const initialState = {
  loading: false,
  account: null,
  smartContract: null,
  web3: null,
  errorMsg: '',
  privateRound: '0x0000000000000000000000000000000000000000000000000000000000000000',
  isPrivate: false,
  isPublic: false,
  proofs: [],
  maxMintAmount: 0,
  signature: '',
  signatureUrl: null,
  totalSupply: 0,
  isPrivateUserMinted: false,
  isPublicUserMinted: false
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
        web3: action.payload.web3,
        signatureUrl: action.payload.signatureUrl
      }
    case 'CONNECTION_FAILED':
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload
      }
    case 'UPDATE_DATA':
      return {
        ...state,
        privateRound: action.payload.privateRound,
        isPrivate: action.payload.isPrivate,
        isPublic: action.payload.isPublic,
        proofs: action.payload.proofs,
        maxMintAmount: action.payload.maxMintAmount,
        signature: action.payload.signature,
        totalSupply: action.payload.totalSupply,
        isPublicUserMinted: action.payload.isPublicUserMinted,
        isPrivateUserMinted: action.payload.isPrivateUserMinted
      }
    default:
      return state
  }
}

export default blockchainReducer
