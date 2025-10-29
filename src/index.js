import {GIS_SERVICE_FUNC} from './services/gis-service.js'


export async function gis_DB_job() {
    try {
        await GIS_SERVICE_FUNC(true)
    } catch (error) {
        console.log(error)
    } 

}