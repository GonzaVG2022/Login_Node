const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt'); //encriptaoor
const jwt = require('jsonwebtoken');


const getAll = catchError(async(req, res) => {//exclude es para excluir ese campo {attributes: {exclude: ["password"]}}
    const results = await User.findAll(); //opcion para mostrar unicamente estos atributos {attributes: ["firstName", "lastName"]}
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { firstName, lastName, password, email } = req.body;
    const encritedPassword = await bcrypt.hash( password, 10 ); //encriptamos la contraseña
    const result = await User.create({ firstName, lastName, password:encritedPassword, email });
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const user = req.user;
    console.log(user);
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    const result = await User.update(
        { firstName, lastName, email },
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});
// 1) buscar a un usuario con el email del body y lo retornamos
// 2) Corroborar que la contraseña del body sea la mism de la del usuario encontrado
// 3) crear token
const login = catchError(async( req, res ) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: {email}});
    if(!user) return res.status(401).json({message: "Invalid credentials E"});
    user.password;
    const isValid = await bcrypt.compare( password, user.password );
    if (!isValid) return res.status(401).json({message: "Invalid credentials P"});
    const token = jwt.sign( //generamos el token
        { user },
        process.env.TOKEN_SECRET, 
        {expiresIn: "1d"}
    )
    return res.json({user, token});
});

const getLoggerUser = catchError( async( req, res ) => {
    const user = req.user;
    return res.json(user);
} )


module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login,
    getLoggerUser
}