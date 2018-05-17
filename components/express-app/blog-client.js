const http = require('http')


class TestClient {
    
    runTests() {
        this.baseConfig = {
            hostname: 'localhost',
            port: 3001,
            headers: {
                'Content-Type': 'application/json'
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
        //this.testGetAll()
        //this.testGetOne()
    }

    testPostItem(payloadData){
        let payload = JSON.stringify(payloadData)
        console.log(payload)
        let config = this.baseConfig
        config.method = 'POST'
        config.path = '/posts'
        config.headers = {
                'Content-Length': Buffer.byteLength(payload),
                'Content-Type': 'application/json'
            }

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
        //console.log('Posting payload: ' + payload)
        req.write(payload)
        req.end()
    }

    testGetAll(){
        console.log(`TEST (testGetAll): Starting`)
        const config = this.baseConfig
        config.method = 'GET'
        config.path = '/posts'
        const req = http.request(config, (res) => {
            console.log(`TEST (testGetAll) - Response code: ${res.statusCode}`)
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                if(res.statusCode > 299){
                    console.error(`TEST (testGetAll) - ERROR: Unexpected response code ${res.statusCode}`)
                }
                else {
                    let jsonRes = JSON.parse(responseData)
                    if(jsonRes.length > 0){
                        console.log(`TEST (testGetAll) - SUCCESS: Returned ${jsonRes.length} items`)
                        console.log(jsonRes)
                    }
                    else {
                        console.error('TEST (testGetAll) - ERROR: No data returned')
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
            console.log(`TEST (testGetOne): ${res.statusCode}`)
            let responseData = ''
            res.on('data', (chunk) => {
                responseData += chunk
            })
            res.on('end', () => {
                if(res.statusCode > 299){
                    console.error(`TEST (testGetOne) - ERROR: Unexpected response code ${res.statusCode}`)
                }
                else {
                    let jsonRes = JSON.parse(responseData)
                    if(jsonRes.length > 0){
                        let url = `http://${config.hostname}:${config.port}/posts/${jsonRes[0].id}`
                        console.log(`TEST (testGetOne): Getting URL ${url}`)
                        http.get(url, (res2) => {
                            
                            let singleData = ''
                            res2.on('data', (chunk) => {
                                singleData += chunk
                            })
                            res2.on('end', () => {
                                if(res2.statusCode > 299){
                                    console.error(`TEST (testGetOne) - ERROR: Error retrieving single item. Response status code ${res2.statusCode}`)
                                }
                                else {
                                    let jsonSingle = JSON.parse(singleData)
                                    if(jsonSingle.id){
                                        console.log(`TEST (testGetOne) - SUCCESS: Retrieved one item`)
                                        console.log(jsonSingle)
                                    } 
                                    else {
                                        console.log(`TEST (testGetOne) - ERROR: Error trying to retrieve just one item`)
                                    }                                   
                                }
                            })
                        })
                    }
                    else {
                        console.error('TEST (testGetOne) - ERROR: No data returned')
                        console.error(responseData)
                    }
                }
            })
        })
        req.end()
    }

    /* testPutPost(){
        const config = this.baseConfig
        config.method = 'PUT'
        config.path = '/posts'

        const postUpdate = {
            name: "Post update from Microsoft",
            url: "http://www.something.com/update",
            text: "This is an update to an existing post"
        }

        const getUrl = `http://${config.hostname}:${config.port}/posts`
        http.get(getUrl, (res) => {
            let resData = ''
            res.on('data', (chunk) => {
                resData += chunk
            })
            res.on('end', () => {
                if(resData && resData.length > 0)
                let resJson = JSON.parse(resData)
                config.path = `/posts/${resJson[0].id}`
                res.request(config, (res) => {

                })
            })
        })
    } */
}

let client = new TestClient()
client.runTests()