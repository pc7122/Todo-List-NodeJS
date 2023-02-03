const mongoose = require('mongoose');

module.exports = mongoose.model('Task', {
    user: { type: String, null: false },
    title: { type: String, null: false },
    description: { type: String },
    completed: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});