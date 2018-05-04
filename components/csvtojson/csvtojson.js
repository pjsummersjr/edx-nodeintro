const http = require('https')
const fs = require('fs')
const path = require('path')

class CSVJSonConverter {


    csvtojson(url, jsonFile){
        let buffer = ''

        http.get(url, (res) => {

            res.on('data', (chunk) => {
                buffer += chunk
            })
            res.on('end', () => {
                fs.writeFileSync(path.join(__dirname, jsonFile), buffer)
            })

        })
    }
}

module.exports = CSVJSonConverter