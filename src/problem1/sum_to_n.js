// Problem 1: Three ways to sum to n

/**
 * Approach A: Iterative method using a for loop
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 *
 * This is the most straightforward approach - iterate through each number
 * from 1 to n and accumulate the sum.
 */
var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * Approach B: Mathematical formula
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 *
 * Uses the arithmetic sequence sum formula: n * (n + 1) / 2
 * This is the most efficient approach as it calculates the result directly
 * without any iteration.
 */
var sum_to_n_b = function (n) {
  return (n * (n + 1)) / 2;
};

/**
 * Approach C: Recursive method
 * Time Complexity: O(n)
 * Space Complexity: O(n) due to call stack
 *
 * Recursively breaks down the problem: sum(n) = n + sum(n-1)
 * Base case: when n is 0 or 1, return n
 */
var sum_to_n_c = function (n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return n + sum_to_n_c(n - 1);
};

// Test cases
console.log("Testing sum_to_n_a:");
console.log("sum_to_n_a(5) =", sum_to_n_a(5)); // Expected: 15
console.log("sum_to_n_a(10) =", sum_to_n_a(10)); // Expected: 55
console.log("sum_to_n_a(100) =", sum_to_n_a(100)); // Expected: 5050

console.log("\nTesting sum_to_n_b:");
console.log("sum_to_n_b(5) =", sum_to_n_b(5)); // Expected: 15
console.log("sum_to_n_b(10) =", sum_to_n_b(10)); // Expected: 55
console.log("sum_to_n_b(100) =", sum_to_n_b(100)); // Expected: 5050

console.log("\nTesting sum_to_n_c:");
console.log("sum_to_n_c(5) =", sum_to_n_c(5)); // Expected: 15
console.log("sum_to_n_c(10) =", sum_to_n_c(10)); // Expected: 55
console.log("sum_to_n_c(100) =", sum_to_n_c(100)); // Expected: 5050
