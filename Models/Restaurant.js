const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const RestaurantSchema = mongoose.Schema({
  name: { type: String, required: true },
  position : { type: String, required: true },
  email: {  type: String,required: true },
  password: { type: String,required: true },
  phone: { type: String, required: true },
  logo: { type: String, required: true },
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = Restaurant;