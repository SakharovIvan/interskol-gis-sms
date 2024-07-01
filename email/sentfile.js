import nodemailer from 'nodemailer'
import {emailConfig} from '../config.js'
import fs from 'fs'

let transporter = nodemailer.createTransport(emailConfig.nodemailer)

const sentmail=( emailto,subject,text='',attFile='',)=>{
if (attFile===''){
    transporter.sendMail({
        from: '<gis@kls-gr.ru>',
        to: emailto,
        subject: subject,
        text: text,
        html: text    
    })
}else{
 transporter.sendMail({
    from: '<gis@kls-gr.ru>',
    to: emailto,
    subject: subject,
    text: text,
    html: text,
    attachments: [{
        filename: attFile,
        content: fs.createReadStream('/interskol-gis-sms/'+`${attFile}`)    
    }

    ]

})
}
}

export default sentmail
