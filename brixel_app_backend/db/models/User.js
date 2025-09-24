const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { validateEmail } = require('../validators');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true, 
        lowercase: true,
        validate: [validateEmail, "Incorrect email format"],
      },
      password: {
        type: String,
        required: true,
        minlength: [6,"The password should contain at least 4 characters."], 
      },
      createdAt: {
        type: Date,
        default: Date.now, 
      },
});