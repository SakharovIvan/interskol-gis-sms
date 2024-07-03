import updateGISbd from "../src/JSONtoSQLbd.js";
import createJSONfromXLSX from "../src/emailDataToJSON.js";
import getPost from "../email/imap_readfile.js";
import { ctreateTlfArray, ctreateTlfArrayOpros } from "../sms/cliTLF.js";
import createGISreport from "../src/GISbdtoXLSX.js";
import log from "simple-node-logger";
import { emailConfig } from "../config.js";
import sentmail from "../email/sentfile.js";

const logger = log.createSimpleLogger({
    logFilePath: "logger.log",
    timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
  });
  logger.setLevel(emailConfig.logs.level || "debug");

  
const sentMasSMS =async()=>{

    const promise1 = getPost();
    const promise2 = updateGISbd(
      createJSONfromXLSX("i.sakharov_LLWarranty17062024")
    );
    createGISreport()

    const promises = Promise.all([promise1, promise2]);
    return promises.then(() => {
      //createGISreport();
      
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
        return;
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
        return;
      });

      ctreateTlfArrayOpros("SMS_status_opros").then((tlfArray) => {
        console.log(tlfArray);
        if (tlfArray.length > 1) {
          logger.info(`Text opros sent for ${tlfArray}`);
          return sentmail(
            emailConfig.SMTPSentcliSMS.emailto,
            normalizeTlf(tlfArray),
            emailConfig.SMTPSentcliSMS.textopros
          );
        }
        return;
      });
    }
)
}


const normalizeTlf = (array) => {
    return array
      .join()
      .replaceAll(")", "")
      .replaceAll("(", "")
      .replaceAll(" ", "")
      .replaceAll("+", "");
  };

export default sentMasSMS