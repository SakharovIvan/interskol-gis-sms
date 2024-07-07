import sentmail from "../email/sentfile.js";
import { emailConfig } from "../config.js";
import sentSMS from "./sntSMS.js";
import updateGISbd from "../src/JSONtoSQLbd.js";
import createJSONfromXLSX from "../src/emailDataToJSON.js";
import createGISreport from "../src/GISbdtoXLSX.js";
import getPost from "../email/imap_readfile.js";

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

setInterval(async () => {
  try {
    getPost();
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour / 3);

setInterval(async () => {
  try {
    const json = createJSONfromXLSX("i.sakharov_LLWarranty17062024");
    await updateGISbd(json);
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour / 3);

setInterval(async () => {
  try {
    await createGISreport();
    await sentmail(
      emailConfig.SMTPSentreport.emailto,
      emailConfig.SMTPSentreport.subject,
      "SomeText",
      "GISdata.xlsx"
    );

    await logger.info(
      `GIS report sent ${
        (emailConfig.SMTPSentreport.emailto, emailConfig.SMTPSentreport.subject)
      }`
    );
  } catch (err) {
    console.log(err);
    logger.info(err);
  }
}, mchour + mchour / 60);

try {
  await sentSMS();
} catch (err) {
  console.log(err);
  logger.info(err);
}
