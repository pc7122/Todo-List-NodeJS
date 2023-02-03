const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    username: { type: String, null: false },
    email: { type: String, null: false },
    password: { type: String, null: false },
    created: { type: Date, default: Date.now },
});