const express = require('express');
const registerRouter = express.Router();

const controller=require("../controllers/controller");

registerRouter.get("/", controller.registrationPage);
registerRouter.post("/",controller.registration);

module.exports = registerRouter;