var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// construct a Schema for Geometry. Following this ref: https://stackoverflow.com/questions/32199658/create-find-geolocation-in-mongoose

var hotelSchema = new Schema({
  name: String,
  address: String,
  phoneNumber: String,
  price: Number,
  comforts: [String],
  location: {
    type: { type: String, default: "Point"}, 
    coordinates: [Number]  // [longitude, latitude]
  },  
  photos: [String],
  isDisabled: Boolean
});

hotelSchema.index({'location': '2dsphere'});

module.exports = mongoose.model("hotel", hotelSchema);