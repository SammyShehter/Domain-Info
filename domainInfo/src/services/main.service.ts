import { domainInsert } from "../types/dto.type"
import { domainResponse, singleAnswer } from "../types/http.types"
import {ErrorCodes} from "../utils/error.utils"
import MongooseService from "./mongo.service"

class MainService {
    private db: MongooseService

    constructor(DB: any) {
        this.db = new DB()
        console.log("MainService instance created")
    }

    checkIfDomainExists = async (data: string): Promise<boolean> => {
        const requestedDomain = await this.db.checkIfDomainExists(data)
        return !!requestedDomain
    }

    getDominaInfo = async (data: string): Promise<domainResponse | singleAnswer> => {
        const domainInfo = await this.db.getDomainInfo(data)
        if (!domainInfo) {
            throw ErrorCodes.DOMAIN_DOES_NOT_EXISTS
        }
        if (!domainInfo.checked) {
            return {message: "Please check back later"}
        }
        return {
            domain: domainInfo.domain,
            originalDomain: domainInfo.originalDomain,
            info: domainInfo.info,
            addresses: domainInfo.addresses,
        }
    }

    addDomain = async (data: domainInsert) => {
        return this.db.addDomain(data)
    }
}

export default new MainService(MongooseService)
