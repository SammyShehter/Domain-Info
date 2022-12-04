import dns from "dns"
import fs from "fs"
import {randomUUID} from "crypto"
import {Request, Response, NextFunction} from "express"
import MainService from "../services/main.service"
import {addresses} from "../types/dto.type"
import {handleError} from "../utils/common.utils"
import {ErrorCodes} from "../utils/error.utils"
import {requestObject} from "../types/http.types"
class MainMiddleware {
    constructor() {
        console.log("MainMiddleware instance created")
    }

    private stringIsAValidUrl = (s: string): boolean => {
        if (!s) return false
        const pattern = new RegExp(
            "^(https?:\\/\\/)?" +
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
                "((\\d{1,3}\\.){3}\\d{1,3}))" +
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
                "(\\?[;&a-z\\d%_.~+=-]*)?" +
                "(\\#[-a-z\\d_]*)?$",
            "i"
        )
        return !!pattern.test(s)
    }

    private standartizeDomain = (url: string) => {
        const splittedUrl = url.split(".")
        if (!splittedUrl[0].includes("http")) {
            url = "http://" + url
        }
        return new URL(url).hostname
    }

    private removeSubdomainFrom = function (fullUrl: string) {
        const subdomain = new RegExp(/^[^.]*\.(?=\w+\.\w+$)/)
        return fullUrl.replace(subdomain, "")
    }
    

    basicChecks = (reqObj: requestObject): string => {
        const {domain} = reqObj
        if (!domain) throw ErrorCodes.EMPTY_INPUT

        const urlIsValid = this.stringIsAValidUrl(domain)
        if (!urlIsValid) throw ErrorCodes.INVALID_INPUT
        return this.standartizeDomain(domain)
    }

    saveRequest = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        req.correlation_id = randomUUID()
        const message = `
Request ID: ${req.correlation_id}
Method: ${req.method} 
Requested URL: ${req.originalUrl} 
${
    Object.keys(req.body).length !== 0
        ? "Request Body: " + JSON.stringify(req.body) + "\n"
        : ""
}`
        console.log(message)

        fs.appendFile("app.log", message, () => {})
        next()
    }

    getReqChecks = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const domain = this.basicChecks(req.query)

            req.data = {
                domain,
            }

            return next()
        } catch (error) {
            handleError(error, req, res)
        }
    }

    postReqChecks = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const domain = this.basicChecks(req.body)

            const domainAlreadyExists = await MainService.checkIfDomainExists(
                domain
            )
            if (domainAlreadyExists) throw ErrorCodes.DOMAIN_ALREADY_EXISTS

            const urlIsAlive: Array<addresses> = await new Promise(
                (resolve, reject) => {
                    dns.lookup(
                        domain,
                        {
                            all: true,
                        },
                        (err, address) => {
                            if (err) reject(ErrorCodes.DOMAIN_IS_NOT_REACHABLE)
                            resolve(address)
                        }
                    )
                }
            )

            if (!urlIsAlive.length) throw ErrorCodes.DOMAIN_IS_NOT_REACHABLE

            req.data = {
                domain,
                originalDomain: this.removeSubdomainFrom(domain),
                addresses: urlIsAlive,
            }

            next()
        } catch (error) {
            handleError(error, req, res)
        }
    }
}

export default new MainMiddleware()
