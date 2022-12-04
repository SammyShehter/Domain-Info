import {userErrorMessage} from "../types/error.type"

export class ErrorCodes {
    static get GENERAL_ERROR(): userErrorMessage {
        return {
            message: "GENERAL ERROR",
        }
    }

    static get EMPTY_INPUT(): userErrorMessage {
        return {
            message: "EMPTY INPUT",
            action: "Please provide a valid domain",
            innerMessage: "No domain provided",
        }
    }

    static get INVALID_INPUT(): userErrorMessage {
        return {
            message: "INVALID INPUT",
            action: "This endpoint recieves only 'domain' as key an input should be a valid URL",
            innerMessage: "Provided domain is not a valid URL",
        }
    }

    static get DOMAIN_ALREADY_EXISTS(): userErrorMessage {
        return {
            message: "DOMAIN ALREADY EXISTS",
            action: "This domain already registered. Please provide another one",
            innerMessage: "Domain already exists",
        }
    }

    static get DOMAIN_DOES_NOT_EXISTS(): userErrorMessage {
        return {
            message: "DOMAIN DOES NOT EXISTS",
            action: "This domain is not registered. Try to register it first",
            innerMessage: "Requested domain is not registered",
        }
    }

    static get DOMAIN_IS_NOT_REACHABLE(): userErrorMessage {
        return {
            message: "DOMAIN IS NOT REACHABLE",
            action: "This domain might be inactive. Please try another one",
            innerMessage: "Domain is shut down or inactive",
        }
    }
}
