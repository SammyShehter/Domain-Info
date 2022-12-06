import axios from "axios"
import {domain} from "./types"

const options = (domain: string) => ({
    method: "GET",
    url: `${process.env.VIRUS_URL}/${encryptURL(domain)}`,
    headers: {
        accept: "application/json",
        "x-apikey": process.env.VIRUS_APIKEY,
    },
})

function encryptURL(url: string): string {
    return Buffer.from(url).toString("base64url")
}

export async function virusTotalData({domain}: domain): Promise<any> {
    try {
        const {data} = await axios.request(options(domain))
        return data
    } catch (error: any) {
        reportError(error.message)
        return false
    }
}
