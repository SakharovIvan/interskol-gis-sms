import sentmail from "../email/sentfile.js";
import { emailConfig } from "../config.js";
import { createMasSMS, normalizeTlf } from "../src/sentSMS.js";
import updateGISbd from "../src/JSONtoSQLbd.js";
import createJSONfromXLSX from "../src/emailDataToJSON.js";
import createGISreport from "../src/GISbdtoXLSX.js";
import getPost from "../email/imap_readfile.js";
import { RecurrenceRule, scheduleJob } from "node-schedule";

const mcday = 86400000;
const mchour = 3600000;
const week = mcday * 7;
const emailReport = "a.rogov@kls-gr.ru; i.sakharov@kls-gr.ru";
//import log from "simple-node-logger";
//
//const logger = log.createSimpleLogger({
//  logFilePath: "logger.log",
//  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
//});
//logger.setLevel(emailConfig.logs.level || "debug");

const smsrule = new RecurrenceRule();
smsrule.dayOfWeek = [0, new schedule.Range(1,5)];
//smsrule.hour = 13
smsrule.minute = 1;

const reportrule = new RecurrenceRule();
reportrule.dayOfWeek = [0, new schedule.Range(1,5)];
reportrule.hour = 15;
reportrule.minute = 17;

const sentsmsmas = async (massms) => {
  try {
    if ((await massms[0].length) > 0) {
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        normalizeTlf(massms[0]),
        emailConfig.SMTPSentcliSMS.textprin
      );
    }
  } catch (err) {
    //  logger.info("tlfArrayPrinMail ", err);
  }
  try {
    if ((await massms[1].length) > 0) {
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        normalizeTlf(massms[1]),
        emailConfig.SMTPSentcliSMS.textvipoln
      );
    }
  } catch (err) {
    //   logger.info("tlfArrayVipolnMail ", err);
  }
  try {
    if ((await massms[2].length) > 0) {
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        normalizeTlf(massms[2]),
        emailConfig.SMTPSentcliSMS.textopros
      );
    }
  } catch (err) {
    //    logger.info("tlfArrayOprosMail ", err);
  }
};

scheduleJob(smsrule, async function () {
  const massms = await createMasSMS();
  await sentsmsmas(massms);
});

scheduleJob(reportrule, function () {
  try {
    sentmail(
      emailConfig.SMTPSentreport.emailto,
      emailConfig.SMTPSentreport.subject,
      "SomeText",
      "GISdata.xlsx"
    ).then(() => {
      logger.info(
        `GIS report sent ${
          (emailConfig.SMTPSentreport.emailto,
          emailConfig.SMTPSentreport.subject)
        }`
      );
    });
  } catch (err) {
    console.log(err);
    //    logger.info(err);
  }
});

setInterval(async () => {
  try {
    getPost();
  } catch (err) {
    console.log(err);
    //    logger.info(err);
  }
}, mchour / 20);

setInterval(async () => {
  try {
    const json = createJSONfromXLSX("i.sakharov_LLWarranty17062024");
    await updateGISbd(json);
    await createGISreport();
  } catch (err) {
    console.log(err);
    //    logger.info(err);
  }
}, mchour);
