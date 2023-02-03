const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/todo_db';

mongoose.set('strictQuery', false);

module.exports = () => {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}