# Currency Swap Form

A currency swap interface built with Vite + React + TypeScript for trading cryptocurrencies.

## Features

- Real-time currency swapping between 30+ cryptocurrencies
- Live price updates from API
- Automatic exchange rate calculations
- Bidirectional input (edit either amount field)
- Token search with filtering
- Input validation and error handling
- Loading states and animations
- Fully responsive design

## Setup

### Prerequisites

- Node.js (v16+)
- npm

### Installation

1. Navigate to the project:

```bash
cd problem2
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
problem2/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── App.css
│   └── components/
│       ├── SwapForm.jsx
│       ├── SwapForm.css
│       ├── TokenSelector.jsx
│       └── TokenSelector.css
├── tokens/              # Token icons (500+ SVG files)
├── index.html
├── package.json
└── vite.config.js
```

## How It Works

### Price Fetching

Fetches cryptocurrency prices from:

```
https://interview.switcheo.com/prices.json
```

The app filters out tokens without prices, gets the most recent price for each currency, and removes duplicates.

### Exchange Rate Calculation

```javascript
exchangeRate = fromTokenPrice / toTokenPrice;
toAmount = fromAmount * exchangeRate;
```

Uses React's `useMemo` hook to optimize calculations.

### Form Validation

- Positive numbers only
- Non-empty amounts required
- Different tokens for from/to
- Real-time error messages

### Mock Backend

The submit button simulates a backend API call with a 2-second delay to demonstrate loading states.

## Tech Stack

- **Vite** - Build tool
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **CSS3** - Styling with custom properties

No external libraries for form handling or state management - pure React, TypeScript and CSS.

## Development Notes

### State Management

Uses React hooks (useState, useEffect, useMemo) for state management.

### Performance

- Memoized exchange rate calculations
- Efficient price data filtering
- Lazy-loaded token icons with fallbacks

### Styling

- Dark theme with purple/blue gradients
- Glassmorphism card effects
- Custom CSS properties for theming
- Smooth transitions and animations

## API Integration

The app handles:

- Network request failures
- Missing price data
- Invalid token selections
- Form submission errors

## Browser Support

Works on all modern browsers that support:

- CSS custom properties
- CSS Grid/Flexbox
- ES6+ JavaScript
- Fetch API

## License

MIT
