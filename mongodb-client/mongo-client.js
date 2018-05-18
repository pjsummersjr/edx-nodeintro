const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoUrl = 'mongodb://localhost:27017/edx-course-db'



MongoClient.connect(mongoUrl, (error, client) => {
    if(error) return process.exit(1)
    const db = client.db('edx-course-students')
    console.log('Connected successfully to server')
    
    insertDocuments(db, ()=> {
        updateDocuments(db, () => {
            removeDocuments(db, () => {
                findDocuments(db, () => {
                    client.close()
                })
                
            })
        })

    })
})

const findDocuments = (db, callback) => {
    const collection = db.collection('edx-course-students')

    collection.find({}).toArray((error, docs) => {
        if(error) return process.exit(1)
        console.log(2, docs.length)
        console.log(`Found the following documents:`)
        console.dir(docs)
        callback(docs)
    })
}

const insertDocuments = (db, callback) => {
    const mycollection = db.collection('edx-course-students')

    mycollection.insert([
        {name: 'Bob'}, {name: 'John'}, {name: 'Peter'}
    ], (error, result) => {
        if(error) return process.exit(1)
        console.log(result.result.n)
        console.log(result.ops.length)
        console.log('Inserted 3 documents into the edx-course-students collection')
        callback(result)
    })
}

const updateDocuments = (db, callback) => {
    var collection = db.collection('edx-course-students')

    const name = 'Peter'
    collection.update({name: name}, {$set: {grade: 'A'}}, (error, result) => {
        if(error) return process.exit(1)
        console.log(result.result.n)
        console.log(`Updated the student document where name = ${name}`)
        callback(result)
    })
}

const removeDocuments = (db, callback) => {
    const collection = db.collection('edx-course-students')

    const name = 'Bob'

    collection.remove({name: name}, (error, result) => {
        if(error) return process.exit(1)
        console.log(result.result.n)
        console.log(`Removed the document where name = ${name}`)
        callback(result)
    })
}