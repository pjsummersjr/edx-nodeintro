const http = require('http')
const port = 3000

http.createServer((req, res) => {
    console.log(req.headers)
    console.log(req.method)
    console.log(req.url)
    
    console.log(`METHOD: ${req.method}`)
    if(req.method == 'POST'){
        let buff = ''
        req.on('data', (chunk) => {
            buff += chunk
        })
        req.on('end', () => {
            console.log(`BODY: ${buff}`)
            res.end('\nAccepted body\n')
        })
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/plain'})
        res.statusCode = 200
        res.write('Hello World');
        res.end('Regards,\nPaul\n')
    }
    
}).listen(port)

console.log(`Running server at http://localhost:${port}`)