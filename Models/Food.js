const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const FoodSchema = mongoose.Schema({
  name: { type: String, required: true },
  price : { type: String, required: true },
  category: {  type: String, enum : ['diet','desert'], default: ' '},
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant'  },
  img: { type: String, required: true },
});

const Food = mongoose.model('Food', FoodSchema);
var Restaurant  = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Food;