import sentmail from "../email/sentfile.js";
import { emailConfig } from "../config.js";
import {createMasSMS,normalizeTlf} from "../src/sentSMS.js";
import updateGISbd from "../src/JSONtoSQLbd.js";
import createJSONfromXLSX from "../src/emailDataToJSON.js";
import createGISreport from "../src/GISbdtoXLSX.js";
import getPost from "../email/imap_readfile.js";

const mcday = 86400000;
const mchour = 3600000/6;
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
      .then(() => {
        sentmail(
          emailConfig.SMTPSentreport.emailto,
          emailConfig.SMTPSentreport.subject,
          "SomeText",
          "GISdata.xlsx"
        );
      })
      .then(() => {
        logger.info(
          `GIS report sent ${
            (emailConfig.SMTPSentreport.emailto,
            emailConfig.SMTPSentreport.subject)
          }`
        );
      });
    logger.info(`GIS report sent`);
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour);

setInterval(async () => {
  try {
    getPost();
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour / 3);

setInterval(async () => {
  try {
    const json = createJSONfromXLSX("i.sakharov_LLWarranty17062024");
    await updateGISbd(json);
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour / 3);

setInterval(async () => {
  try {
    const massms = await createMasSMS();
    try{
    if (massms[0].length() > 0) {
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        normalizeTlf(massms[0]),
        emailConfig.SMTPSentcliSMS.textprin
      );
    }
  }catch(err){
    logger.info('tlfArrayPrinMail',err);
  }
try{
    if (massms[1].length() > 0) {
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        normalizeTlf(massms[1]),
        emailConfig.SMTPSentcliSMS.textvipoln
      );
    }
  }catch{
    logger.info('tlfArrayVipolnMail',err);
  }
  try{
    if (massms[2].length() > 0) {
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        normalizeTlf(massms[2]),
        emailConfig.SMTPSentcliSMS.textopros
      );
    }
  }catch{
    logger.info('tlfArrayOprosMail',err);
  }

  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour);
