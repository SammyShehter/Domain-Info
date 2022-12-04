import {Request, Response} from "express"
import MainService from "../services/main.service"
import {domainResponse, singleAnswer} from "../types/http.types"
import {handleError, handleSuccess} from "../utils/common.utils"

class MainController {
    constructor() {
        console.log("MainController instance created")
    }

    getDomainInfo = async (req: Request, res: Response) => {
        try {
            const {domain} = req.data
            const data: domainResponse | singleAnswer =
                await MainService.getDominaInfo(domain)
            return handleSuccess(data, res)
        } catch (error) {
            return handleError(error, req, res)
        }
    }

    addDomain = async (req: Request, res: Response) => {
        try {
            const {domain, addresses, originalDomain} = req.data
            await MainService.addDomain({domain, originalDomain, addresses})
            return handleSuccess(
                {message: `Domain added successfully under name: ${domain}`},
                res
            )
        } catch (error) {
            return handleError(error, req, res)
        }
    }
}

export default new MainController()
