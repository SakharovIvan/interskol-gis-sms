import sentmail from "../email/sentfile.js";
import { emailConfig } from "../config.js";
import sentMasSMS from "../src/sentSMS.js";
import updateGISbd from "../src/JSONtoSQLbd.js";
import createJSONfromXLSX from "../src/emailDataToJSON.js";
import createGISreport from "../src/GISbdtoXLSX.js";
import getPost from "../email/imap_readfile.js";

const mcday = 86400000;
const mchour = 3600000;
const week = mcday * 7;
const emailReport = "a.rogov@kls-gr.ru; i.sakharov@kls-gr.ru";
import log from "simple-node-logger";

const logger = log.createSimpleLogger({
  logFilePath: "logger.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
logger.setLevel(emailConfig.logs.level || "debug");

setInterval(async () => {
  try {
    createGISreport()
    
       await sentmail(
        emailConfig.SMTPSentreport.emailto,
        emailConfig.SMTPSentreport.subject,
        "SomeText",
        "GISdata.xlsx"
      )
      logger.info(`GIS report sent`)
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour/6);

setInterval(async() => {
  try{
    getPost()
    updateGISbd(
      createJSONfromXLSX("i.sakharov_LLWarranty17062024")
    )
    .then(()=>{sentMasSMS()}) 
}catch(err){
  console.log(err)
  logger.info(err);
}
}, mchour/6);
