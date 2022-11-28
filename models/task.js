const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;

/**
 * @property {String} idUser - идентификатор пользователя
 * @property {String} title - заголовок задачи
 * @property {String} description - описание задачи
 * @property {Date} dateStartTask - дата создания задачи
 * @property {Date} dateEndTask - последняя дата выполнения задачи
 */
// установка схемы
const taskScheme = new Schema({
    idUser: {
        type: String,
        required: true
    },
    title: {
        type: String,
        maxlength: 50,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateStartTask: {
        type: Date,
        default: Date.now
    },
    dateEndTask: {
        type: Date
    }
    
});

module.exports = mongoose.model("Task", taskScheme);