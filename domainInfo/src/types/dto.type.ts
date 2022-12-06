import {Schema} from "mongoose"

export type domainInsert = {
    domain: string
    info: domainInfo
    originalDomain: string
    addresses: Array<addresses>
}

export type domainInfo = {
    VirusTotal: any
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
