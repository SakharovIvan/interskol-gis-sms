
import { ctreateTlfArray, ctreateTlfArrayOpros } from "../sms/cliTLF.js";

import log from "simple-node-logger";
import { emailConfig } from "../config.js";
import sentmail from "../email/sentfile.js";

const logger = log.createSimpleLogger({
  logFilePath: "logger.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
logger.setLevel(emailConfig.logs.level || "debug");

const sentMasSMS = async () => {

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
          logger.info(`tlfArrayPrin ${tlfArrayPrin}`);
          logger.info(`tlfArrayVipoln ${tlfArrayVipoln}`);
          logger.info(`tlfArrayOpros ${tlfArrayOpros}`);
          const tlfArrayPrinMail = tlfArrayPrin.filter((item, index) => {
            return tlfArrayPrin.indexOf(item) === index;
          });
          const tlfArrayVipolnMail = tlfArrayVipoln.filter((item, index) => {
            return tlfArrayVipoln.indexOf(item) === index;
          });
          const tlfArrayOprosMail = tlfArrayOpros.filter((item, index) => {
            return tlfArrayOpros.indexOf(item) === index;
          });
          if (tlfArrayPrinMail.length > 1) {
            await sentmail(
              emailConfig.SMTPSentcliSMS.emailto,
              normalizeTlf(tlfArrayPrinMail),
              emailConfig.SMTPSentcliSMS.textprin
            );
          }
          if (tlfArrayVipolnMail.length > 1) {
            await sentmail(
              emailConfig.SMTPSentcliSMS.emailto,
              normalizeTlf(tlfArrayVipolnMail),
              emailConfig.SMTPSentcliSMS.textvipoln
            );
          }
          //console.log(tlfArrayOprosMail);
          if (tlfArrayOprosMail.length > 1) {
            await sentmail(
              emailConfig.SMTPSentcliSMS.emailto,
              normalizeTlf(tlfArrayOprosMail),
              emailConfig.SMTPSentcliSMS.textopros
            );
          }
        }
      );
    ;
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
