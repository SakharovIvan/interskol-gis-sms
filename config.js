import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config();

const emailConfig = {
  imap: {
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    tls: true,
  },
  nodemailer: {
    host: "smtp.lancloud.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  imapOptions: {
    markAsRead: true,
  },
  downloads: {
    directory: "./downloads",
    filenameFormat: "$FROM.xml",
  },
  logs: {
    level: "info",
    simpleNodeLogger: {
      logFilePath: "mail-downloader.log",
      timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
    },
  },
  emailArray: ["i.sakharov@kls-gr.ru", "gis@kls-gr.ru"],

  SMTPSentcliSMS: {
    emailto: "i.sakharov@kls-gr.ru",
    textprin: "Ваш инструмент принят",
    textopros: "Оцените качетсво",
    textvipoln: "Ваш инструмент выполнен",
  },
  SMTPSentreport: {
    emailto: "i.sakharov@kls-gr.ru",
    attachment: "/home/petProjects/interskol-gis-sms/",
    subject: "Отчет ДСО",
  },
};

const sequelizeGIS = new Sequelize({
  dialect: "postgres",
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  logging: false,
});

export { emailConfig, sequelizeGIS };
