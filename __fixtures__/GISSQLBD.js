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
      rem_work TEXT,
      last_update_date TEXT,
      term_rep_all INTEGER,
      term_rep_wosogl INTEGER
      );`;

const smsStatus = `
CREATE TABLE SMSstatus (
id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
asc_ndk INTEGER,
asc_kod INTEGER,
cli_telephone TEXT,
SMS_status_prin BOOLEAN DEFAULT FALSE,
SMS_statusdia BOOLEAN DEFAULT FALSE,
SMS_status_sogl1 BOOLEAN DEFAULT FALSE,
SMS_status_sogl2 BOOLEAN DEFAULT FALSE,
SMS_status_ojod1 BOOLEAN DEFAULT FALSE,
SMS_status_ojod2 BOOLEAN DEFAULT FALSE,
SMS_status_vipoln BOOLEAN DEFAULT FALSE,
SMS_status_vidach BOOLEAN DEFAULT FALSE,
SMS_status_opros BOOLEAN DEFAULT FALSE
);
`;

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
  return `INSERT INTO GIS (asc_name, asc_gor, asc_adr, asc_ndk, asc_kod, asc_telephone, asc_email, cli_name, cli_telephone, vr, snNo_tool, matNo_tool, dateofpurch_tool, torgorg_tool, date_prin, date_dia, date_sogl1, date_sogl2, date_ojod1, date_ojod2, date_vipoln, date_vidach, rem_work) 
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

const addsqlsmsStatusData = (asc_ndk, asc_kod, cli_telephone) => {
  return `INSERT INTO SMSstatus (asc_ndk,
  asc_kod,
  cli_telephone) 
VALUES ( ${asc_ndk},
  ${asc_kod},
  '${cli_telephone}');`;
};

const updatesqlsmsStatusData = (
  asc_ndk,
  asc_kod,
  cli_telephone,
  status = ""
) => {
  if (status !== "") {
    //console.log(asc_ndk,
    //  asc_kod,status)
    return `UPDATE SMSstatus SET 
  cli_telephone = '${cli_telephone}', ${status}=TRUE WHERE asc_ndk = ${asc_ndk} and asc_kod=${asc_kod};`;
  }
  return `UPDATE SMSstatus SET 
  cli_telephone = '${cli_telephone}' WHERE asc_ndk = ${asc_ndk} and asc_kod=${asc_kod};`;
};

const calculatedata = (
  asc_ndk,
  asc_kod,
  last_update_date,
  norm_cli_telephone,
  term_rep_all = null,
  term_rep_wosogl = null
) => {
  return `UPDATE GIS SET last_update_date = '${last_update_date}', term_rep_all = ${term_rep_all}, term_rep_wosogl=${term_rep_wosogl}, norm_cli_telephone = '${norm_cli_telephone}'
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

const getGISdatabyData = () => {
  return `SELECT snNo_tool, date_prin, date_vidach,date_vipoln, cli_telephone, date_sogl1, date_sogl2, term_rep_wosogl, cli_name, asc_gor, matNo_tool 
  FROM gis WHERE term_rep_wosogl <=3 OR term_rep_all <=3;`;
};

const getTelephonestoSent = (date1, date2, status, date_type) => {
  return `SELECT gis.cli_telephone, gis.asc_ndk, gis.asc_kod FROM GIS INNER JOIN SMSstatus ON 
gis.asc_ndk=SMSstatus.asc_ndk and gis.asc_kod=SMSstatus.asc_kod 
WHERE (gis.${date_type}='${date1}' OR gis.${date_type}='${date2}') AND SMSstatus.${status} = 'f' LIMIT 19;`;
};

export {
  createsqlgis,
  addsqlgisData,
  updatesqlgisData,
  calculatedata,
  getGISdata,
  getGISdatabyFilter,
  getGISdatabyData,
  getTelephonestoSent,
  addsqlsmsStatusData,
  updatesqlsmsStatusData,
};
