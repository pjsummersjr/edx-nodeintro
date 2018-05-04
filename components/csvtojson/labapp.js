const CsvJsonConverter = require('./csvtojson.js')

const csvFileUrl = 'https://prod-edxapp.edx-cdn.org/assets/courseware/v1/07d100219da1a726dad5eddb090fa215/asset-v1:Microsoft+DEV283x+1T2018+type@asset+block/customer-data.csv'
const jsonFilePath = 'csvasjson.json'

let converter = new CsvJsonConverter()

converter.csvtojson(csvFileUrl, jsonFilePath)