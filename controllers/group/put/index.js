const Joi = require('@hapi/joi');
const admin = require('../../../firebase').admin;
const UserDB = admin.firestore().collection('user');
const GroupDB = admin.firestore().collection('group');
const resp = require('../../../middleware/responses');

exports.AddUser = (req, res) => {
    const uuid = req.params.uuid;
    const userPhoneNumber = req.userData.phoneNumber;
    const { phoneNumber } = req.body;

    const schema = Joi.object({
        userPhoneNumber: Joi.number().required(),
        phoneNumber: Joi.number().required(),
        uuid: Joi.string().trim().regex(RegExp('[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}'))
        .message('UUID fails to match the required pattern').required()
    });
    const { error } = schema.validate({ userPhoneNumber, uuid, phoneNumber });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const GroupDoc = await (GroupDB.doc(uuid.toString().trim())).get();
            if(GroupDoc.empty) return resp.resultMessage(res, 404);            
            if(!GroupDoc.data().numbersList.includes(userPhoneNumber)) return resp.resultMessage(res, 403);
            if(GroupDoc.data().numbersList.includes(phoneNumber)) return resp.resultMessage(res, 409);
            await GroupDoc.ref.update({
                numbersList: admin.firestore.FieldValue.arrayUnion(phoneNumber)
            });
            //Notificar tens nou grup / afegit nou usuari
            res.status(200).json({'message': 'OK'});
        }catch(err){            
            return resp.resultMessage(res, 500);
        }
    })();
};

exports.RemoveUser = (req, res) => {
    const uuid = req.params.uuid;
    const userPhoneNumber = req.userData.phoneNumber;
    const { phoneNumber } = req.body;

    const schema = Joi.object({
        userPhoneNumber: Joi.number().required(),
        phoneNumber: Joi.number().required(),
        uuid: Joi.string().regex(RegExp('[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}'))
        .message('UUID fails to match the required pattern').required()
    });
    const { error } = schema.validate({ userPhoneNumber, uuid, phoneNumber });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const GroupDoc = await (GroupDB.doc(uuid.toString().trim())).get();
            if(GroupDoc.empty) return resp.resultMessage(res, 404);            
            if(!GroupDoc.data().numbersList.includes(userPhoneNumber)) return resp.resultMessage(res, 403);
            if(!GroupDoc.data().numbersList.includes(phoneNumber)) return resp.resultMessage(res, 404);
            await GroupDoc.ref.update({
                numbersList: admin.firestore.FieldValue.arrayRemove(phoneNumber)
            });
            //Notificar has estat eliminat / ha sortit del grup
            res.status(200).json({'message': 'OK'});
        }catch(err){            
            return resp.resultMessage(res, 500);
        }
    })();
};

exports.PutGroupTitle = (req, res) => {
    const uuid = req.params.uuid;
    const phoneNumber = req.userData.phoneNumber;
    const { title } = req.body;

    const schema = Joi.object({
        title: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        uuid: Joi.string().regex(RegExp('[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}')).message('UUID fails to match the required pattern').required()
    });
    const { error } = schema.validate({ title, uuid, phoneNumber });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const GroupDoc = await (GroupDB.doc(uuid.toString().trim())).get();
            if(GroupDoc.empty) return resp.resultMessage(res, 404);
            if(!GroupDoc.data().numbersList.includes(phoneNumber)) return resp.resultMessage(res, 403);
            await GroupDoc.ref.update({title: title});
            //Notificar nou title
            res.status(200).json({'message': 'OK'});
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};

exports.PutGroupDescription = (req, res) => {
    const uuid = req.params.uuid;
    const phoneNumber = req.userData.phoneNumber;
    const { description } = req.body;

    const schema = Joi.object({
        description: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        uuid: Joi.string().regex(RegExp('[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}')).message('UUID fails to match the required pattern').required()
    });
    const { error } = schema.validate({ description, uuid, phoneNumber });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const GroupDoc = await (GroupDB.doc(uuid.toString().trim())).get();
            if(GroupDoc.empty) return resp.resultMessage(res, 404);
            if(!GroupDoc.data().numbersList.includes(phoneNumber)) return resp.resultMessage(res, 403);
            await GroupDoc.ref.update({description: description});
            //Notificar nova descripcio
            res.status(200).json({'message': 'OK'});
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};

exports.PutGroupPhoto = (req, res) => {
    const uuid = req.params.uuid;
    const phoneNumber = req.userData.phoneNumber;
    const { photo } = req.body;

    const schema = Joi.object({
        photo: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        uuid: Joi.string().regex(RegExp('[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}')).message('UUID fails to match the required pattern').required()
    });
    const { error } = schema.validate({ photo, uuid, phoneNumber });
    if (error) return resp.resultMessage(res, 400, error);
    
    (async() => {
        try{
            const GroupDoc = await (GroupDB.doc(uuid.toString().trim())).get();
            if(GroupDoc.empty) return resp.resultMessage(res, 404);
            if(!GroupDoc.data().numbersList.includes(phoneNumber)) return resp.resultMessage(res, 403);
            await GroupDoc.ref.update({photo: photo});
            //Notificar nova imatge
            res.status(200).json({'message': 'OK'});
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};