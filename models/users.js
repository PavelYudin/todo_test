const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;


/**
 * @property {String} login - логин пользователя
 * @property {String} hashPass - хеш, сгенерированный на основе пароля пользователя
 */
// установка схемы
const userScheme = new Schema({
    login: {
        type: String,
        minlength: 4,
        required: true
    },
    hashPass: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("User", userScheme);