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

const sentMasSMS = async () => {
  const promise1 = getPost();
  //.then(()=>{console.log('Promise1 worked')})
  const promise2 = updateGISbd(
    createJSONfromXLSX("i.sakharov_LLWarranty17062024")
  );
  //.then(()=>{console.log('Promise2 worked')})
  const promise3 = createGISreport();
  //.then(()=>{console.log('Promise3 worked')})

  const promises = Promise.all([promise1, promise2, promise3]);
  return promises
    .then(() => {
      console.log("Promises worked");
    })
    .then(() => {
      //createGISreport();
      const promTlfArrayPrin = ctreateTlfArray("SMS_status_prin");
      const promTlfArrayVipoln = ctreateTlfArray("SMS_status_vipoln");
      const promTlfArrayOpros = ctreateTlfArrayOpros();

      const promisesTlf = Promise.all([
        promTlfArrayPrin,
        promTlfArrayVipoln,
        promTlfArrayOpros,
      ]);
      return promisesTlf.then(
        async ([tlfArrayPrin, tlfArrayVipoln, tlfArrayOpros]) => {
          const tlfArrayPrinMail = tlfArrayPrin.filter((item, index) => {
            return tlfArrayPrin.indexOf(item) === index;
          });
          const tlfArrayVipolnMail = tlfArrayVipoln.filter((item, index) => {
            return tlfArrayVipoln.indexOf(item) === index;
          });
          const tlfArrayOprosMail = tlfArrayOpros.filter((item, index) => {
            return tlfArrayOpros.indexOf(item) === index;
          });

          await sentmail(
            emailConfig.SMTPSentcliSMS.emailto,
            normalizeTlf(tlfArrayPrinMail),
            emailConfig.SMTPSentcliSMS.textprin
          );
          await sentmail(
            emailConfig.SMTPSentcliSMS.emailto,
            normalizeTlf(tlfArrayVipolnMail),
            emailConfig.SMTPSentcliSMS.textvipoln
          );
          console.log(tlfArrayOprosMail);
          await sentmail(
            emailConfig.SMTPSentcliSMS.emailto,
            normalizeTlf(tlfArrayOprosMail),
            emailConfig.SMTPSentcliSMS.textopros
          );
        }
      );
    });
};

const normalizeTlf = (array) => {
  return array
    .join()
    .replaceAll(")", "")
    .replaceAll("(", "")
    .replaceAll(" ", "")
    .replaceAll("+", "");
};

export default sentMasSMS;
