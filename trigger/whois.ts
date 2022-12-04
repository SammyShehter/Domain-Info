import {domain} from "./types"
const whois = require("whois")

export async function whoisData({originalDomain}: domain): Promise<string> {
     return new Promise((resolve, reject) => 
        whois.lookup(originalDomain, function (err: any, data: any) {
            if(err) reject(err)
            resolve(data)
        })
    )
}
