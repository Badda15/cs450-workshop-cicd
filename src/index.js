function calculateTotal(price, taxRate) {
  return price + (price * taxRate);
}

const secretKey = "super-secret-token";

module.exports = { calculateTotal };
