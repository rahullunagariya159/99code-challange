import React, { useState, useEffect, useMemo } from 'react'
import TokenSelector from './TokenSelector'
import { TokenPrice } from '../types'
import './SwapForm.css'

const SwapForm: React.FC = () => {
  const [prices, setPrices] = useState<TokenPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('https://interview.switcheo.com/prices.json')
      if (!response.ok) {
        throw new Error('Failed to fetch prices')
      }
      
      const data: TokenPrice[] = await response.json()
      
      // get unique tokens with latest prices
      const priceMap = new Map<string, TokenPrice>()
      for (const item of data) {
        if (item.price && item.price > 0) {
          const existing = priceMap.get(item.currency)
          if (!existing || new Date(item.date) > new Date(existing.date)) {
            priceMap.set(item.currency, item)
          }
        }
      }
      
      const uniquePrices = Array.from(priceMap.values())
        .sort((a, b) => a.currency.localeCompare(b.currency))
      
      setPrices(uniquePrices)
      
      if (uniquePrices.length > 0) {
        setFromToken(uniquePrices.find(p => p.currency === 'ETH')?.currency || uniquePrices[0].currency)
        setToToken(uniquePrices.find(p => p.currency === 'USDC')?.currency || uniquePrices[1]?.currency || uniquePrices[0].currency)
      }
      
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const getTokenPrice = (currency: string): TokenPrice | undefined => {
    return prices.find(p => p.currency === currency)
  }

  const calculateExchangeRate = useMemo(() => {
    if (!fromToken || !toToken) return null
    
    const fromPrice = getTokenPrice(fromToken)
    const toPrice = getTokenPrice(toToken)
    
    if (!fromPrice || !toPrice || toPrice.price === 0) return null
    
    return fromPrice.price / toPrice.price
  }, [fromToken, toToken, prices])

  const handleFromAmountChange = (value: string) => {
    setValidationError('')
    
    if (value === '') {
      setFromAmount('')
      setToAmount('')
      return
    }
    
    const numValue = Number.parseFloat(value)
    if (Number.isNaN(numValue) || numValue < 0) {
      setValidationError('Please enter a valid positive number')
      setFromAmount(value)
      return
    }
    
    setFromAmount(value)
    
    if (calculateExchangeRate && value) {
      const calculated = (numValue * calculateExchangeRate).toFixed(6)
      setToAmount(calculated)
    } else {
      setToAmount('')
    }
  }

  const handleToAmountChange = (value: string) => {
    setValidationError('')
    
    if (value === '') {
      setToAmount('')
      setFromAmount('')
      return
    }
    
    const numValue = Number.parseFloat(value)
    if (Number.isNaN(numValue) || numValue < 0) {
      setValidationError('Please enter a valid positive number')
      setToAmount(value)
      return
    }
    
    setToAmount(value)
    
    if (calculateExchangeRate && value && calculateExchangeRate !== 0) {
      const calculated = (numValue / calculateExchangeRate).toFixed(6)
      setFromAmount(calculated)
    } else {
      setFromAmount('')
    }
  }

  const handleSwapDirection = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!fromToken || !toToken) {
      setValidationError('Please select both tokens')
      return
    }
    
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      setValidationError('Please enter a valid amount')
      return
    }
    
    if (fromToken === toToken) {
      setValidationError('Cannot swap the same token')
      return
    }
    
    setValidationError('')
    setSubmitting(true)
    
    // simulate backend call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert(`Swap successful!\n\nExchanged ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`)
    
    setFromAmount('')
    setToAmount('')
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="swap-container">
        <div className="swap-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading token prices...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="swap-container">
        <div className="swap-card">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={fetchPrices} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="swap-container">
      <div className="swap-card">
        <div className="swap-header">
          <h2>Swap Tokens</h2>
          <p className="swap-subtitle">Trade tokens in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="swap-form">
          <div className="token-input-section">
            <label className="input-label">From</label>
            <div className="token-input-container">
              <input
                type="text"
                className="amount-input"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                disabled={submitting}
              />
              <TokenSelector
                tokens={prices}
                selectedToken={fromToken}
                onSelect={setFromToken}
                disabled={submitting}
              />
            </div>
            {fromToken && (
              <div className="token-balance">
                Balance: 0.00 {fromToken}
              </div>
            )}
          </div>

          <div className="swap-direction-container">
            <button
              type="button"
              className="swap-direction-button"
              onClick={handleSwapDirection}
              disabled={submitting}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 14L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="token-input-section">
            <label className="input-label">To</label>
            <div className="token-input-container">
              <input
                type="text"
                className="amount-input"
                placeholder="0.0"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                disabled={submitting}
              />
              <TokenSelector
                tokens={prices}
                selectedToken={toToken}
                onSelect={setToToken}
                disabled={submitting}
              />
            </div>
            {toToken && (
              <div className="token-balance">
                Balance: 0.00 {toToken}
              </div>
            )}
          </div>

          {calculateExchangeRate && fromToken && toToken && (
            <div className="exchange-rate-info">
              <div className="rate-item">
                <span className="rate-label">Exchange Rate</span>
                <span className="rate-value">
                  1 {fromToken} = {calculateExchangeRate.toFixed(6)} {toToken}
                </span>
              </div>
            </div>
          )}

          {validationError && (
            <div className="validation-error">
              {validationError}
            </div>
          )}

          <button
            type="submit"
            className={`submit-button ${submitting ? 'submitting' : ''}`}
            disabled={submitting || !fromAmount || !toAmount}
          >
            {submitting ? (
              <>
                <span className="button-spinner"></span>
                Processing...
              </>
            ) : (
              'Swap Tokens'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SwapForm

