const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
  makerName: String,
  itemName: String,
  link: String,
  discountAmount: String,
  expirationDate: String,
  storeCoupon: Boolean,
  tags: String
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
