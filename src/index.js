function calculateTotal(price, taxRate) {
  return price + (price * taxRate);
}



module.exports = { calculateTotal };
