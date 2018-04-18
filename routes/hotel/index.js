var Hotel = require('../../models/hotel');
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var { formatComforts } = require('../../middleware/format-hotel-comforts');

/**
 * 
 * @api {get} /api/hotels Find hotels
 * @apiGroup Hotels
 * @apiVersion  1.2.2
 * 
 * @apiHeader {String} Content-Type Request header content type
 * @apiHeader {String} x-access-token Access token of user after logged in
 * 
 * @apiParam  {Number} longitude User's longitude
 * @apiParam  {Number} latitude User's latitude
 * @apiParam  {Number="km"} [minDistance] Min distance from user location to a hotel
 * @apiParam  {Number="km"} [maxDistance] Max distance from user location to a hotel
 * @apiParam  {Number} [minPrice] Min price of a hotel that user looking for
 * @apiParam  {Number} [maxPrice] Max price of a hotel that user looking for
 * @apiParam  {String} [comforts] Hotel's comfort that user need, <b>SEPERATED</b> by a <code>,</code> (Better in unicode n lower case)
 *
 * @apiParamExample  {type} Request query example:
 * 
 * /api/hotels?longitude=105.84334749999994&latitude=21.0056183&minDistance=2&maxDistance=5&minPrice=50000&maxPrice=150000&comforts=wifi,condom,nong lanh
 * 
 * @apiSuccess {Number} success Response status
 * @apiSuccess {String} message Response message
 * @apiSuccess {Object[]} hotels All hotels that meet the user's requirements
 * @apiSuccess {String} hotels._id Hotel's id
 * @apiSuccess {String} hotels.name Hotel name
 * @apiSuccess {String} hotels.address Hotel address
 * @apiSuccess {String} hotels.phoneNumber Hotel phone-number
 * @apiSuccess {Number} hotels.price Hotel price
 * @apiSuccess {String[]} hotels.comforts Hotel comforts
 * @apiSuccess {Object} hotels.location Hotel location
 * @apiSuccess {String} hotels.location.type Hotel location type
 * @apiSuccess {Number[]} hotels.location.coordinates Hotel location coordinates
 * @apiSuccess {Boolean} hotels.isDisabled Whether that hotel is still working in app
 * @apiSuccess {Number} hotels.dist Distance from hotel to user location in <code>"m"</code>
 * 
 * @apiSuccessExample {type} Success response:
    {
      "success": 1,
      "message": "Fetch hotel infos successfully",
      "hotels": [
        {
          "_id": "5ad5aadc683a2523a423f7f0",
          "name": "Chien Hostel",
          "address": "12&14 Ấu Triệu, Hàng Trống, Quận Hoàn Kiếm, Hà Nội",
          "phoneNumber": "024 3932 9329",
          "price": 102000,
          "comforts": [
            "wifi",
            "nha hang",
            "giat ui"
          ],
          "location": {
            "type": "Point",
            "coordinates": [
              105.849023,
              21.029078
            ]
          },
          "isDisabled": false,
          "dist": 2677.2713959975576
        }
      ]
    }
 *  
 * @apiErrorExample {json} Invalid or outdated access token
 *  HTTP 401 Unauthorized
 * 
 *  @apiErrorExample {json} Get error
 *  HTTP 500 Internal Server Error
 * 
 */
