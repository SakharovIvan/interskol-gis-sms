import {getTelephonestoSent} from '../__fixtures__/GISSQLBD.js'
import { pool } from "../config.js";

const ctreateTlfArray = ()=>{
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDay()
    month<=9 ? month = `0${month}`: month = month
    const date1= day+'-'+month+'-'+year
    const date2 = (day-1)+'-'+month+'-'+year
    const tlfArray=  pool.query(getTelephonestoSent(`WHERE date_prin ='${date1}' or date_prin = '${date2}' GROUP BY cli_telephone`))
    .then((tlfobject)=>{ return tlfobject.rows.map((obj)=>{return obj.cli_telephone})})
    return tlfArray
}

export default (ctreateTlfArray)