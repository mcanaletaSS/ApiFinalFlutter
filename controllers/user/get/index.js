const Joi = require('@hapi/joi');
const admin = require('../../../firebase').admin;
const UserDB = admin.firestore().collection('user');
const resp = require('../../../middleware/responses');

exports.GetUser = (req, res) => {
    const phoneNumber = req.params.phoneNumber; 
    const userPhoneNumber = req.userData.phoneNumber;
    
    const schema = Joi.object({
        phoneNumber: Joi.string().required(),
    });
    const { error } = schema.validate({ phoneNumber });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const UserPhoneDoc = await (UserDB.doc(userPhoneNumber.toString())).get();
            if(!UserPhoneDoc.exists) return resp.resultMessage(res, 403);
            const UserDoc = await (UserDB.doc(phoneNumber.toString())).get();
            if(!UserDoc.exists) return resp.resultMessage(res, 404);
            const User = UserDoc.data();
            res.status(200).json(User);
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};