router.get('/', (req, res) => {
  var query = req.query;

  var longitude = Number(query.longitude);
  var latitude = Number(query.latitude);

  var minDistance = Number(query.minDistance) ? Number(query.minDistance) * 1000 : 0;           // km -> m
  var maxDistance = Number(query.maxDistance) ? Number(query.maxDistance) * 1000 : 3000;        // km -> m
  var minPrice = Number(query.minPrice) ? Number(query.minPrice) : 0;
  var maxPrice = Number(query.maxPrice) ? Number(query.maxPrice) : 1000000;
  var comforts = query.comforts ? query.comforts.split(',') : ['wifi'];

  Hotel.aggregate([
    {
      "$geoNear": {
        "near": { "type": "Point", "coordinates": [longitude , latitude] },
        "distanceField": "dist",
        "minDistance": minDistance,
        "maxDistance": maxDistance,
        "spherical": true
     }
    },
    {
      '$match': {
        '$and': [
          {'price': {'$gte' : minPrice}},
          {'price': {'$lte' : maxPrice}},
          {'isDisabled': false}
        ]
      }
    },
    {
      '$match': {
        'comforts' : {
          '$elemMatch' : {
            '$in' : comforts
          }
        }
      }
    },
    {
      '$project' : {
        "_id": 1,
        "comforts": 1,
        "location": 1,
        "name": 1,
        "address": 1,
        "phoneNumber": 1,
        "price": 1,
        "isDisabled": 1,
        "dist": 1
      }
    }
  ]).exec((err, hotels) => {
    if (err) {
      res.json({
        success: 0,
        message: "Unable to get hotel infos",
        error: err
      });
    } else {
      res.json({
        success: 1,
        message: "Fetch hotel infos successfully",
        hotels
      });
    }
  });
});



/**
 * 
 * @api {get} /api/hotels/:id Get a hotel details
 * @apiGroup Hotels
 * @apiVersion  1.2.2
 * 
 * @apiHeader {String} Content-Type Request header content type
 * @apiHeader {String} x-access-token Access token of user after logged in
 * 
 * @apiParam  {String} id Hotel's id
 *
 * @apiParamExample Request query example:
 * 
 * /api/hotels/5ad5aadc683a2523a423f7f0
 * 
 * @apiSuccess {Number} success Response status
 * @apiSuccess {String} message Response message
 * @apiSuccess {Object} hotel Hotel information
 * @apiSuccess {String} hotel._id Hotel's id
 * @apiSuccess {String} hotel.name Hotel name
 * @apiSuccess {String} hotel.address Hotel address
 * @apiSuccess {String} hotel.phoneNumber Hotel phone-number
 * @apiSuccess {Number} hotel.price Hotel price
 * @apiSuccess {String[]} hotel.comforts Hotel comforts
 * @apiSuccess {Object} hotel.location Hotel location
 * @apiSuccess {String} hotel.location.type Hotel location type
 * @apiSuccess {Number[]} hotel.location.coordinates Hotel location coordinates
 * @apiSuccess {Boolean} hotel.isDisabled Whether that hotel is still working in app
 * @apiSuccess {String[]} hotel.photos All hotel photos link
 * 
 * @apiSuccessExample {type} Success response:
    {
      "success": 1,
      "message": "Fetch hotel detail successfully",
      "hotel": {
        "_id": "5ad5aadc683a2523a423f7f0",
        "name": "Chien Hostel",
        "address": "12&14 Ấu Triệu, Hàng Trống, Quận Hoàn Kiếm, Hà Nội",
        "phoneNumber": "024 3932 9329",
        "price": 102000,
        "comforts": [
          "wifi",
          "nha hang",
          "giat ui"
        ],
        "location": {
          "type": "Point",
          "coordinates": [
            105.849023,
            21.029078
          ]
        },
        "isDisabled": false,
        "photos": [
          "localhost:5000/api/hotels/5ad5aadc683a2523a423f7f0/photos/0",
          "localhost:5000/api/hotels/5ad5aadc683a2523a423f7f0/photos/1",
          "localhost:5000/api/hotels/5ad5aadc683a2523a423f7f0/photos/2",
          "localhost:5000/api/hotels/5ad5aadc683a2523a423f7f0/photos/3",
          "localhost:5000/api/hotels/5ad5aadc683a2523a423f7f0/photos/4"
        ]
      }
    }
 * 
 * @apiErrorExample {json} Invalid or outdated access token
 *  HTTP 401 Unauthorized
 * 
 *  @apiErrorExample {json} Get error
 *  HTTP 500 Internal Server Error
 * 
 */
