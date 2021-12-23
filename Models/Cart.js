const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = mongoose.Schema({
  client: { type: Schema.Types.ObjectId, ref: "User" },
  
  order: { type: Schema.Types.ObjectId, ref: "Food" }},
  {quantity: { type: Number }
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
