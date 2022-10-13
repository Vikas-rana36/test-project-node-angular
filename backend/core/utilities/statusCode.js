const CODES = {
    SUCCESS: {
        OK: 200,
        created: 201,
        accepted: 202,
        NO_CONTENT: 204
    },
    REDIRECTION: {
        MULTIPLE_CHOICES: 300,
        MOVED_PERMANENTLY: 301,
        NOT_FOUND: 302

    },
    CLIENT_ERROR: {
        badRequest: 400,
        unauthorized: 401,
        PAYMENT_REQUIRED: 402,
        FORBIDDEN: 403,
        notFound: 404,
        METHOD_NOT_ALLOWED: 405,
        valueAlreadyExist: 409
    },
    SERVER_ERROR: {
        internalServerError: 500,
        NOT_IMPLEMENTED: 501,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503,
        GATEWAY_TIMEOUT: 504,
        HTTP_VERSION_NOT_SUPPORTED: 505,
        NETWORK_CONNECT_TIMEOUT: 599,
    }
   
}


module.exports.CODES = CODES
