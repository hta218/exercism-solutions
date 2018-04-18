var Dummy = require('../../models/dummy');
var express = require('express');
var router = express.Router();


/**
 * 
 * @api {get} /api/dummy Dummy test
 * @apiGroup TESTING
 * @apiVersion  1.1.0
 * 
 * @apiSuccess (200) {Number} success Response status
 * @apiSuccess (200) {String} message Response message
 * @apiSuccess (200) {Object} data Response dummy data
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
        "success": 1,
        "message": "Loaded",
        "data": [
            {
                "_id": "5abcd8c66cfe620b2c158e67",
                "title": "Hello",
                "content": "World",
                "__v": 0
            },
            {
                "_id": "5ac5da2a1b9efa2e98e18f01",
                "__v": 0
            },
            {
                "_id": "5ac5fe00fdf30d1e78992550",
                "__v": 0
            },
            {
                "_id": "5ac5fe04fdf30d1e78992551",
                "__v": 0
            },
            {
                "_id": "5ac5fe16fdf30d1e78992552",
                "__v": 0
            }
        ]
    }
 * 
 * 
 * 
 */
router.get('/', (req, res) => {
    Dummy.find((err, allDummies) => {
        if (err) {
            res.json({
                "success": 0,
                "message": "Error while loading db",
                "error": err
            });
        }
        else {
            res.json({
                "success": 1,
                "message": "Loaded",
                "data": allDummies
            });
        }
    });
});

router.post('/', (req, res) => {
    var title = req.body.title;
    var content = req.body.content;
    var dummy = new Dummy({
        title,
        content
    });

    dummy.save((err, savedDummy) => {
        if (err) {
            res.json({
                "success": 0,
                "message": "Error while loading db",
                "error": err
            });
        }
        else {
            res.json({
                "success": 1,
                "message": "Data created",
                "data": savedDummy
            });
        }
    });
});

module.exports = router;