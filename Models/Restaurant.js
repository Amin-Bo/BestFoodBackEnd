const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const RestaurantSchema = mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  logo: { type: String, required: true },
  foods: [{ type: Schema.Types.ObjectId, ref: 'Food' }],
});
//Pre Save Hook. Used to hash the password
RestaurantSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  //Generate Salt Value
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    //Use this salt value to hash password
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    });
  });
});

//Custom method to check the password correct when login
RestaurantSchema.methods.isPasswordMatch = function (
  plainPassword,
  hashed,
  callback
) {
  bcrypt.compare(plainPassword, hashed, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

module.exports = Restaurant;
