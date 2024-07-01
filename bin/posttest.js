import sentmail from "../email/sentfile.js";
import { emailConfig } from '../config.js'

sentmail(
  emailConfig.SMTPSentreport.emailto,
  emailConfig.SMTPSentreport.subject,
  "SomeText",
  "GISdata.xlsx"
);
