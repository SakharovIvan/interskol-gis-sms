
import { ctreateTlfArray, ctreateTlfArrayOpros } from "../sms/cliTLF.js";

import log from "simple-node-logger";
import { emailConfig } from "../config.js";

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

const createMasSMS = async () => {
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
        ([tlfArrayPrin, tlfArrayVipoln, tlfArrayOpros]) => {
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
          const result =[]
        //  if (tlfArrayPrinMail.length > 1) {
           // const normPrinTlf=normalizeTlf(tlfArrayPrinMail)
            result.push(tlfArrayPrinMail)
         // }
         // if (tlfArrayVipolnMail.length > 1) {
            //const normVipolnTlf=normalizeTlf(tlfArrayVipolnMail)
            result.push(tlfArrayVipolnMail)
         // }
         // if (tlfArrayOprosMail.length > 1) {
            result.push(tlfArrayOprosMail)
         // }
          return result
        }
      );
    ;
};



export {createMasSMS,normalizeTlf};
