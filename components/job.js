    const EventEmitter = require('events');
    const http = require('http');

    const httpUrl = 'http://nodeprogram.com'

    class Job extends EventEmitter {
        constructor(ops){
            super(ops);
            this.on('start', () => {
                this.process()
            })
        }

        process(){
            http.get(httpUrl, (response) => {
                let data = ""
                response.on('data', (dataChunk) => {
                    data += dataChunk.toString('utf8');
                });
                response.on('end', () => {
                    console.log(data);
                    this.emit('done', {completedOn: new Date()});
                });
            })
        }

    }

    module.exports = Job