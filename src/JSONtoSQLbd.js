import { pool } from "../config.js";
import {
  createsqlgis,
  addsqlgisData,
  updatesqlgisData,
  getGISdata,
  addsqlsmsStatusData,
  updatesqlsmsStatusData
} from "../__fixtures__/GISSQLBD.js";
import log from 'simple-node-logger'
import updatecalculationdata from './datacalculation.js'

const logger = log.createSimpleLogger( { logFilePath:'sqlupdate.log', timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS' } );



const createGISbd = async () => {
  try {
    await pool.connect();
    await pool.query(createsqlgis);
  } catch (err) {
    console.log(err);
  } finally {
    await pool.end();
    console.log("GIS bd created");
  }
};



const containGISdata = (GISbd, kod, ndk) => {
  for (let kodndk of GISbd) {
    if (kodndk.asc_kod === kod && kodndk.asc_ndk === ndk) {
      return true;
    }
  }
  return false;
};

const updateGISbd = async (jsonfile) => {
  //console.log(jsonfile)
  try {
    //console.log(jsonfile)
    const gisBD = await getGISdata();
    for (let {
      asc_name,
      asc_gor,
      asc_adr,
      asc_ndk,
      asc_kod,
      asc_telephone,
      asc_email,
      cli_name,
      cli_telephone,
      vr,
      snNo_tool,
      matNo_tool,
      dateofpurch_tool,
      torgorg_tool,
      date_prin,
      date_dia,
      date_sogl1,
      date_sogl2,
      date_ojod1,
      date_ojod2,
      date_vipoln,
      date_vidach,
      rem_work,
    } of jsonfile){
     
      if (containGISdata(gisBD, asc_kod, asc_ndk)) {
       await pool.query (updatesqlgisData(
          asc_name,
          asc_gor,
          asc_adr,
          asc_ndk,
          asc_kod,
          asc_telephone,
          asc_email,
          cli_name,
          cli_telephone,
          vr,
          snNo_tool,
          matNo_tool,
          dateofpurch_tool,
          torgorg_tool,
          date_prin,
          date_dia,
          date_sogl1,
          date_sogl2,
          date_ojod1,
          date_ojod2,
          date_vipoln,
          date_vidach,
          rem_work)
        );
        await pool.query(updatesqlsmsStatusData(asc_ndk,asc_kod,cli_telephone))

          
      } else {
        await pool.query(
        addsqlgisData(
          asc_name,
          asc_gor,
          asc_adr,
          asc_ndk,
          asc_kod,
          asc_telephone,
          asc_email,
          cli_name,
          cli_telephone,
          vr,
          snNo_tool,
          matNo_tool,
          dateofpurch_tool,
          torgorg_tool,
          date_prin,
          date_dia,
          date_sogl1,
          date_sogl2,
          date_ojod1,
          date_ojod2,
          date_vipoln,
          date_vidach,
          rem_work
        ))
        await pool.query(addsqlsmsStatusData(asc_ndk,asc_kod,cli_telephone))

      }
      await updatecalculationdata(asc_ndk,asc_kod)
    }
  } catch (err) {
    console.log(err);
  }finally{
    console.log('sql updated')
  }
};

export default updateGISbd