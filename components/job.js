    const EventEmitter = require('events');
    const https = require('https');
    const http = require('http');
    const httpsUrl = 'https://gist.githubusercontent.com/azat-co/a3b93807d89fd5f98ba7829f0557e266/raw/43adc16c256ec52264c2d0bc0251369faf02a3e2/gistfile1.txt'

    class Job extends EventEmitter {
        constructor(ops){
            super(ops);
            this.on('start', () => {
                this.process()
            })
        }

        process(){
            https.get(httpsUrl, (response) => {
                let data = ""
                response.on('data', (dataChunk) => {
                    data += dataChunk.toString('utf8');
                });
                response.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data)
                        this.emit('done', {completedOn: new Date(), responseData: jsonData});
                    }
                    catch(e){
                        this.emit('error', {errorData: e})
                    }
                    
                });
            }).on('error', (error) => {
                this.emit('error', {errorData: error })
            })
        }

        postData() {
            const postData = JSON.stringify({foo: 'bar'})

            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '',
                method:'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
                }
            }

            const req = http.request(options, (res) => {
                let rawData = ""
                res.on('data', (chunk) => {
                    console.log('Received post response chunk')
                    rawData += chunk
                })
                res.on('end', () => {
                    console.log('Post complete')
                    this.emit('done', {completedOn: new Date(), responseData: rawData})    
                })
            })

            req.on('error', (e) => {
                this.emit('error', {errorData: e});
            })

            console.log('Posting...')
            req.write(postData)
            req.end()
        }

    }

    module.exports = Job