const Joi = require('@hapi/joi');
const admin = require('../../../firebase').admin;
const AuthDB = admin.firestore().collection('auth');
const UserDB = admin.firestore().collection('user');
const resp = require('../../../middleware/responses');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.Login = (req, res) => {
    const { phoneNumber, pushServiceToken } = req.body;
    const schema = Joi.object({
        phoneNumber: Joi.number().required(),
        pushServiceToken: Joi.string().required()
    });
    const { error } = schema.validate({ phoneNumber, pushServiceToken });
    if (error) return resp.resultMessage(res, 400, error);
    (async() => {
        try{
            const AuthDoc = await (AuthDB.doc(phoneNumber.toString())).get();
            const UserDoc = await (UserDB.doc(phoneNumber.toString())).get();
            if(!AuthDoc.exists) return resp.resultMessage(res, 401);
            if(!UserDoc.exists) return resp.resultMessage(res, 401);
            if(!((AuthDoc.data()).pushServiceToken.includes(pushServiceToken))){
                await AuthDoc.ref.update({ pushServiceToken: admin.firestore.FieldValue.arrayUnion(pushServiceToken) });
            }
            var token = jwt.sign({
                phoneNumber: phoneNumber,
                userId: (UserDoc.data())._id
            },process.env.jwtKey);
            res.status(200).json({message: "OK", token: token});
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};

