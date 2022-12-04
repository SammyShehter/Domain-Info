import mongoose, {Schema} from "mongoose"
import {EventEmitter} from "stream"
import { domain, domainInsert } from "../types/dto.type"

class MongooseService {
    private domainSchema = new Schema<domain>(
        {
            domain: {type: String, require: true, unique: true},
            originalDomain: {type: String},
            info: {
                VirusTotal: {type: Schema.Types.Mixed, default: null},
                Whois: {type: Schema.Types.Mixed, default: null},
            },
            addresses: {
                type: [
                    {
                        address: String,
                        family: String,
                    },
                ],
                _id: false,
            },
            checked: {type: Boolean, default: false},
        },
        {timestamps: true, versionKey: false}
    )
    constructor() {
        console.log("MongooseService instance created")
    }

    static connectWithRetry = (
        eventEmmiter: EventEmitter,
        count: number = 0,
        retryAttempt: number = 5,
        retrySeconds: number = 5
    ) => {
        if (count >= retryAttempt) {
            console.log("Connection to Mongo DB failed")
            process.exit(1)
        }
        console.log("Attemptin to connect to Mongo DB")
        mongoose
            .connect(process.env["MONGO_CONNECTION_STRING"] as string)
            .then(() => {
                console.log("MongoDB is connected")
                eventEmmiter.emit("ready")
            })
            .catch(async (err) => {
                count++
                console.log(
                    `MongoDB connection failed, will retry ${count}/${retryAttempt} attempt after ${retrySeconds} seconds`,
                    err.message
                )
                setTimeout(
                    () => MongooseService.connectWithRetry(eventEmmiter, count),
                    retrySeconds * 1000
                )
            })
    }

    domainsStorage = mongoose.model<domain>("domainInfo", this.domainSchema)

    addDomain = async (data: domainInsert): Promise<domain> => {
        return this.domainsStorage.create({
            domain: data.domain,
            originalDomain: data.originalDomain,
            addresses: data.addresses,
        })
    }

    checkIfDomainExists = async (domain: string): Promise<domain | null> => {
        return this.getDomainInfo(domain)
    }

    getDomainInfo = async (domain: string): Promise<domain | null> => {
        return this.domainsStorage.findOne({domain}, {_id: 0}).lean().exec()
    }
}

export default MongooseService
