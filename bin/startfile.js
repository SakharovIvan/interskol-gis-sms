import sentmail from "../email/sentfile.js";
import { emailConfig } from "../config.js";
import { createMasSMS, normalizeTlf } from "../src/sentSMS.js";
import updateGISbd from "../src/JSONtoSQLbd.js";
import createJSONfromXLSX from "../src/emailDataToJSON.js";
import createGISreport from "../src/GISbdtoXLSX.js";
import getPost from "../email/imap_readfile.js";

const mcday = 86400000;
const mchour = 3600000;
const week = mcday * 7;
const emailReport = "a.rogov@kls-gr.ru; i.sakharov@kls-gr.ru";
import log from "simple-node-logger";

//const normalizeTlf = (tlf) => {
//  return `${tlf}`.replace(/\)/g, "")
//  .replace(/\(/g, "")
//  .replace(/ /g, "")
//  .replace(/\+/g, "")
//};

const logger = log.createSimpleLogger({
  logFilePath: "logger.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
logger.setLevel(emailConfig.logs.level || "debug");

setInterval(async () => {
  try {
    getPost();
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour / 10);

setInterval(async () => {
  try {
    const json = createJSONfromXLSX("i.sakharov_LLWarranty17062024");
    await updateGISbd(json);
    await createGISreport();
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour / 6);

setInterval(async () => {
  try {
    await sentmail(
      emailConfig.SMTPSentreport.emailto,
      emailConfig.SMTPSentreport.subject,
      "SomeText",
      "GISdata.xlsx"
    );

    logger.info(
      `GIS report sent ${
        (emailConfig.SMTPSentreport.emailto, emailConfig.SMTPSentreport.subject)
      }`
    );
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour + mchour / 60);

const sentsmsmas = async (massms) => {
  try {
    if ((await massms[0].length) > 0) {
     // logger.info(normalizeTlf(massms[0]));
     // const massms0 = normalizeTlf(massms[0]);
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        normalizeTlf(massms[0]),
        emailConfig.SMTPSentcliSMS.textprin
      );
    }
  } catch (err) {
    logger.info("tlfArrayPrinMail ", err);
  }

  try {
    if ((await massms[1].length) > 0) {
     // logger.info(normalizeTlf(massms[1]));
     // const massms1 = normalizeTlf(massms[1]);
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        normalizeTlf(massms[1]),
        emailConfig.SMTPSentcliSMS.textvipoln
      );
    }
  } catch (err) {
    logger.info("tlfArrayVipolnMail ", err);
  }

  try {
    if ((await massms[2].length) > 0) {
      //logger.info(normalizeTlf(massms[2]));
      //const massms2 = normalizeTlf(massms[2]);
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        normalizeTlf(massms[2]),
        emailConfig.SMTPSentcliSMS.textopros
      );
    }
  } catch (err) {
    logger.info("tlfArrayOprosMail ", err);
  }
};

setInterval(async () => {
  try {
    const massms = await createMasSMS();
    await sentsmsmas(massms);
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour/60);
