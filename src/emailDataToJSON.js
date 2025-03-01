import reader from 'xlsx'

function createJSONfromXLSX (filename){
const file =  reader.readFile('./downloads/'+filename+'.XLSX')
let data =[]
const sheets = file.SheetNames
for (let i=0; i<sheets.length;i++){
    const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]]
    )
    temp.forEach((res)=>{
        data.push(res)
    })
}
return data
}


export default createJSONfromXLSX