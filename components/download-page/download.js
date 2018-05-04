const http = require('http')
const fs = require('fs')
const uuidv1 = require('uuid/v1')
const path = require('path')

const downloadPage = (url='http://www.nodeprogram.com') => {

    console.log(`Downloading url: ${url}`)

    const fetchPage = (urlF, callback) => {
        http.get(urlF, (res) => {
            let buffer = ''
            res.on('data', (chunk) => {
                buffer += chunk
            })
            res.on('end', () => {
                callback(null, buffer)
            })
        }).on('error', (e) => {
            console.error(`Got an error fetching the page\n${e}`)
            callback(e)
        })
    }

    const folderName = uuidv1()
    fs.mkdirSync(folderName)

    fetchPage(url, (error, data) => {
        if(error) return console.log(error)
        fs.writeFileSync(path.join(__dirname, folderName, 'url.txt'), url)
        fs.writeFileSync(path.join(__dirname, folderName, 'file.html'), data)
        console.log('Downloading is done in folder ', folderName)
    })
}

downloadPage(process.argv[2])
