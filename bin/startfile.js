import updateGISbd from '../src/JSONtoSQLbd.js'
import createJSONfromXLSX from '../src/emailDataToJSON.js'
import func from '../email/imap_readfile.js'



try{
    //let timer = setInterval(func,10000)
    //setTimeout(()=>{clearInterval(timer);console.log('stop')},60000)
    await updateGISbd(createJSONfromXLSX('i.sakharov_LLWarranty17062024'))
    console.log('data added')
 }catch (err){
     console.log(err)
 }