import {addresses, domainInfo} from "./dto.type"

export type domainResponse = {
    domain: string
    info: domainInfo
    originalDomain: string
    addresses: Array<addresses>
}

export type singleAnswer = {message: string}

export type requestObject = {domain?: string}
