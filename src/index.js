import {GIS_SERVICE_FUNC} from './services/gis-service.js'
import { SMS_SERVICE_FUNC } from './services/sms-service.js'
import mtsService from './services/mts-service.js'

export async function sms_job() {
    try {
        const tlf= await SMS_SERVICE_FUNC()
        await mtsService.sentSMS_smtp(tlf)
     } catch (error) {
         console.log(error)
     }
}

export async function gis_DB_job() {
    try {
        await GIS_SERVICE_FUNC(true)
    } catch (error) {
        console.log(error)
    } 

}