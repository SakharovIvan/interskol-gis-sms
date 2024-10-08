import sentmail from "../email/sentfile.js";
import { emailConfig } from "../config.js";
import { createMasSMS, normalizeTlf } from "../src/sentSMS.js";
import updateGISbd from "../src/JSONtoSQLbd.js";
import createJSONfromXLSX from "../src/emailDataToJSON.js";
import createGISreport from "../src/GISbdtoXLSX.js";
import getPost from "../email/imap_readfile.js";
import { RecurrenceRule, scheduleJob, Range } from "node-schedule";

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
logger.info("Process");

const smsrule = "*/5 14 * * 1-5";

const reportrule = "0 15 * * 1-5";

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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
  }
};

scheduleJob(smsrule, function () {
  createMasSMS().then((massms) => {
    sentsmsmas(massms);
  });
});

//scheduleJob(reportrule, function () {
//  try {
//    sentmail(
//      emailConfig.SMTPSentreport.emailto,
//      emailConfig.SMTPSentreport.subject,
//      "SomeText",
//      "GISdata.xlsx"
//    ).then(() => {
//      console.log("Report sent");
//    });
//  } catch (err) {
//    console.log(err);
//    //    logger.info(err);
//  }
//});

setInterval(async () => {
  try {
    getPost();
  } catch (err) {
    console.log(err);
  }
}, mchour / 6);

setInterval(async () => {
  try {
    const json = createJSONfromXLSX("i.sakharov_LLWarranty17062024");
    await updateGISbd(json);
    await createGISreport();
  } catch (err) {
    console.log(err);
  }
}, mchour);
