import { ctreateTlfArray, ctreateTlfArrayOpros } from "../sms/cliTLF.js";

import log from "simple-node-logger";
import { emailConfig } from "../config.js";

const logger = log.createSimpleLogger({
  logFilePath: "logger.log",
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
logger.setLevel(emailConfig.logs.level || "debug");

const normalizeTlf = (tlf) => {
  return `${tlf}`.replace(/\)/g, "")
  .replace(/\(/g, "")
  .replace(/ /g, "")
  .replace(/\+/g, "")
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
  return promisesTlf.then(([tlfArrayPrin, tlfArrayVipoln, tlfArrayOpros]) => {
    console.log(tlfArrayPrin, tlfArrayVipoln, tlfArrayOpros);
    logger.info(`tlfArrayPrin ${tlfArrayPrin}`);
    logger.info(`tlfArrayVipoln ${tlfArrayVipoln}`);
    logger.info(`tlfArrayOpros ${tlfArrayOpros}`);
    const tlfArrayPrinMail = tlfArrayPrin
      .filter((item, index) => {
        return tlfArrayPrin.indexOf(item) === index;
      })
      logger.info(typeof tlfArrayPrinMail)
    const tlfArrayVipolnMail = tlfArrayVipoln
      .filter((item, index) => {
        return tlfArrayVipoln.indexOf(item) === index;
      })
      logger.info(typeof tlfArrayVipolnMail)
    const tlfArrayOprosMail = tlfArrayOpros
      .filter((item, index) => {
        return tlfArrayOpros.indexOf(item) === index;
      })
      logger.info(typeof tlfArrayOprosMail)
      logger.info([tlfArrayPrinMail, tlfArrayVipolnMail, tlfArrayOprosMail]);
    return [tlfArrayPrinMail, tlfArrayVipolnMail, tlfArrayOprosMail];
  });
};

export { createMasSMS, normalizeTlf };
