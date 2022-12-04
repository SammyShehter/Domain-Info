import {Schema} from "mongoose"

export type configJson = {cronTask: string}

export type domainInfo = {
    VirusTotal: any //TODO add type
    Whois: string
}

export type addresses = {address: string; family: number}

export type domain = {
    _id: Schema.Types.ObjectId
    domain: string
    originalDomain: string
    info: domainInfo
    addresses: Array<addresses>
    checked: boolean
    createdAt: Schema.Types.Date
    updatedAt: Schema.Types.Date
}
