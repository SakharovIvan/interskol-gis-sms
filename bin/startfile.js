import sentmail from "../email/sentfile.js";
import { emailConfig } from "../config.js";
import sentMasSMS from "../src/sentSMS.js";

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
    await sentmail(
      emailConfig.SMTPSentreport.emailto,
      emailConfig.SMTPSentreport.subject,
      "SomeText",
      "GISdata.xlsx"
    );
    logger.info(`GIS report sent`);
  } catch (err) {
    console.log(err);
  }
}, mchour * 4);

setInterval(async () => {
  sentMasSMS();
}, mchour * 4);
