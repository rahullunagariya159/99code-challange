# Problem 3 Analysis

## Issues Found

### 1. Logic Errors

**Undefined variable `lhsPriority`**

```typescript
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) { // lhsPriority doesn't exist, should be balancePriority
```

**Filter logic is inverted**

```typescript
if (balance.amount <= 0) {
  return true; // This KEEPS zero/negative balances instead of filtering them out
}
```

Should be `balance.amount > 0` to keep positive balances.

**Sort function doesn't return 0**

```typescript
if (leftPriority > rightPriority) {
  return -1;
} else if (rightPriority > leftPriority) {
  return 1;
} // Missing return 0 for equal priorities
```

**Missing `blockchain` property**
The `WalletBalance` interface doesn't have a `blockchain` field but the code uses `balance.blockchain`.

### 2. Performance Issues

**getPriority called multiple times unnecessarily**

- Called once per item in filter
- Called twice per comparison in sort
- For 100 items, that's ~200+ calls when we only need ~100

**formattedBalances computed but never used**

```typescript
const formattedBalances = sortedBalances.map(...) // Calculated but unused
const rows = sortedBalances.map(...) // Actually used
```

We're mapping over the same array twice.

**prices in useMemo deps but not used**

```typescript
useMemo(() => {
  return balances.filter(...).sort(...);
}, [balances, prices]); // prices isn't used here
```

This causes re-computation when prices change for no reason.

**getPriority recreated every render**
Defined inside component instead of outside.

### 3. Type Issues

- `getPriority` uses `any` instead of `string`
- `sortedBalances` typed as `FormattedWalletBalance[]` but it's actually `WalletBalance[]`
- Empty `Props` interface that extends `BoxProps`

### 4. React Anti-patterns

**Using index as key**

```typescript
<WalletRow key={index} ... />
```

Bad because the list order changes. Should use a stable unique identifier like `currency`.

**Undefined `classes.row`**
`classes` is never defined or imported.

**Unused `children` prop**
Destructured but never used.

### 5. Other Issues

- Inconsistent indentation
- Missing semicolons
- Type annotation doesn't match actual data in the rows map

## How to Fix

1. Fix the undefined variable and logic errors
2. Move getPriority outside the component
3. Combine the filter/sort/map into one useMemo
4. Remove unused formattedBalances
5. Fix dependency arrays
6. Use proper types instead of any
7. Use currency as the key
8. Add missing interface properties

## Performance Impact

- ~60% reduction in function calls
- 50% fewer array iterations (2 → 1)
- No unnecessary recalculations from price changes
