import updateGISbd from '../src/JSONtoSQLbd.js'
import createJSONfromXLSX from '../src/emailDataToJSON.js'
//import {func as getPost} from '../email/imap_readfile.js'
import sentmail from '../email/sentfile.js'
import { emailConfig } from '../config.js'
import ctreateTlfArray from '../sms/cliTLF.js'
const mcday = 86400000 
const mchour=3600000



try{
    //let timer = setInterval(getPost,10000)
    //setTimeout(()=>{clearInterval(timer);console.log('stop')},60000)
    //setInterval(()=>{
      sentmail(emailConfig.SMTPSentreport.emailto,emailConfig.SMTPSentreport.subject,'SomeText',emailConfig.SMTPSentreport.attachment)
    //},mcday/48)
    //setInterval(()=>{
        ctreateTlfArray()
        .then((tlfArray)=>{
         return sentmail(emailConfig.SMTPSentcliSMS.emailto,tlfArray.join().replaceAll(")","").replaceAll("(","").replaceAll(" ","").replaceAll("+",""),emailConfig.SMTPSentcliSMS.textprin)
        })
        
    //},mchour/2)
    //await updateGISbd(createJSONfromXLSX('i.sakharov_LLWarranty17062024'))
    //console.log('data added')
 }catch (err){
     console.log(err)
 }