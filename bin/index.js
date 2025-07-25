import sentmail from "../email/sentfile.js";
import { emailConfig } from "../config.js";
import getPost from "../email/imap_readfile.js";
import { sms_job, gis_DB_job } from "../src/index.js";
import {  scheduleJob } from "node-schedule";
import reportService from "../src/services/report-service.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GisRoute } from "../routes/gis.route.js";
import bodyParser from "body-parser";

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
logger.info("Process");

const smsrule = "*/5 14 * * 1-5";

const reportrule = "0 15 * * 0-4";


scheduleJob(reportrule, function () {
  try {
    reportService
      .CreateReport()
      .then(() => {
        sentmail(
          emailConfig.SMTPSentreport.emailto,
          emailConfig.SMTPSentreport.subject,
          "Отчет ДСО",
          "GISdata.xlsx"
        );
      })
      .then(() => {
        console.log("Report sent");
      });
  } catch (err) {
    console.log(err);
  }
});

setInterval(() => {
  try {
    getPost();
    setTimeout(async () => {
      console.log("gis_DB_job started");
      await gis_DB_job();
    });
  } catch (err) {
    console.log(err);
  }
}, mchour / 20);

setInterval(async () => {
  try {
    console.log("sms_job started");
    await sms_job();
  } catch (err) {
    console.log(err);
  }
}, mchour / 20);

const app = express();
dotenv.config();
const corsOptions = {
  origin: process.env.APP_URL,
  credentials: true, 
  optionSuccessStatus: 200,
methods: 'GET, POST',
allowedHeaders: 'Content-Type,Authorization'
};

const PORT = process.env.PORT || 1000;

app.use(cors(corsOptions));
app.use("/gisservice", GisRoute);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get("/gisservice", (req, res) => {
  res.json({ message: "Welcome to Intreskol GIS service" });
});

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
