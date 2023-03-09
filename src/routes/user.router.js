const { getAll, create, getOne, remove, update, login, getLoggerUser } = require('../controllers/user.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');

const userRouter = express.Router();

userRouter.route('/')
    .get(verifyJWT, getAll)
    .post(create);
userRouter.route('/login')//rutas fijas ciempre arriba de dinamicas
    .post(login);
userRouter.route('/me')
    .get(verifyJWT, getLoggerUser);
userRouter.route('/:id')
    .get(verifyJWT, getOne)//verifyJWT proteje
    .delete(remove)
    .put(update);


module.exports = userRouter;