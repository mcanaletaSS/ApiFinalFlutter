const Joi = require('@hapi/joi');
const admin = require('../../../firebase').admin;
const UserDB = admin.firestore().collection('user');
const GroupDB = admin.firestore().collection('group');
const resp = require('../../../middleware/responses');

exports.CreateGroup = (req, res) => {
    const uuid = req.params.uuid;
    const phoneNumber = req.userData.phoneNumber;
    const { numbersList, photo, description, title } = req.body;
    
    const schema = Joi.object({
        phoneNumber: Joi.number().required(),
        numbersList: Joi.array().items(Joi.number()),
        photo: Joi.string(),
        description: Joi.string(),
        title: Joi.string().required(),
        uuid: Joi.string().regex(RegExp('[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}')).message('UUID fails to match the required pattern').required()
    });
    const { error } = schema.validate({ phoneNumber, numbersList, photo, description, title, uuid });
    if (error) return resp.resultMessage(res, 400, error);

    (async() => {
        try{
            const UserPhoneDoc = await (UserDB.doc(phoneNumber.toString())).get();
            if(!UserPhoneDoc.exists) return resp.resultMessage(res, 403);
            const GroupDoc = await (GroupDB.doc(uuid.toString())).get();
            if(GroupDoc.exists) return resp.resultMessage(res, 409);
            await GroupDoc.ref.set({
                numbersList: numbersList,
                photo: photo,
                description: description,
                title: title
            });
            //TODO: Enviar missatge new-group als membres
            resp.resultMessage(res, 201);
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};
