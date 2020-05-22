const Joi = require('@hapi/joi');
const admin = require('../../../firebase').admin;
const UserDB = admin.firestore().collection('user');
const AuthDB = admin.firestore().collection('auth');
const GroupDB = admin.firestore().collection('group');
const axios = require('axios');
require('dotenv').config();
const resp = require('../../../middleware/responses');

exports.SendUserMessage = (req, res) => {
    const id = req.params.id;
    const fromPhoneNumber = req.userData.phoneNumber;
    const { message } = req.body;
    
    const schema = Joi.object({
        message: Joi.string(),
        fromPhoneNumber: Joi.string().required(),
        id: Joi.string().regex(RegExp('[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}')).message('UUID fails to match the required pattern').required()
    });
    const { error } = schema.validate({ fromPhoneNumber, message, id });
    if (error) return resp.resultMessage(res, 400, error);

    (async() => {
        try{
            const fromUserDoc = await (UserDB.doc(fromPhoneNumber.toString())).get();
            if(!fromUserDoc.exists) return resp.resultMessage(res, 403);
            const toUserDoc = await (UserDB.where('_id', '==', id)).get();
            if(!toUserDoc.docs.length > 0) return resp.resultMessage(res, 404);
            const AuthDoc = await (AuthDB.doc(toUserDoc.docs[0].ref.id.toString().trim())).get();
            if(!AuthDoc.exists) return resp.resultMessage(res, 404);
            const toUserTokens = AuthDoc.data().pushServiceToken;
            admin.messaging().sendMulticast({
                'tokens': toUserTokens,
                'notification': {
                    'body': message,
                    'title': fromUserDoc.data().username
                },
                'android': {
                    'priority': 'high'
                },
                'data': {
                    'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                    'userPhone': fromPhoneNumber,
                    'userID': fromUserDoc.data()._id,
                    'message': message
                }
            });
            resp.resultMessage(res, 200);
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};

exports.SendGroupMessage = (req, res) => {
    const uuid = req.params.uuid;
    const fromPhoneNumber = req.userData.phoneNumber;
    const { message } = req.body;
    
    const schema = Joi.object({
        message: Joi.string(),
        fromPhoneNumber: Joi.string().required(),
        uuid: Joi.string().regex(RegExp('[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}')).message('UUID fails to match the required pattern').required()
    });
    const { error } = schema.validate({ fromPhoneNumber, message, uuid });
    if (error) return resp.resultMessage(res, 400, error);

    (async() => {
        try{
            const GroupDoc = await (GroupDB.doc(uuid.toString().trim())).get();
            if(!GroupDoc.exists) return resp.resultMessage(res, 404);
            if(!GroupDoc.data().numbersList.includes(fromPhoneNumber)) return resp.resultMessage(res, 403);
            const toUserTokens = (await Promise.all(
                GroupDoc.data().numbersList.map(async toUserPhone => {                    
                    const AuthDoc = await (AuthDB.doc(toUserPhone.toString().trim())).get();
                    return AuthDoc.data().pushServiceToken;
                })
            )).filter(el => el != null);
            admin.messaging().sendMulticast({
                'tokens': toUserTokens,
                'notification': {
                    'body': message,
                    'title': GroupDoc.data().title | fromPhoneNumber,
                },
                'android': {
                    'priority': 'high'
                },
                'data': {
                    'click_action': 'FLUTTER_NOTIFICATION_CLICK',
                    'userPhone': fromPhoneNumber,
                    'uuid': GroupDoc.data().uuid,
                    'message': message
                }
            });
            resp.resultMessage(res, 200);
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};
