require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const router = require('./routes/index'); 
const registerRouter = require('./routes/registration');
const authorizationRouter = require('./routes/authorization');
const app = express();
const PORT = process.env.PORT || 3000;
const jwt = require("./jwt");
const cookieParser = require('cookie-parser');
const nameToken = process.env.nameToken;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use("/registration", registerRouter);
app.use("/authorization", authorizationRouter);

app.use((req, res, next) => {
    if(!jwt.verification(req.cookies[nameToken])){
		res.redirect('/authorization');
		return;
	}
    req.idUser = jwt.getIdUserFromToken(req.cookies[nameToken])
    next();
});

app.use("/", router);


app.use((req, res) => {
    res.status(404);
    res.json({message: "not found"});   
})


/**
 * Подключение к БД NoSQL MongoDB
 * Запуск сервера для прослушивания обращений 
 */
async function main() {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/usersdb");
        app.listen(PORT);
        console.log("Server is waiting for a connection ...");
    }
    catch(err) {
        console.log(err);
    }
}
main();


/**
 * Прослушивание сигнала, останавливающий работу приложения
 * Отключение от БД MongoDB
 * Завершение процесса NODE.JS
 */
process.on("SIGINT", async() => {
    await mongoose.disconnect();
    process.exit();
});

