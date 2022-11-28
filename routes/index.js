const express = require('express');
const router = express.Router();

const controller=require("../controllers/controller");

router.post("/createTask",controller.createTask);
router.get("/getTask",controller.getTask);
router.get("/getTask/:id", controller.getTaskId);
router.delete("/delTask/:id", controller.delTask);
router.put("/updateTask", controller.updateTask);

module.exports = router;