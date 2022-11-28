const express = require('express');
const authorizationRouter = express.Router();

const controller=require("../controllers/controller");

authorizationRouter.post("/",controller.authorization);

module.exports = authorizationRouter;