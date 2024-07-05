
import { ctreateTlfArray, ctreateTlfArrayOpros } from "../sms/cliTLF.js";

import log from "simple-node-logger";
import { emailConfig } from "../config.js";
import sentmail from "../email/sentfile.js";

const logger = log.createSimpleLogger({
  logFilePath: "logger.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
logger.setLevel(emailConfig.logs.level || "debug");


const normalizeTlf = (array) => {
  return array
    .toString()
    .replaceAll(")", "")
    .replaceAll("(", "")
    .replaceAll(" ", "")
    .replaceAll("+", "");
};

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
          console.log(tlfArrayPrin, tlfArrayVipoln, tlfArrayOpros)
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
            const normPrinTlf=normalizeTlf(tlfArrayPrinMail)
            sentmail(
              emailConfig.SMTPSentcliSMS.emailto,
              normPrinTlf,
              emailConfig.SMTPSentcliSMS.textprin
            )
            .then(()=>{
              logger.info(emailConfig.SMTPSentcliSMS.emailto,
                normPrinTlf,
                emailConfig.SMTPSentcliSMS.textprin)
            })

          }
          if (tlfArrayVipolnMail.length > 1) {
            const normVipolnTlf=normalizeTlf(tlfArrayVipolnMail)
            sentmail(
              emailConfig.SMTPSentcliSMS.emailto,
              normVipolnTlf,
              emailConfig.SMTPSentcliSMS.textvipoln
            )
            .then(()=>{
              logger.info(emailConfig.SMTPSentcliSMS.emailto,
                normVipolnTlf,
                emailConfig.SMTPSentcliSMS.textvipoln)
            })

          }
          if (tlfArrayOprosMail.length > 1) {
            const normOprosTlf=normalizeTlf(tlfArrayOprosMail)
            sentmail(
              emailConfig.SMTPSentcliSMS.emailto,
              normOprosTlf,
              emailConfig.SMTPSentcliSMS.textopros
            )
            .then(()=>{
              logger.info(emailConfig.SMTPSentcliSMS.emailto,
                normOprosTlf,
                emailConfig.SMTPSentcliSMS.textopros);
            })

          }
        }
      );
    ;
};



export default sentMasSMS;
