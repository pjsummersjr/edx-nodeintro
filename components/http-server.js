const http = require('http')
const port = 3000

http.createServer((req, res) => {
    console.log(req.headers)
    console.log(req.method)
    console.log(req.url)
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Hello World\nHello Paul')
}).listen(port)

console.log(`Running server at http://localhost:${port}`)