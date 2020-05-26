const Joi = require('@hapi/joi');
const admin = require('../../../firebase').admin;
const UserDB = admin.firestore().collection('user');
const resp = require('../../../middleware/responses');


exports.PutAllUser = (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    const {username, photo, state} = req.body;
    
    const schema = Joi.object({
        username: Joi.string().required(),
        state: Joi.string().required(),
        photo: Joi.string().required()
    });
    const { error } = schema.validate({ username, photo, state });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const UserDocs = await (UserDB.doc(phoneNumber.toString())).get();
            if(UserDocs.exists) return resp.resultMessage(res, 404);
            await UserDocs.ref.update({
                username: username,
                state: state,
                photo: photo
            });
            res.status(200).json({'message': 'OK', '_id': UserDocs.data()});
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};

exports.PutUserUsername = (req, res) => {
    const userId = req.userData.userId;
    const username = req.body.username;
    
    const schema = Joi.object({
        username: Joi.string().required()
    });
    const { error } = schema.validate({ username });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const UserDocs = await (UserDB.where('_id', '==', userId)).get();
            if(UserDocs.empty) return resp.resultMessage(res, 404);
            await UserDocs.docs[0].ref.update({username: username});
            res.status(200).json({'message': 'OK'});
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};
exports.PutUserPhoto = (req, res) => {
    const userId = req.userData.userId;
    const photo = req.body.photo;

    const schema = Joi.object({
        photo: Joi.string().required()
    });
    const { error } = schema.validate({ photo });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const UserDocs = await (UserDB.where('_id', '==', userId)).get();
            if(UserDocs.empty) return resp.resultMessage(res, 404);
            await UserDocs.docs[0].ref.update({photo: photo});
            res.status(200).json({'message': 'OK'});
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};
exports.PutUserState = (req, res) => {
    const userId = req.userData.userId;
    const state = req.body.state;

    const schema = Joi.object({
        state: Joi.string().required()
    });
    const { error } = schema.validate({ state });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const UserDocs = await (UserDB.where('_id', '==', userId)).get();
            if(UserDocs.empty) return resp.resultMessage(res, 404);
            await UserDocs.docs[0].ref.update({state: state});
            res.status(200).json({'message': 'OK'});
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};