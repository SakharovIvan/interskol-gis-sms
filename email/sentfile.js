import nodemailer from 'nodemailer'
import {emailConfig} from '../config.js'


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
    attachments: [attFile

    ]

})
}
}

export default sentmail
