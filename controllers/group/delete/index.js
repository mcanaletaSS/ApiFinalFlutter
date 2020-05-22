const Joi = require('@hapi/joi');
const admin = require('../../../firebase').admin;
const GroupDB = admin.firestore().collection('group');
const resp = require('../../../middleware/responses');

exports.DeleteGroup = (req, res) => {
    const phoneNumber = req.userData.phoneNumber;
    const uuid = req.params.uuid;

    const schema = Joi.object({
        phoneNumber: Joi.number().required(),
        uuid: Joi.string().regex(RegExp('[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}')).message('UUID fails to match the required pattern').required()
    });
    const { error } = schema.validate({ phoneNumber, uuid });
    if (error) return resp.resultMessage(res, 400, error);

    (async() => {
        try{
            const GroupDoc = await (GroupDB.doc(uuid.toString().trim())).get();
            if(!GroupDoc.exists) return resp.resultMessage(res, 404);
            if(!GroupDoc.data().numbersList.includes(phoneNumber)) return resp.resultMessage(res, 403);
            await GroupDoc.ref.delete();
            //Notificar grup eliminat als membres
            resp.resultMessage(res, 200);  
        }catch(err){
            return resp.resultMessage(res, 500);
        }
    })();
};