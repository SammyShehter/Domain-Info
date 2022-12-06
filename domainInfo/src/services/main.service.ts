import {domainInsert} from "../types/dto.type"
import {domainResponse, singleAnswer} from "../types/http.types"
import {ErrorCodes} from "../utils/error.utils"
import MongooseService from "./mongo.service"
import axios from "axios"

class MainService {
    private db: MongooseService

    constructor(DB: any) {
        this.db = new DB()
        console.log("MainService instance created")
    }

    private virusTotalReqOptions = (encodedParams: URLSearchParams) => ({
        method: "POST",
        url: process.env.VIRUS_URL,
        headers: {
            accept: "application/json",
            "content-type": "application/x-www-form-urlencoded",
            "x-apikey": process.env.VIRUS_APIKEY,
        },
        data: encodedParams,
    })

    private virusTotalAnalizeID = async (domain: string): Promise<any> => {
        try {
            const encodedParams = new URLSearchParams()
            encodedParams.set("url", domain)
            const {data} = await axios.request(
                this.virusTotalReqOptions(encodedParams)
            )

            return data.data.id
        } catch (error: any) {
            throw ErrorCodes.CALL_TO_VIRUS_TOTAL_FAILED(error.message)
        }
    }

    checkIfDomainExists = async (data: string): Promise<boolean> => {
        const requestedDomain = await this.db.checkIfDomainExists(data)
        return !!requestedDomain
    }

    getDominaInfo = async (
        data: string
    ): Promise<domainResponse | singleAnswer> => {
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
        data.info.VirusTotal = await this.virusTotalAnalizeID(data.domain)
        return this.db.addDomain(data)
    }
}

export default new MainService(MongooseService)
