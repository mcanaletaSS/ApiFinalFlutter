const Joi = require('@hapi/joi');
const admin = require('../../../firebase').admin;
const UserDB = admin.firestore().collection('user');
const AuthDB = admin.firestore().collection('auth');
const resp = require('../../../middleware/responses');

exports.DeleteUser = (req, res) => {
    const phoneNumber = req.userData.phoneNumber;

    const schema = Joi.object({
        phoneNumber: Joi.number().required(),
    });
    const { error } = schema.validate({ phoneNumber });
    if (error) return resp.resultMessage(res, 400, error);

    (async() => {
        try{
            const UserDoc = await (UserDB.doc(phoneNumber.toString())).get();
            if(!UserDoc.exists) return resp.resultMessage(res, 404);
            await UserDoc.ref.delete();
            const AuthDoc = await (AuthDB.doc(phoneNumber.toString())).get();
            if(!AuthDoc.exists) return resp.resultMessage(res, 404);
            await AuthDoc.ref.delete();
            resp.resultMessage(res, 200);  
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};