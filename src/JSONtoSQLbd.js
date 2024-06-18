import { pool } from "../config.js";
import {
  createsqlgis,
  addsqlgisData,
  updatesqlgisData,
} from "../__fixtures__/GISSQLBD.js";
import log from 'simple-node-logger'

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

const getGISdata = async () => {
  try {
    //await pool.connect();
    let GISbd = await pool.query(`SELECT asc_kod, asc_ndk FROM GIS;`);
    //await pool.end();
    console.log('GIS Table Data get')
    //console.log(GISbd.fields)
    return GISbd.rows;
  } catch (err) {
    console.log(err);
  }
};

const containGISdata = (GISbd, kod, ndk) => {
  //console.log(kod, ndk)
  for (let kodndk of GISbd) {
    if (kodndk.asc_kod === kod && kodndk.asc_ndk === ndk) {
      return true;
    }
  }
  return false;
};

const updateGISbd = async (jsonfile) => {
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
    } of jsonfile)
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
        logger.info(`data update: ${
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
          rem_work}`)
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
        logger.info(`data add: ${
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
          rem_work}`)
      }
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
    
  }
};

export default updateGISbd