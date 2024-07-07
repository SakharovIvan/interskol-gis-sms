import { pool } from "../config.js";
import {calculatedata, getGISdatabyFilter} from '../__fixtures__/GISSQLBD.js'
const milSecinDay = 86400000

const normalizeTlf = (tlf) => {
    return tlf.replaceAll(")", "")
    .replaceAll("(", "")
    .replaceAll(" ", "")
    .replaceAll("+", "")
  };

const updatecalculationdata = async (asc_ndk, asc_kod)=>{
    try{
      const gisbd = await getGISdatabyFilter(asc_ndk, asc_kod)
      const date = new Date()
      const last_update_date = date.toLocaleDateString()
      let term_rep_all = null
      let term_rep_wosogl = null
      let norm_cli_telephone= normalizeTlf(gisbd.cli_telephone)
        if (gisbd.date_vipoln!==''){
             term_rep_all= Math.round((parseDate(gisbd.date_vipoln)-parseDate(gisbd.date_prin))/milSecinDay)
            if(gisbd.date_sogl2!==''){
                term_rep_wosogl= term_rep_all - Math.round((parseDate(gisbd.date_sogl2)-parseDate(gisbd.date_sogl1))/milSecinDay)

            }
        }
       await pool.query(calculatedata(asc_ndk, asc_kod, last_update_date,norm_cli_telephone, term_rep_all,term_rep_wosogl))
    }catch(err){
        console.log(err)
    }
}

const parseDate = (str)=>{
    const masDate = str.split('-')
    return new Date (masDate[2],masDate[1]-1,masDate[0])
} 

export default updatecalculationdata
