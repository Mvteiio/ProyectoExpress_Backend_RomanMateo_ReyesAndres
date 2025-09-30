const { validationResult } = require('express-validator');  
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');


class UserController {
    constructor(){
        
    }

    async register(req, res){

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const {username, email, password} = req.body;
            const existingUser = await UserRepository.findByEmail(email);

            if(existingUser){
                
                return res.status(400).json({
                msg: "El usuario ya existe"
            });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserRepository.create({
                username,
                email,
                password: hashedPassword,
                role: "usuario"
            });
            res.status(201).json({
                msg: "Usuario Registrado con exito",
                data: newUser
            })
        }   
        catch (err){
            res.status(500).json({error: err.message})
        }
    }

    async login (req, res){

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try{
            const {email, password} = req.body;
            const existingUser = await UserRepository.findByEmail(email);

            if(!existingUser){
                return res.status(404).json({
                    msg: "El usuario no existe"
                });
            }

            const validPassword = await bcrypt.compare(password, existingUser.password);
            if(!validPassword){
                return res.status(401).json({
                    msg: "La contraseña es invalida"  
                })
            }

            const payload = {
                id: existingUser._id,
                role: existingUser.role 
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES
            });
            
            res.status(202).json({
                msg: "Login Exitoso",
                token
            })

        }
        catch(err){
            res.status(500).json({error: err.message});
        }
    }

    // async updateUser(req, res){
    //     try {
    //         const {id} = req.user;
    //         const {name, email} = req.body;

    //         await UserRepository.updateUser(id, {name, email});
    //         res.status(200).json({
    //             msg: "Usuario actualizado con éxito."
    //         })
    //     }
    //     catch(err){
    //         res.status(500).json({error: err.message});
    //     }
    // }

    // async updatePassword(req, res){
    //     try {
    //         const {id} = req.user;
    //         const {password} = req.body;

    //         const hashedPassword = await bcrypt.hash(password, 10)
    //         await UserRepository.updateUser(id, {password: hashedPassword});
    //         res.status(200).json({
    //             msg: "Contraseña actualizada con éxito."
    //         })
    //     }
    //     catch(err){
    //         res.status(500).json({error: err.message});
    //     }
    // }
}

module.exports = UserController;