router.get('/:id', (req, res) => {
  var hotelId = req.params.id;
  Hotel.aggregate([
    {
      '$match' : {
        '_id': mongoose.Types.ObjectId(hotelId)
      }
    },
    {
      '$addFields' : {
        'photoCount' : { '$size' : "$photos" }
      }
    },
    {
      '$project' : {
        "_id": 1,
        "comforts": 1,
        "photoCount" : 1,
        "location": 1,
        "name": 1,
        "address": 1,
        "phoneNumber": 1,
        "price": 1,
        "isDisabled": 1,
      }
    }
  ]).exec((err, hotel) => {
    // $match return an array
    hotel = hotel[0];

    if (err) {
      res.status(500).json({
        success: 0,
        message: "Unable to fetch hotel data",
        err
      });
    } else {
      var photos, i, photoLink, host;

      photos = [];
      host = "https://dev-room.ml";

      for (i = 0; i < hotel.photoCount; i++) {
        photoLink = `${host}/api/hotels/${hotelId}/photos/${i}`;
        photos.push(photoLink);
      }

      delete hotel.photoCount;
      hotel.photos = photos;

      res.status(200).json({
        success: 1,
        message: "Fetch hotel detail successfully",
        hotel
      })
    }
  });
});



/**
 * 
 * @api {get} /api/hotels/:id/photos/:photoNo Get hotel photo
 * @apiGroup Hotels
 * @apiVersion  1.3.0
 * 
 * @apiHeader {String} Content-Type Request header content type
 * @apiHeader {String} x-access-token Access token of user after logged in
 * 
 * @apiParam  {String} id Hotel's id
 * @apiParam  {Number} photoNo Hotel photo index in it's album
 *
 * @apiParamExample Request query example:
 * /api/hotels/5ad5aa97683a2523a423f7b9/photos/0
 * 
 * @apiSuccess {File} Photo Hotel photo
 * 
 * @apiErrorExample {json} Invalid or outdated access token
 *  HTTP 401 Unauthorized
 * 
 *  @apiErrorExample {json} Photo not found
 *  HTTP 404 Photo no is greater than total hotel's photo
 * 
 *  @apiErrorExample {json} Get error
 *  HTTP 500 Internal Server Error
 * 
 */
router.get('/:id/photos/:photoNo(\\d+)', (req, res) => {
  // (\\d+): set the default type of photoNo param is Number
  
  Hotel.aggregate([
    {
      '$match' : {
        '_id': mongoose.Types.ObjectId(req.params.id)
      }
    },
    {
      '$addFields' : {
        'photo' : { '$arrayElemAt' : ['$photos', parseInt(req.params.photoNo)] },
      }
    },
    {
      '$project' : {
        "photo" : 1
      }
    }
  ]).exec((err, result) => {
    if (err || !result.length) {
      res.status(500).json({
        success: 0,
        message: "Unable to fetch hotel data",
        err
      });
    } else if (!result[0].photo) {
      res.status(404).json({
        success: 0,
        message: "Photo not found",
      })
    } else {
      var img = new Buffer(result[0].photo, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });
      res.end(img);
    }
  });
});

