import { ctreateTlfArray, ctreateTlfArrayOpros } from "../sms/cliTLF.js";

import log from "simple-node-logger";
import { emailConfig } from "../config.js";

//const logger = log.createSimpleLogger({
//  logFilePath: "logger.log",
//  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
//});
//logger.setLevel(emailConfig.logs.level || "debug");

const normalizeTlf = (tlf) => {
  return `${tlf}`.replace(/\)/g, "")
  .replace(/\(/g, "")
  .replace(/ /g, "")
  .replace(/\+/g, "")
};

const createMasSMS = async () => {
  //createGISreport();
  const promTlfArrayPrin = ctreateTlfArray("SMS_status_prin","date_prin");
  const promTlfArrayVipoln = ctreateTlfArray("SMS_status_vipoln","date_vipoln");
  const promTlfArrayOpros = ctreateTlfArrayOpros();

  const promisesTlf = Promise.all([
    promTlfArrayPrin,
    promTlfArrayVipoln,
    promTlfArrayOpros,
  ]);
  return promisesTlf.then(([tlfArrayPrin, tlfArrayVipoln, tlfArrayOpros]) => {

    const tlfArrayPrinMail = tlfArrayPrin
      .filter((item, index) => {
        return tlfArrayPrin.indexOf(item) === index;
      })
    const tlfArrayVipolnMail = tlfArrayVipoln
      .filter((item, index) => {
        return tlfArrayVipoln.indexOf(item) === index;
      })
    const tlfArrayOprosMail = tlfArrayOpros
      .filter((item, index) => {
        return tlfArrayOpros.indexOf(item) === index;
      })
    return [tlfArrayPrinMail, tlfArrayVipolnMail, tlfArrayOprosMail];
  });
};

export { createMasSMS, normalizeTlf };
