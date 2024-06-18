import reader from 'xlsx'

const createJSONfromXLSX=  (filename)=>{
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
console.log('createJSONfromXLSX done')
return data
}

export default createJSONfromXLSX