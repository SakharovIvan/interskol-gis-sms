import {getTelephonestoSent,updatesqlsmsStatusData} from '../__fixtures__/GISSQLBD.js'
import { pool } from "../config.js";

const sqlformatdate=(number=0)=>{
    let now = new Date()
    now.setDate(now.getDate()-number)
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    month<=9 ? month = `0${month}`: month = month
return `${day}-${month}-${year}`
}

const ctreateTlfArrayOpros =async ()=>{
    const date1= sqlformatdate(8)
    const date2 = sqlformatdate(7)
    const tlfobject =  await pool.query(getTelephonestoSent(date1,date2,'sms_status_opros'))
    const tlfArray =  tlfobject.rows.map((obj)=>{
        pool.query(updatesqlsmsStatusData(obj.asc_ndk,obj.asc_kod,obj.cli_telephone,'sms_status_opros'))
        console.log(obj.cli_telephone)
        return obj.cli_telephone})
    return Promise.all(tlfArray)
}

const ctreateTlfArray = async (smsStatus)=>{
    const date1= sqlformatdate()
    const date2 = sqlformatdate(1)
    const tlfobject =  await pool.query(getTelephonestoSent(date1,date2,smsStatus))
    const tlfArray =  tlfobject.rows.map((obj)=>{
         pool.query(updatesqlsmsStatusData(obj.asc_ndk,obj.asc_kod,obj.cli_telephone,smsStatus))
         return obj.cli_telephone})
     return Promise.all(tlfArray)

}

export  {ctreateTlfArray,ctreateTlfArrayOpros}