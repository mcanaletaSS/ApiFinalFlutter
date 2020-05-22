module.exports.resultMessage = (res, status, error) => {
    switch (status) {
        case 200:
            res.status(status).json({message: "OK"});
            break;
        case 201:
            res.status(status).json({message: "Created"});
            break;
        case 400:
            if(error) return res.status(status).json({error: error.message});
            res.status(status).json({error: "Bad Request"});
            break;
        case 401:
            if(error) return res.status(status).json({error: error.message});
            res.status(status).json({error: "Unauthorized"});
            break;
        case 403:
            if(error) return res.status(status).json({error: error.message});
            res.status(status).json({error: "Forbidden"});
            break;
        case 404:
            res.status(status).json({error: "Not Found"});
            break;
        case 409:
            res.status(status).json({error: "Conflict"});
            break;
        case 500:
            if(error) return res.status(status).json({error: error.message});
            res.status(status).json({error: "Internal Server Error"});
            break;
    }
};