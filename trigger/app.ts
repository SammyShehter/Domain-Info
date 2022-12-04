import fs from "fs"
import cron from "node-cron"
import {EventEmitter} from "stream"
import MongooseService from "./mongo"
import {configJson} from "./types"
import {virusTotal} from "./virusTotal"
import {whoisData} from "./whois"

// init events
const initEvents = new EventEmitter()
MongooseService.connectWithRetry(initEvents)

//funcs
const readConfig = (configFileName: string): configJson =>
    JSON.parse(fs.readFileSync(configFileName).toString())

const gainDomainInfo = async (db: MongooseService): Promise<void> => {
    const data = await db.getUncheckedDomains()
    if (!data.length) return

    for await (const item of data) {
        item.info.Whois = await whoisData(item)
        item.info.VirusTotal = await virusTotal(item)
        item.checked = true
        await db.updatedDomain(item)  
    }
    console.log(new Date().toLocaleString(), "\nDomain info gathering is DONE!\n")
}

const startCron = (cronTask: string, db: MongooseService): cron.ScheduledTask => {
    return cron.schedule(cronTask, () => gainDomainInfo(db))
}

const checkIfConfigChanged = (
    cronTask: string,
    configFileName: string,
    scheduledTask: cron.ScheduledTask,
    db: MongooseService
): void => {
    const config = readConfig(configFileName)
    if (config.cronTask !== cronTask) {
        cronTask = config.cronTask
        scheduledTask.stop()
        scheduledTask = startCron(cronTask, db)
    }
}

const startTriggerApp = (): void => {
    const db = new MongooseService()
    const configFileName = "./config.json"
    let {cronTask} = readConfig(configFileName)
    let task = startCron(cronTask, db)

    setInterval(
        () => checkIfConfigChanged(cronTask, configFileName, task, db),
        30000
    )
}

//ignite
initEvents.once("ready", startTriggerApp)
