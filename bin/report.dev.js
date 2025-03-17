import reportService from "../src/services/report-service.js";
import { emailConfig } from "../config.js";
import sentmail from "../email/sentfile.js";


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