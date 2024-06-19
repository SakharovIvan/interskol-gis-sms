import { pool } from "../config.js";

const createsqlgis = `CREATE TABLE GIS ( 
      id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      asc_name TEXT,
      asc_gor TEXT,
      asc_adr TEXT,
      asc_ndk INTEGER,
      asc_kod INTEGER,
      asc_telephone TEXT,
      asc_email TEXT,
      cli_name TEXT,
      cli_telephone TEXT,
      vr TEXT,
      snNo_tool TEXT,
      matNo_tool TEXT,
      dateofpurch_tool VARCHAR(10),
      torgorg_tool TEXT,
      date_prin VARCHAR(10),
      date_dia VARCHAR(10),
      date_sogl1 VARCHAR(10),
      date_sogl2 VARCHAR(10),
      date_ojod1 VARCHAR(10),
      date_ojod2 VARCHAR(10),
      date_vipoln VARCHAR(10),
      date_vidach VARCHAR(10),
      rem_work TEXT
      );`;

const addsqlgisData = (
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
) => {
  return `INSERT INTO GIS (asc_name, asc_gor, asc_adr, asc_ndk, asc_kod, asc_telephone, asc_email, cli_name, cli_telephone, vr, snNo_tool, matNo_tool, dateofpurch_tool, torgorg_tool, date_prin, date_dia, date_sogl1, date_sogl2, date_ojod1, date_ojod2, date_vipoln, date_vidach, rem_work ) 
VALUES ( '${asc_name}', '${asc_gor}', '${asc_adr}', ${asc_ndk}, ${asc_kod}, '${asc_telephone}', '${asc_email}', '${cli_name}', '${cli_telephone}', '${vr}', '${snNo_tool}', '${matNo_tool}', '${dateofpurch_tool}', '${torgorg_tool}', '${date_prin}', '${date_dia}', '${date_sogl1}', '${date_sogl2}', '${date_ojod1}', '${date_ojod2}', '${date_vipoln}', '${date_vidach}', '${rem_work}' );`;
};

const updatesqlgisData = (
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
) => {
  return `UPDATE GIS SET asc_name='${asc_name}', asc_gor='${asc_gor}', asc_adr='${asc_adr}', asc_telephone='${asc_telephone}', asc_email='${asc_email}', cli_name='${cli_name}', cli_telephone='${cli_telephone}', vr='${vr}', snNo_tool='${snNo_tool}', matNo_tool='${matNo_tool}', dateofpurch_tool='${dateofpurch_tool}', torgorg_tool='${torgorg_tool}', date_prin='${date_prin}', date_dia='${date_dia}', date_sogl1='${date_sogl1}', date_sogl2='${date_sogl2}', date_ojod1='${date_ojod1}', date_ojod2='${date_ojod2}', date_vipoln='${date_vipoln}', date_vidach='${date_vidach}', rem_work='${rem_work}' 
WHERE asc_ndk = ${asc_ndk} and asc_kod=${asc_kod};`;
};

const calculatedata = (
  asc_ndk,
  asc_kod,
  last_update_date,
  term_rep_all = null,
  term_rep_wosogl = null
) => {
  return `UPDATE GIS SET last_update_date = '${last_update_date}', term_rep_all = ${term_rep_all}, term_rep_wosogl=${term_rep_wosogl}
WHERE asc_ndk = ${asc_ndk} and asc_kod=${asc_kod};`;
};

const getGISdata = async () => {
  try {
    let GISbd = await pool.query(`SELECT asc_kod, asc_ndk FROM GIS;`);
    //console.log('GIS Table Data get')
    return GISbd.rows;
  } catch (err) {
    console.log(err);
  }
};

const getGISdatabyFilter = async (asc_ndk, asc_kod) => {
  try {
    let GISbd = await pool.query(
      `SELECT * FROM GIS WHERE asc_ndk = ${asc_ndk} AND asc_kod=${asc_kod};`
    );
    return GISbd.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const getGISdatabyData = ()=>{
  return `SELECT snNo_tool, date_prin, date_vidach,date_vipoln, cli_telephone, date_sogl1, date_sogl2, term_rep_wosogl, cli_name, asc_gor, matNo_tool 
  FROM gis WHERE term_rep_wosogl <=3 ;`
}

const getTelephonestoSent = (filter ='')=>{
    return `SELECT cli_telephone FROM gis ${filter} ;`
}

export {
  createsqlgis,
  addsqlgisData,
  updatesqlgisData,
  calculatedata,
  getGISdata,
  getGISdatabyFilter,
  getGISdatabyData,
  getTelephonestoSent
};
