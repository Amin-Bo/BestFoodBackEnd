var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const Restaurant = require("../Models/Restaurant");

module.exports = function (passport) {
  let opts = {};
  opts.jwtFromRequest  = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.SECRET;

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      //console.log(jwt_payload);
      try {
        const restaurant = await Restaurant.findById(jwt_payload.restaurant._id);
      
          return  done(null, restaurant);
        
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
