const http = require('http')


class TestClient {
    
    runTests() {
        this.baseConfig = {
            hostname: 'localhost',
            port: 3001,
            headers: {
                'Content-Type': 'text/json'
            }
        }
        let payload = {
            'name': 'Latest stuff from Microsoft',
            'url': 'http://something.com',
            'text': 'This is a blog post'
        }
        this.testPostItem(payload)
        this.testPostItem({
            'name': 'More stuff from Microsoft',
            'url': 'http://something.com',
            'text': 'This is a blog post'
        })
        this.testPostItem({
            'name': 'Most stuff from Microsoft',
            'url': 'http://something.com',
            'text': 'This is a blog post'
        })
        this.testGetAll()
        this.testGetOne()
    }

    testPostItem(payloadData){
        let payload = JSON.stringify(payloadData)
        console.log(payload)
        let config = this.baseConfig
        config.method = 'POST'
        config.path = '/posts'

        const req = http.request(config, (res) => {
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                let jsonRes = JSON.parse(responseData)
                if(res.statusCode){
                    console.log(`RESPONSE STATUS: ${res.statusCode}`)
                }
                if(jsonRes.id){
                    console.log(`SUCCESS: ${jsonRes.id}`)
                }
                else {
                    console.error(`ERROR: ${jsonRes}`)
                }
            })
        })
        req.on('error', (e) => {
            console.error(`ERROR: Unknown error occurred posting a blog item.\n${e}`)
        })
        req.write(payload)
        req.end()
    }

    testGetAll(){
        const config = this.baseConfig
        config.method = 'GET'
        config.path = '/posts'
        const req = http.request(config, (res) => {
            console.log(`${res.statusCode}`)
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                if(res.statusCode > 299){
                    console.error(`ERROR: Unexpected response code ${res.statusCode}`)
                }
                else {
                    let jsonRes = JSON.parse(responseData)
                    if(jsonRes.length > 0){
                        console.log(`SUCCESS: Returned ${jsonRes.length} items`)
                        console.log(jsonRes)
                    }
                    else {
                        console.error('ERROR: No data returned')
                        console.error(responseData)
                    }
                }
            })
        })
        req.end()
    }

    testGetOne(){
        console.log('TEST: testGetOne')
        const config = this.baseConfig
        config.method = 'GET'
        config.path = '/posts'
        const req = http.request(config, (res) => {
            console.log(`${res.statusCode}`)
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                if(res.statusCode > 299){
                    console.error(`ERROR: Unexpected response code ${res.statusCode}`)
                }
                else {
                    let jsonRes = JSON.parse(responseData)
                    if(jsonRes.length > 0){
                        let url = `http://${config.hostname}:${config.port}/posts/${jsonRes[0].id}`
                        console.log(`Getting URL ${url}`)
                        http.get(url, (res2) => {
                            
                            let singleData = ''
                            res2.on('data', (chunk) => {
                                singleData += chunk
                            })
                            res2.on('end', () => {
                                if(res2.statusCode > 299){
                                    console.error(`ERROR: Error retrieving single item. Response status code ${res2.statusCode}`)
                                }
                                else {
                                    let jsonSingle = JSON.parse(singleData)
                                    if(jsonSingle.id){
                                        console.log(`SUCCESS: Retrieved one item`)
                                        console.log(jsonSingle)
                                    } 
                                    else {
                                        console.log(`ERROR: Error trying to retrieve just one item`)
                                    }                                   
                                }
                            })
                        })
                    }
                    else {
                        console.error('ERROR: No data returned')
                        console.error(responseData)
                    }
                }
            })
        })
        req.end()
    }
}

let client = new TestClient()
client.runTests()