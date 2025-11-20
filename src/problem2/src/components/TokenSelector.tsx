import React, { useState, useRef, useEffect } from 'react'
import { TokenPrice } from '../types'
import './TokenSelector.css'

interface TokenSelectorProps {
  tokens: TokenPrice[]
  selectedToken: string
  onSelect: (currency: string) => void
  disabled?: boolean
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ tokens, selectedToken, onSelect, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const filteredTokens = tokens.filter(token =>
    token.currency.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (currency: string) => {
    onSelect(currency)
    setIsOpen(false)
    setSearchQuery('')
  }

  const getTokenIcon = (currency: string) => {
    return `/tokens/${currency}.svg`
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    const placeholder = img.nextSibling as HTMLDivElement
    img.style.display = 'none'
    if (placeholder) {
      placeholder.style.display = 'flex'
    }
  }

  const selectedTokenData = tokens.find(t => t.currency === selectedToken)

  return (
    <div className="token-selector" ref={dropdownRef}>
      <button
        type="button"
        className={`token-selector-button ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {selectedTokenData ? (
          <>
            <img
              src={getTokenIcon(selectedTokenData.currency)}
              alt={selectedTokenData.currency}
              className="token-icon"
              onError={handleImageError}
            />
            <div className="token-icon-placeholder" style={{ display: 'none' }}>
              {selectedTokenData.currency.slice(0, 2)}
            </div>
            <span className="token-symbol">{selectedTokenData.currency}</span>
          </>
        ) : (
          <span className="token-placeholder">Select token</span>
        )}
        <svg
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="token-dropdown">
          <div className="token-search">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="token-list">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <button
                  key={token.currency}
                  type="button"
                  className={`token-option ${selectedToken === token.currency ? 'selected' : ''}`}
                  onClick={() => handleSelect(token.currency)}
                >
                  <div className="token-option-info">
                    <img
                      src={getTokenIcon(token.currency)}
                      alt={token.currency}
                      className="token-icon"
                      onError={handleImageError}
                    />
                    <div className="token-icon-placeholder" style={{ display: 'none' }}>
                      {token.currency.slice(0, 2)}
                    </div>
                    <div className="token-details">
                      <span className="token-name">{token.currency}</span>
                      <span className="token-price">${token.price.toFixed(6)}</span>
                    </div>
                  </div>
                  {selectedToken === token.currency && (
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="no-results">
                <p>No tokens found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TokenSelector

