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
                response.on('data', (dataChunk) => {
                    console.log(dataChunk.toString('utf8'));
                });
                response.on('end', () => {
                    console.log('Request complete');
                    this.emit('done', {completedOn: new Date()});
                });
            })
        }

    }

    module.exports = Job