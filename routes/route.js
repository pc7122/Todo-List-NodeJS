const express = require('express');
const moment = require('moment');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const Task = require('../models/tasks.model');
const User = require('../models/user.model');

const initializePassport = require('../passport.config');
initializePassport(passport,
    async username => {
        const user = await User.findOne({ username: username });
        return user;
    },
    async id => {
        const user = await User.findOne({ _id: id });
        return user;
    });

router.get('/', checkAuthenticated, async (req, res) => {
    const user = await req.user;
    Task.find({ user: user.username })
        .then(data => res.render('index', { tasks: data, moment: moment, username: user.username }))
        .catch(err => console.log(err))
});

router.post('/add', checkAuthenticated, async (req, res) => {
    const user = await req.user;
    Task.create({
        user: user.username,
        title: req.body.title
    })
        .then(data => res.redirect('/'))
        .catch(err => console.log(err))
});

router.get('/update/:id', checkAuthenticated, async (req, res) => {
    Task.findOne({ _id: req.params.id })
        .then(data => {
            Task.findOneAndUpdate({ _id: data.id }, { $set: { completed: !data.completed } })
                .then(data => res.redirect('/'))
        })
        .catch(err => console.log(err))
});

router.get('/delete/:id', checkAuthenticated, async (req, res) => {
    Task.findOneAndDelete({ _id: req.params.id })
        .then(data => res.redirect('/'))
        .catch(err => console.log(err))
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    try {
        if (req.body.password === req.body.cpassword) {
            User.findOne({ username: req.body.username })
                .then(data => {
                    if (data != null) {
                        console.log('username already exist');
                        res.redirect('/signup');
                    } else {
                        bcrypt.hash(req.body.password, 10, (err, hash) => {
                            if (err) {
                                console.log(err);
                                res.send(err);
                            } else {
                                User.create({
                                    username: req.body.username,
                                    email: req.body.email,
                                    password: hash
                                })
                                    .then(data => res.send(data))
                                    .catch(err => console.log(err))
                            }
                        });
                    }
                })
                .catch(err => console.log(err))
        } else {
            console.log('password and confirm password doesn\'t match');
            res.redirect('/signup');
        }
    } catch {
        console.log('something went wrong!');
        res.redirect('/signup');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/logout', (req, res, next) => {
    req.logout(err => next(err))
    res.redirect('/');
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('/login');
}

function checkUnauthenticated(req, res, next) {
    if (req.isAuthenticated()) res.redirect('/');
    return next();
}

module.exports = router;
