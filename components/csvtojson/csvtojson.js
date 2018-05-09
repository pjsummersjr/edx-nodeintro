const http = require('https')
const fs = require('fs')
const path = require('path')

class CSVJSonConverter {

    csvdatatojson(csvdata, jsonFile){
        let line = ''
        let lineCnt = 1
        let fieldNames = null
        let fieldVals = null
        let jsonDoc = '{"data":['
        for(var i=0; i <= csvdata.length; i++){
            if(csvdata[i] == '\n'){
                if(lineCnt == 1){
                    fieldNames = line.split(',')
                }
                else {
                    fieldVals = line.split(',')
                    jsonDoc += '{'
                    for(var y=0; y<=fieldNames.length; y++){
                        if(fieldNames[y] != undefined && fieldVals[y] != undefined){
                            jsonDoc += `"${fieldNames[y].trim()}":"${fieldVals[y].trim()}"`
                        }                        
                        if(y < fieldNames.length - 1){
                            jsonDoc += ','
                        }
                    }
                    jsonDoc += '}'
                }      
                if(lineCnt > 1 && i < csvdata.length-1){
                    jsonDoc += ','
                }          
                line = ''
                lineCnt ++
                i++
            }
            line += csvdata[i]
        }
        
        jsonDoc += ']}'
        try {            
            //This parse step is a very rudimentary test to confirm that my JSON format is valid
            jsonData = JSON.parse(jsonDoc) 
            fs.writeFileSync(path.join(__dirname,jsonFile), JSON.stringify(jsonData))
        }
        catch(e){
            console.error(`Error converting to JSON and/or writing to destination file:\n${e}`)
        }
        
    }



    csvtojson(url, jsonFile){
        let buffer = ''

        http.get(url, (res) => {

            res.on('data', (chunk) => {
                buffer += chunk
            })
            res.on('end', () => {
                this.csvdatatojson(buffer, jsonFile)
                //fs.writeFileSync(path.join(__dirname, jsonFile), buffer)
            })

        })
    }
}

module.exports = CSVJSonConverter