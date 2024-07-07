import sentmail from "../email/sentfile.js";
import { emailConfig } from "../config.js";
import { createMasSMS, normalizeTlf } from "../src/sentSMS.js";

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

const sentsmsmas = async (massms) => {
  try {
    if ((await massms[0].length) > 0) {
      logger.info(normalizeTlf(massms[0]));
      const massms0 = normalizeTlf(massms[0]);
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        `${massms0}`,
        emailConfig.SMTPSentcliSMS.textprin
      );
    }
  } catch (err) {
    logger.info("tlfArrayPrinMail ", err);
  }

  try {
    if ((await massms[1].length) > 0) {
      logger.info(normalizeTlf(massms[1]));
      const massms1 = normalizeTlf(massms[1]);
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        `${massms1}`,
        emailConfig.SMTPSentcliSMS.textvipoln
      );
    }
  } catch (err) {
    logger.info("tlfArrayVipolnMail ", err);
  }

  try {
    if ((await massms[2].length) > 0) {
      logger.info(normalizeTlf(massms[2]));
      const massms2 = normalizeTlf(massms[2]);
      await sentmail(
        emailConfig.SMTPSentcliSMS.emailto,
        `${massms2}`,
        emailConfig.SMTPSentcliSMS.textopros
      );
    }
  } catch (err) {
    logger.info("tlfArrayVipolnMail ", err);
  }
};

export default () => {
  setInterval(async () => {
    try {
      const massms = await createMasSMS();
      await sentsmsmas(massms);
    } catch (err) {
      console.log(err);
      logger.info(err);
    }
  }, mchour + mchour / 60);
};