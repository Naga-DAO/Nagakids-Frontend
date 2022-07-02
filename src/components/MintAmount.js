import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import contractInteface from '../helpers/abi.json'
import PropTypes from 'prop-types'

const provider = new ethers.providers.JsonRpcProvider('https://mainnet.optimism.io')

const MintAmount = ({ contractAddress, maxSupply }) => {
  const [amount, setAmount] = useState('0')

  useEffect(() => {
    if (!contractAddress || contractAddress === '') {
      return
    }

    const contract = new ethers.Contract(contractAddress, contractInteface, provider)

    setAmount('...')
    contract.getTotalSupply().then((totalSupply) => {
      setAmount(totalSupply.toString())
    }).catch(err => {
      console.error(err)
    })
  }, [contractAddress])

  return <>{amount} / {maxSupply}</>
}

MintAmount.propTypes = {
  contractAddress: PropTypes.string,
  maxSupply: PropTypes.number
}

export default MintAmount
