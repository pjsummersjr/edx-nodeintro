    const EventEmitter = require('events');
    const https = require('https');

    const httpUrl = 'https://gist.githubusercontent.com/azat-co/a3b93807d89fd5f98ba7829f0557e266/raw/43adc16c256ec52264c2d0bc0251369faf02a3e2/gistfile1.txt'

    class Job extends EventEmitter {
        constructor(ops){
            super(ops);
            this.on('start', () => {
                this.process()
            })
        }

        process(){
            https.get(httpUrl, (response) => {
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

    }

    module.exports = Job