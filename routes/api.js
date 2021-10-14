const router = require('express').Router();
const Workout = require('../models/Workout');

router.get('/workouts', (req, res) => {
    Workout.aggregate([
        {
            $set: {
                totalDuration: {
                    $sum: '$exercises.duration'
                },
                totalDistance: {
                    $sum: '$exercises.distance'
                }
            }
        }
    ])
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.post('/workouts', (req, res) => {
    Workout.create(req.body)
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.put('/workouts/:id', (req, res) => {
    Workout.findByIdAndUpdate(req.params.id, { $push: { exercises: req.body } })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

router.get('/workouts/range', (req, res) => {
    Workout.aggregate([
        { $set: { totalDuration: { $sum: '$exercises.duration' } } },
        { $sort: { day: -1 } }
    ])
        .limit(7)
        .sort({ day: 1 })
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});

module.exports = router;