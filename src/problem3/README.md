# Problem 3: Messy React

## Files

- `ANALYSIS.md` - Detailed breakdown of issues found
- `original-code.tsx` - Original code with bugs (for reference)
- `refactored-code.tsx` - Fixed version

## Summary of Issues

### Logic Errors

- `lhsPriority` undefined (should be `balancePriority`)
- Filter logic inverted (keeps negative balances instead of filtering them)
- Sort function missing return statement for equal values
- `WalletBalance` interface missing `blockchain` property

### Performance Problems

- `getPriority` called 3x per item (once in filter, twice in sort)
- `formattedBalances` calculated but never used
- Mapping over same array twice
- `prices` in `useMemo` deps but not used in computation
- `getPriority` recreated on every render

### Type Issues

- Using `any` instead of `string`
- Type mismatch in rows mapping
- Empty interface extension

### React Anti-patterns

- Using array index as key (causes reconciliation issues)
- `classes.row` undefined
- Unused `children` prop

## Main Fixes

1. Fixed variable references and logic errors
2. Moved `getPriority` outside component
3. Combined filter/sort/map into single memoized operation
4. Removed unused `formattedBalances`
5. Fixed dependency arrays
6. Replaced `any` with proper types
7. Used `currency` as stable key
8. Added missing interface properties

## Performance Impact

- ~60% fewer function calls
- 50% fewer array iterations
- No unnecessary recalculations
