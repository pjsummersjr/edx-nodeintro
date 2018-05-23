const mongoDb = require('mongodb')
const fs = require('fs')
const config = require('./config.js')
const async = require('async')

const MongoClient = mongoDb.MongoClient

/*
* This method resets the environment for testing and validation
*/
const setup = (config) => {
    let customerData = JSON.parse(fs.readFileSync(config.customerJson, 'utf8'))
    let addressData = JSON.parse(fs.readFileSync(config.customerAddressJson, 'utf8'))

    cleanDb(config, (error) => {
        if(error) console.error(`Could not successfully clean both tables`)
        else {
            loadDbs(config, customerData, addressData, 23)
        }
    })    
}

const loadDbs = (config, customerData, addressData, rowCount) => {
    loadDb(config.databaseUrl, config.customerDb, config.customerDataCollection, customerData, rowCount)
    loadDb(config.databaseUrl, config.customerAddressDb, config.customerAddressCollection, addressData, rowCount)
}

/* Loads 'data' into the target database (dbName) and collection */
const loadDb = (dbURL, dbName, collection, data, rowCount) => {
    MongoClient.connect(dbURL, (error, client) => {
        if(error) {
            console.log(`Error connecting to the database: ${error}`)
            return process.exit(1)
        } 
        const dbObj = client.db(dbName)
        console.log('Connected successfully to server')
        let subset = []
        let totalRows = data.length
        let currentHits = 0
        let totalInserts = 0
        console.debug(`Inserting ${totalRows} records into the the ${dbName}/${collection} database in increments of ${rowCount}`)
        while(currentHits < totalRows){    
            let tmp = currentHits + rowCount
            console.debug(`Retrieving records ${currentHits} through ${tmp}`)
            subset = data.slice(currentHits, tmp)   
            console.debug(`Inserting ${subset.length} records starting at record ${currentHits}`)
            
            insertRows(dbObj, collection, subset, (error, result) => {
                if(error) console.error(`Error inserting rows into customer database: ${error}`)
                else {
                    totalInserts += result.result.n
                    console.log(`Inserted ${result.result.n} elements into the ${dbName}/${collection} database (${totalInserts} total so far)`)
                }
            })
            currentHits += rowCount
        }
        client.close()
    })
}
/* Removes all data from the two databases */
const cleanDb = (config, callback) => {
    MongoClient.connect(config.databaseUrl, (error, client) => {
        if(error) return process.exit(1)
        const customer_db = client.db(config.customerDb)
        const customer_address_db = client.db(config.customerAddressDb)
        console.log('Connected successfully to server')
        removeAllRows(customer_address_db, config.customerAddressCollection, (error, result) => {
            if(error) console.error(`Could not clean customer address db: ${error}`)
            else {
                console.log(`Successfully removed ${result.result.n} records from customer address database`)
                
                removeAllRows(customer_db, config.customerDataCollection, (error, result) => {
                    if(error) {
                        console.log(`Could not clean customer db data: ${error}`)
                    }
                    else {
                        console.log(`Successfully removed ${result.result.n} records from customer database`)
                        client.close()
                        callback()
                    }
                })
            }
        })
    })
}
/* Inserts rows in data to the db/collection */
const insertRows = (db, collectionName, data, callback) => {
    const collection = db.collection(collectionName)
    console.log(`Inserting rows`)
    if(data && data.length > 0) {
        collection.insertMany(data, (error, result) => {
            if(error) callback(error, result) 
            else {
                console.log(`Successfully inserted ${result.result.n} rows in the ${collectionName} collection`)
                callback(null, result)
            }
        })
    }
    else {
        console.log(`No data provided in data object in insertRows`)
    }
}
/* Removes all rows from db/collectionName */
const removeAllRows = (db, collectionName, callback) => {
    const collection = db.collection(collectionName)

    collection.remove({}, (error, result) => {
        if(error) callback(error, null)
        else {
            console.log(`All documents removed from ${collection}`)
            callback(null, result)
        }        
    })
}

/* This is the function that actually merges the relevant rows from each database */
const updateFunction = (callback, customerDataItem, addressCollection, customerCollection) => {
    console.log(`Updating item ${customerDataItem.id}`)
    
    addressCollection.find({"id": Number(customerDataItem.id)}).toArray((error, result) => {
        if(error) callback(error,null)
        if(result && result.length > 0){
            console.log(`Found and processing record with id ${customerDataItem.id}`)
            customerCollection.update({"id":customerDataItem.id}, 
            {$set: {
                country: result[0].country,
                city: result[0].city,
                state: result[0].state,
                phone: result[0].phone
            }}, (error, result) => {
                if(error) callback(error, null)
                else callback(null, customerDataItem.id)
            })
        }
        else {
            console.error(`Address item ${customerDataItem.id} not found in lookup. Continuing.`)
        }
    })        
}
/* Retrieves list of of customer records from the primary customer data table */
const getCustomers = (config, docsPerBatch, callback) => {
    MongoClient.connect(config.databaseUrl, (error, client) => {
        if(error) callback(error, null)
        else {
            console.log('Connected to the database')
            const customer_db = client.db(config.customerDb)
            let coll = customer_db.collection(config.customerDataCollection)

            coll.find().toArray((error, result) => {
                if(error) console.error(error)
                else {
                    callback(result)
                    client.close()
                }
            })
        }

    })
}
/* This is the function that loads the function for each record and loads them into the async call */
const mergeData = (opsPerBatch, config) => {
    if(!opsPerBatch) opsPerBatch = 25
    console.log(`Merging records ${opsPerBatch} parallel operations at a time`)

    getCustomers(config, opsPerBatch, (returnedDocs) => {
        if(returnedDocs.length <= 0) {
            console.error('No documents found in the customer database. Please run the script with argument of \'s\' to properly stage the data. You may need to update the path in the datafile.')
            return process.exit(1)
        }
        console.log(`Retrieved ${returnedDocs.length} documents from the customer database`)

        MongoClient.connect(config.databaseUrl, (connectError, client) => {

            if(connectError) console.error(`Client connection error ${error}`)

            const customer_address_db = client.db(config.customerAddressDb)
            const addressCollection = customer_address_db.collection(config.customerAddressCollection)
            const customer_db = client.db(config.customerDb)
            const customerCollection = customer_db.collection(config.customerDataCollection)

            let opSet = []
            returnedDocs.forEach((element) => {
                opSet.push((callback) => { updateFunction(callback, element, addressCollection, customerCollection)})
            });
            async.parallelLimit(opSet, opsPerBatch, (error, result) => {
                if(error) console.log(`An error occurred processing the operations in parallel: ${error}`)
                else {
                    console.log(`Safely updated ${result.length} total records with a maximum of ${opsPerBatch} parallel operations.`)
                }
                client.close()
            })
        })
    })
}


let op = process.argv[2]
/* 
 * Providing 's' as your first arg will reset the data set. 
 * Anything else will actually run the merge operations 
*/
if(op == 's') {
    setup(config)
}
else {    
    mergeData(op, config)
}
