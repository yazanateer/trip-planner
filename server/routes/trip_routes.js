const express = require('express');
const router = express.Router();

router.post('/get-trip-data', (req, res) => {
    const { country, tripType } = req.body;

     const tripData = {
        country,
        tripType,
        routes: [
            { name: 'Route 1', distance: 100, pointsOfInterest: ['Point A', 'Point B'] },
            { name: 'Route 2', distance: 120, pointsOfInterest: ['Point C', 'Point D'] },
            { name: 'Route 3', distance: 90, pointsOfInterest: ['Point E', 'Point F'] },
        ],
    };

    res.json(tripData);
});

module.exports = router;
