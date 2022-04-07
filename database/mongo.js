const {MongoMemoryServer} = require('mongodb-memory-server');
const {MongoClient} = require('mongodb');

let database = null;

async function startDb() {
    const mongo = await MongoMemoryServer.create();
    const mongoDBURL = mongo.getUri();
    const connection = await MongoClient.connect(mongoDBURL);
    database = connection.db();
    console.log('success')
}

async function getDb(){
    if (!database) await startDb();
    return database;
}

module.exports = {
    getDb,startDb
};