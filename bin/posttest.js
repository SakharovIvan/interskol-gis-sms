import sentmail from "../email/sentfile.js";

sentmail(
  emailConfig.SMTPSentreport.emailto,
  emailConfig.SMTPSentreport.subject,
  "SomeText"
);
