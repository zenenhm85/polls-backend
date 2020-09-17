const { Schema, model } = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');


const UserSchema = Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    active: {
        type: Boolean,
        default: true
    },
});


UserSchema.plugin(uniqueValidator, {message: 'This {PATH} is already registered in the Database' })


UserSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model( 'User', UserSchema );
