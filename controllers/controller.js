const bcrypt = require('bcrypt');
const User = require("../models/users");
const Task = require("../models/task");
const jwt = require("../jwt");
const nameToken = process.env.nameToken;

/**
 * @typedef {Object} Task
 * @property {String} title - заголовок задачи
 * @property {String} description - описание задачи
 * @property {Date} dateEndTask - дата создания задачи
 * @property {Date} dateEndTask - дата завершения задачи
 */


/**
 * Эмуляция ответа при регистрации в приложении
 */
exports.registrationPage = (req, res) => {
    res.send("Input date")
}


/**
 * Регистрация пользователя, занесение в БД логина и пароля
 * @param {String} req.body.login - логин
 * @param {String} req.body.password - пароль           
 */
exports.registration = async (req, res) => {
    
    const saltRounds = 10;
 
    if(!req.body || !req.body.login || !req.body.password) return res.sendStatus(400);

    let {login, password} = req.body;

    if(!login.trim() || !password.trim()) return res.sendStatus(400);

    if(login.length < 4) {
        return res.status(400).send({ message: "short login length" })
    }
    if(password.trim().length < 8) {
        return res.status(400).send({ message: "short password length" })
    }
   
    const users = await User.find({ login });
    if(users.length) {
        return res.status(403).send({ message: "such login exists" })
    }

    const hash = await bcrypt.hash(password, saltRounds);   
    const newUser = new User({ login, hashPass: hash });
    try {
        await newUser.save();
    } catch(err) {
        return res.status(400).send({ message: err.message });
    }
    
    return res.sendStatus(201);
};


/**
 * Авторизация/Аутентификация пользователя
 * @param {String} req.body.login - логин
 * @param {String} req.body.password - пароль           
 * @returns - на клиент отправляется cookie с токеном
 */
exports.authorization = async (req, res) => {

    if(!req.body || !req.body.login || !req.body.password) return res.sendStatus(400);

    let {login, password} = req.body;

    if(!login.trim() || !password.trim()) return res.sendStatus(400);

    const user = await User.findOne({ login });
    
    if(!user) {
        return res.status(403).send({ message: "Invalid user" })
    }

    const hash = user.hashPass;
    const result = await bcrypt.compare(password, hash);
    if(result) {
        const idUser = user._id.toString();
        const accessToken = jwt.getToken(idUser);
        res.cookie(nameToken, accessToken);
        return res.sendStatus(200);
    } else {
        return res.status(403).send({ message: "Invalid password" })
    }
};


/**
 * Создание задачи пользователем
 * @param {String} req.body.title - заголовок задачи
 * @param {String} req.body.description - описание задачи  
 * @param {Number} req.body.dateEndTask - дата завершения задачи(миллисекунды)       
 */
exports.createTask = async (req, res) => {

    if(!req.body || !req.body.title || !req.body.description) {
        return res.sendStatus(400);
    }

    const idUser = req.idUser;

    let {title, description, dateEndTask} = req.body;

    if(!title.trim() || !description.trim()) {
        return res.sendStatus(400);
    }

    if(dateEndTask !== undefined && (+new Date() >= dateEndTask)) {
        return res.send({ message: "Invalid date"});
    }     

    const newTask = new Task({ idUser, title, description, dateEndTask });
    try {
        await newTask.save();
    } catch(err) {
        return res.status(400).send({ message: err.message });
    }

    return res.sendStatus(201);
}


/**
 * Получение задачи пользователем по параметра: заголовок, дата(мс) < крайней даты завершения задачи
 * @param {String} req.body.title - заголовок задачи 
 * @param {Number} req.query.dateEndTask - дата завершения задачи(миллисекунды)       
 * @param res - объект, управляющий отправкой ответа  
 * @return {Task} task - массив задач
 */
exports.getTask = async (req, res) => { 

    const idUser = req.idUser;

    let {title, dateEndTask} = req.query;  
    title = title? title.trim() : null;
    const fieldTitle = title? "title" : "notFieldTitle";
    const fieldDateEndTask = dateEndTask? "dateEndTask" : "notFieldDateEndTask";

    const task = await Task.find({ idUser })
    .where(fieldTitle).equals(title)
    .where(fieldDateEndTask).gte(dateEndTask);

    return res.status(200).send({ result: task})
}


/**
 * Получение задачи по идентификатору
 * @param {String} req.params.id - идентификатор задачи
 * @return {Task}
 */
exports.getTaskId = async (req, res) => {

    const  id = req.params["id"];

    const task = await Task.findById(id)

    res.status(200).send(task);
}


/**
 * Удаление задачи по идентификатору
 * @param {String} req.params.id - идентификатор задачи
 */
exports.delTask = async (req, res) => {
    
    const id = req.params["id"];

    const result = await Task.findByIdAndDelete(id);

    if(!result) {
        res.status(403).send({ message: "Task not found"});
    } else {
        res.sendStatus(204);
    }
}


/**
 * Обновление задачи
 * @param {String} req.body.title - заголовок задачи
 * @param {String} req.body.description - описание задачи  
 * @param {Number} req.body.dateEndTask - дата завершения задачи(миллисекунды)
 * @param {String} req.body.id - идентификатор задачи
 */
exports.updateTask = async (req, res) => {
    
    let {id, title, description, dateEndTask} = req.body;

    if(!id || !title || !description || !title.trim() || !description.trim()) {
        return res.sendStatus(400);
    }

    if(dateEndTask !== undefined && (+new Date() >= dateEndTask)) {
        return res.status(400).send({ message: "Invalid date"});
    }   

    const task = await Task.findByIdAndUpdate(id, { dateEndTask, title, description });
    res.sendStatus(201);
}