const { CustomError } = require("../config/error")
const { errorRef, httpCode } = require("../constant/error")

module.exports.errorMiddlewares = (err, req, res, _next) => {
    if (err instanceof CustomError) {
        res.status(err.status)
    } else if (err instanceof Error) {
        switch (err.name) {
            case errorRef.TOKEN_EXPIRED:
                res.status(httpCode["401_UNAUTHORIZED"])
                break
            case errorRef.TOKEN_INVALID:
                res.status(httpCode["400_BAD_REQUEST"])
                break
            default:
                res.status(httpCode["500_INTERNAL_SERVER_ERROR"])
                break
        }
    } else {
        res.status(httpCode["500_INTERNAL_SERVER_ERROR"])
    }
    res.json({ message: err.message, ref: err.name })
    return
}
