import updateGISbd from "../src/JSONtoSQLbd.js";
import createJSONfromXLSX from "../src/emailDataToJSON.js";
import getPost from "../email/imap_readfile.js";
import sentmail from "../email/sentfile.js";
import { emailConfig } from "../config.js";
import { ctreateTlfArray, ctreateTlfArrayOpros } from "../sms/cliTLF.js";
import createGISreport from "../src/GISbdtoXLSX.js";
const mcday = 86400000;
const mchour = 3600000;
const week = mcday * 7;
const emailReport = "a.rogov@kls-gr.ru; i.sakharov@kls-gr.ru";
import log from "simple-node-logger";

const normalizeTlf = (array) => {
  return array
    .join()
    .replaceAll(")", "")
    .replaceAll("(", "")
    .replaceAll(" ", "")
    .replaceAll("+", "");
};

const logger = log.createSimpleLogger({
  logFilePath: "logger.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
logger.setLevel(emailConfig.logs.level || "debug");

try {
  //let timer = setInterval(getPost,10000)
  //setTimeout(()=>{clearInterval(timer);console.log('stop')},60000)
  setInterval(() => {
    createGISreport().then(
      sentmail(
        emailConfig.SMTPSentreport.emailto,
        emailConfig.SMTPSentreport.subject,
        "SomeText",
        "GISdata.xlsx"
      )
    );
    logger.info(`GIS report sent`);
  }, mchour / 6);

  setInterval(async () => {
    getPost();
    updateGISbd(createJSONfromXLSX("i.sakharov_LLWarranty17062024"));

    ctreateTlfArray("SMS_status_prin").then((tlfArray) => {
      console.log(tlfArray);
      if (tlfArray.length > 1) {
        logger.info(`Text prin sent for ${tlfArray}`);
        return sentmail(
          emailConfig.SMTPSentcliSMS.emailto,
          normalizeTlf(tlfArray),
          emailConfig.SMTPSentcliSMS.textprin
        );
      }
    });

    ctreateTlfArray("SMS_status_vipoln").then((tlfArray) => {
      console.log(tlfArray);
      if (tlfArray.length > 1) {
        logger.info(`Text vipoln sent for ${tlfArray}`);
        return sentmail(
          emailConfig.SMTPSentcliSMS.emailto,
          normalizeTlf(tlfArray),
          emailConfig.SMTPSentcliSMS.textvipoln
        );
      }
    });

    ctreateTlfArrayOpros().then((tlfArray) => {
      console.log(tlfArray);
      if (tlfArray.length > 1) {
        logger.info(`Text opros sent for ${tlfArray}`);
        return sentmail(
          emailConfig.SMTPSentcliSMS.emailto,
          normalizeTlf(tlfArray),
          emailConfig.SMTPSentcliSMS.textopros
        );
      }
    });
  }, mchour / 6);
} catch (err) {
  console.log(err);
}