/**
 * 
 * @api {post} /api/hotels Add new hotel
 * @apiGroup Hotels
 * @apiVersion  1.2.2
 * 
 * @apiHeader {String} Content-Type Request header content type
 * @apiHeader {String} x-access-token Access token of user after logged in
 * 
 * @apiParam  {String} name Hotel name
 * @apiParam  {String} address Hotel address
 * @apiParam  {String} phoneNumber Hotel phone-number
 * @apiParam  {Number} price Hotel price
 * @apiParam  {String[]} comforts Hotel comforts. Must be a unicode text and in lower case. Ex: wifi, condom, nong lanh, dieu hoa...
 * @apiParam  {Object} location Hotel location
 * @apiParam  {String} location.type type="Point"
 * @apiParam  {Number[]} location.coordinates <b>IMPORTANT: </b> longitude first then lattitude
 * @apiParam  {String[]} photos Hotel photos
 * 
 * @apiParamExample {json} Request body
 *  {
      "name" : "Bún ốc lọ",
      "address": "113 B5 Thành Công",
      "phoneNumber": 987654321,
      "price" : 300000,
      "comforts": ["wifi", "nong lanh", "dieu hoa", "condom"],
      "location": {
        "type" : "Point",
        "coordinates": [105.814703, 21.021383]
      },
      "photos" : [
        "https://images.foody.vn/res/g14/138986/prof/s576x330/foody-mobile-a2-jpg-261-635682356468932282.jpg",
        "https://static3.mytour.vn/resources/pictures/hotels/19/large_vlj1419841660_khach-san-gia-han.JPG"
      ]
    }
 * 
 * 
 * @apiSuccess {Number} success Create status
 * @apiSuccess {String} message Response message
 * @apiSuccess {Object} savedHotel Saved hotel
 * @apiSuccess {String[]} savedHotel.comforts Hotel comforts
 * @apiSuccess {Object} savedHotel.location Hotel location
 * @apiSuccess {String} savedHotel.location.type Hotel location type
 * @apiSuccess {Number[]} savedHotel.coordinates Hotel location coordinates
 * @apiSuccess {String[]} savedHotel.photos Hotel photo-album
 * @apiSuccess {String} savedHotel._id Hotel id
 * @apiSuccess {String} savedHotel.name Hotel name
 * @apiSuccess {String} savedHotel.address Hotel address
 * @apiSuccess {String} savedHotel.phoneNumber Hotel phone-number
 * @apiSuccess {Number} savedHotel.price Hotel price
 * @apiSuccess {Boolean} savedHotel.isDisabled=false Whether that hotel is still working in app
 * @apiSuccess {Number} savedHotel.__v Never mind
 * 
 * 
 * @apiSuccessExample {json} Saved successfully:
 * HTTP 201 Created
  {
    "success": 1,
    "message": "Saved hotel successfully",
    "savedHotel": {
      "comforts": [ 
        "wifi", 
        "nong lanh", 
        "dieu hoa", 
        "condom"
      ],
      "location": {
        "type": "Point",
        "coordinates": [
          105.814703,
          21.021383
        ]
      },
      "photos": [
        "https://images.foody.vn/res/g14/138986/prof/s576x330/foody-mobile-a2-jpg-261-635682356468932282.jpg",
        "https://static3.mytour.vn/resources/pictures/hotels/19/large_vlj1419841660_khach-san-gia-han.JPG"
      ],
      "_id": "5ac79851f9a0dd04d40fc841",
      "name": "Bún ốc lọ",
      "address": "113 B5 Thành Công",
      "phoneNumber": "0987654321",
      "price": 300000,
      "isDisabled": false,
      "__v": 0
    }
  }
 * 
 * 
 * @apiErrorExample {json} Invalid or outdated access token
 *  HTTP 401 Unauthorized
 * 
 *  @apiErrorExample {json} Save error
 *  HTTP 500 Internal Server Error
 * 
 * 
 */
router.post('/', [formatComforts], (req, res) => {
  var body = req.body;
  var name = body.name;
  var address = body.address;
  var phoneNumber = body.phoneNumber;
  var price = body.price;
  var comforts = body.comforts;
  var location = body.location;
  var photos = body.photos;
  var isDisabled = false;

  var newHotel = new Hotel({
    name,
    address,
    phoneNumber,
    price,
    comforts,
    location,
    photos,
    isDisabled
  });

  newHotel.save((err, savedHotel) => {
    if (err) {
      res.status(500).json({
        success: 0,
        message: "Unable to save new hotel"
      });
    } else {
      res.status(201).json({
        success: 1,
        message: "Saved hotel successfully",
        savedHotel
      })
    }
  });
})

module.exports = router;