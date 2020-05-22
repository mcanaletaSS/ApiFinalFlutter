const Joi = require('@hapi/joi');
const admin = require('../../../firebase').admin;
const UserDB = admin.firestore().collection('user');
const AuthDB = admin.firestore().collection('auth');
const resp = require('../../../middleware/responses');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
require('dotenv').config();

exports.CreateUser = (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    const { pushServiceToken, photo, state, username } = req.body;
    const schema = Joi.object({
        phoneNumber: Joi.number().required(),
        photo: Joi.string(),
        pushServiceToken: Joi.string().required(),
        state: Joi.string(),
        username: Joi.string().required()
    });
    const { error } = schema.validate({ phoneNumber, pushServiceToken, photo, state, username });
    if (error) return resp.resultMessage(res, 400, error);
    const _id = uuid.v4();
    (async() => {
        try{
            const UserDoc = await (UserDB.doc(phoneNumber.toString())).get();
            if(UserDoc.exists) return resp.resultMessage(res, 409);
            await UserDoc.ref.set({
                _id: _id,
                photo: photo,
                state: state,
                username: username
            });
            const AuthDoc = await (AuthDB.doc(phoneNumber.toString())).get();
            if(AuthDoc.exists) return resp.resultMessage(res, 409);
            await AuthDoc.ref.set({pushServiceToken: [pushServiceToken]});
            var token = jwt.sign({
                phoneNumber: phoneNumber,
                userId: _id
            },process.env.jwtKey);
            res.status(201).json({message: 'Created', token: token});  
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};

exports.VerifyNumbers = (req, res) => {
    const numbersList = req.body.numbersList;
    const userPhoneNumber = req.userData.phoneNumber;
    
    const schema = Joi.object({
        numbersList: Joi.array().items(Joi.object()).required(),
    });
    const { error } = schema.validate({ numbersList });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const UserPhoneDoc = await (UserDB.doc(userPhoneNumber.toString())).get();
            if(!UserPhoneDoc.exists) return resp.resultMessage(res, 403);
            let UsersData = (await Promise.all(
                numbersList.map(async member => {
                        const UserDoc = await UserDB.doc(member.phone.toString()).get();
                        if(UserDoc.exists) return {
                            '_id': UserDoc.data()._id,
                            'photo': UserDoc.data().photo,
                            'state': UserDoc.data().state,
                            'username': UserDoc.data().username,
                            'phone': member.phone,
                            'name': member.name
                        };
                        return;
                })
            )).filter(el => el != null);
            res.status(200).json(UsersData);
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};
