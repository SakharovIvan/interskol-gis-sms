import {  gis_DB_job } from "../src/index.js";
//import { scheduleJob } from "node-schedule";
//import reportService from "../src/services/report-service.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GisRoute } from "../routes/gis.route.js";
import bodyParser from "body-parser";
import getPost from '../src/services/email/imap_readfile.js'
const mcday = 86400000;
const mchour = 3600000;
const week = mcday * 7;
const emailReport = "a.rogov@kls-gr.ru; i.sakharov@kls-gr.ru";



const smsrule = "*/5 14 * * 1-5";

const reportrule = "0 15 * * 0-4";


//scheduleJob(reportrule, function () {
//  try {
//    reportService
//      .CreateReport()
//      .then(() => {
//        sentmail(
//          emailConfig.SMTPSentreport.emailto,
//          emailConfig.SMTPSentreport.subject,
//          "Отчет ДСО",
//          "GISdata.xlsx"
//        );
//      })
//      .then(() => {
//        console.log("Report sent");
//      });
//  } catch (err) {
//    console.log(err);
//  }
//});
//

setInterval(() => {
  try {
    getPost();
    setTimeout(async () => {
      console.log("gis_DB_job started");
      return await gis_DB_job();
    });
  } catch (err) {
    console.log(err);
  }
}, mchour / 40);



const app = express();
dotenv.config();
const corsOptions = {
  origin: process.env.APP_URL,
  credentials: true,
  optionSuccessStatus: 200,
  methods: "GET, POST",
  allowedHeaders: "Content-Type,Authorization",
};

const PORT = process.env.PORT || 1000;

app.use(cors(corsOptions));
app.use("/gisservice", GisRoute);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/gisservice", (req, res) => {
  res.json({ message: "Welcome to Intreskol GIS service" });
});

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
