import XLSX from 'xlsx'
import { pool } from "../config.js";
import {getGISdatabyData} from '../__fixtures__/GISSQLBD.js'

const createXLSXfromJSON = (jsa)=>{
    const worksheet = XLSX.utils.json_to_sheet(jsa);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "List 1");
    XLSX.writeFile(workbook,'GISdata.xlsx')
    return
}

const createJSONfromGISBD = async()=>{
try{
   const result = await pool.query(getGISdatabyData())
   console.log(result.rows)
    return result.rows
}catch(err){
    console.log(err)
}
} 


createJSONfromGISBD()
.then((res)=> createXLSXfromJSON(res))
.then(console.log('exceledoc created'))
