import nodemailer from 'nodemailer'
import {emailConfig} from '../config.js'
import fs from 'fs'

let transporter = nodemailer.createTransport(emailConfig.nodemailer)

const sentmail=()=>{
 transporter.sendMail({
    from: '<gis@kls-gr.ru>',
    to: emailConfig.emailArray,
    subject: 'Attachments',
    text: 'This message with attachments.',
    html: 'This message with attachments.',
    attachments: [
        {
            filename: 'text4.xlsx',
            content: fs.createReadStream('/home/petProjects/interskol-gis-sms/GISdata.xlsx')    
        }
    ]

})
}

export default sentmail
