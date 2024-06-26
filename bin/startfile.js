import updateGISbd from '../src/JSONtoSQLbd.js'
import createJSONfromXLSX from '../src/emailDataToJSON.js'
import getPost from '../email/imap_readfile.js'
import sentmail from '../email/sentfile.js'
import { emailConfig } from '../config.js'
import {ctreateTlfArrayPrin,ctreateTlfArrayOpros} from '../sms/cliTLF.js'
const mcday = 86400000 
const mchour=3600000



try{
    //let timer = setInterval(getPost,10000)
    //setTimeout(()=>{clearInterval(timer);console.log('stop')},60000)
    //setInterval(()=>{
    //  sentmail(emailConfig.SMTPSentreport.emailto,emailConfig.SMTPSentreport.subject,'SomeText',emailConfig.SMTPSentreport.attachment)
    //},mchour)
    //setInterval(async ()=>{
        getPost()
        await updateGISbd(createJSONfromXLSX('i.sakharov_LLWarranty17062024'))
        ctreateTlfArrayPrin()
        .then((tlfArray)=>{
          console.log(tlfArray)
          if (tlfArray.length>1){
       return sentmail(emailConfig.SMTPSentcliSMS.emailto,tlfArray.join().replaceAll(")","").replaceAll("(","").replaceAll(" ","").replaceAll("+",""),emailConfig.SMTPSentcliSMS.textprin)
      }
    })

    ctreateTlfArrayOpros()
    .then((tlfArray)=>{
      console.log(tlfArray)
      if (tlfArray.length>1){
   return sentmail(emailConfig.SMTPSentcliSMS.emailto,tlfArray.join().replaceAll(")","").replaceAll("(","").replaceAll(" ","").replaceAll("+",""),emailConfig.SMTPSentcliSMS.textopros)
  }
  
})
        
   // },mchour/360)
 }catch (err){
     console.log(err)
 }