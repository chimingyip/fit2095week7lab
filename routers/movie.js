var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
module.exports = {
    getAll: function (req, res) {
        Movie.find()
            .populate('actors')
            .exec(function (err, movies) {
                if (err) return res.status(400).json(err);
                res.json(movies);
        });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true },
            function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
        });
    },
    deleteOne: function (req, res) {
        Movie.findOneAndRemove( {_id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                })
            })
        })
    },
    getByYear: function (req, res) {
        Movie.find({
            year: {
                $gte: req.params.year1,
                $lte: req.params.year2
            } 
        })
            .populate('actors')
            .exec(function (err, movies) {
                if (err) return res.status(400).json(err);
                res.json(movies);
        });
    },
    removeActor: function (req, res) {
        Movie.findOneAndUpdate({ 
            _id: req.params.movieId 
        },
        { $pullAll: { actors: [req.params.actorId] } }, 
        { new: true }, 
        function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    deleteByYear: function (req, res) {
        Movie.deleteMany({
            year: {
                $gte: req.params.year1,
                $lte: req.params.year2
            }
        }, function(err) {
            if (err) return res.status(400).json(err);
            res.json();
        })
    },
    incYearForX: function (req, res) {
        Movie.updateMany({
            title: /^X/
        }, { $inc: { year: 1 } }, { new: true },
        function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
};