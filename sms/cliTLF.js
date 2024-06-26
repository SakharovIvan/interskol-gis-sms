import {getTelephonestoSent,updatesqlsmsStatusData} from '../__fixtures__/GISSQLBD.js'
import { pool } from "../config.js";

const ctreateTlfArrayPrin = ()=>{
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    month<=9 ? month = `0${month}`: month = month
    const date1= day+'-'+month+'-'+year
    const date2 = (day-1)+'-'+month+'-'+year
    const tlfArray=  pool.query(getTelephonestoSent(date1,date2,'sms_status_prin'))
    .then((tlfobject)=>{
        return tlfobject.rows.map((obj)=>{
            pool.query(updatesqlsmsStatusData(obj.asc_ndk,obj.asc_kod,obj.cli_telephone,'sms_status_prin'))
            
            return obj.cli_telephone})})
    .then((tlfArrayfromObj)=>{
        return [...new Set(tlfArrayfromObj)]
    })
    return tlfArray
}
const ctreateTlfArrayOpros = ()=>{
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let day = now.getDate()
    month<=9 ? month = `0${month}`: month = month
    const date1= (day-8)+'-'+month+'-'+year
    const date2 = (day-7)+'-'+month+'-'+year
    const tlfArray=  pool.query(getTelephonestoSent(date1,date2,'sms_status_opros'))
    .then((tlfobject)=>{
        return tlfobject.rows.map((obj)=>{
            pool.query(updatesqlsmsStatusData(obj.asc_ndk,obj.asc_kod,obj.cli_telephone,'sms_status_opros'))
            
            return obj.cli_telephone})})
    .then((tlfArrayfromObj)=>{
        return [...new Set(tlfArrayfromObj)]
    })
    
    return tlfArray
}

export  {ctreateTlfArrayPrin,ctreateTlfArrayOpros}