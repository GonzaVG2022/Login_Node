const express = require('express');
const toDoRouter = require('./toDo.router');
const userRouter = require('./user.router');

const router = express.Router();

// colocar las rutas aquí
router.use("/users", userRouter);
router.use("/todos", toDoRouter);

module.exports = router;