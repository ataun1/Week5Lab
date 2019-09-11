let mongoose = require('mongoose');

let devSchema = mongoose.Schema({
    name: {
        firstname: {
            type: String,
            require: true
        },
        lastname:{
            type: String,
        }
    },
    level: {
        type: String,
        enum: ['BEGINNER', 'EXPERT'],
        require: true,
        uppercase: true
    },
    address: {
        state:{
            type: String
        },
        suburb: {
            type: String
        },
        street: {
            type: String
        },
        unit: {
            type: String
        }
    }
})

module.exports = mongoose.model('Developer', devSchema);