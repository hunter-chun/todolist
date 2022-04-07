const {getDb} = require('./mongo');
const {ObjectID} = require('mongodb');
const collectionName = 'db';

async function insertItem(item){
    const db = await getDb();
    const {insertId} = await db.collection(collectionName).insertOne(item);
    return insertId;
}

async function deleteItem(id){
    const db = await getDb();
    await db.collection(collectionName).deleteOne({_id:new ObjectID(id),})
}

async function updateItem(id,item){
    const db = await getDb();
    delete item._id;
    await db.collection(collectionName).update(
        {_id: new ObjectID(id),},
        {
            $set:{...item},
        },
    );
}

async function getItems(){
    const db = await getDb();
    return await db.collection(collectionName).find({}).toArray();
}

module.exports = {
    insertItem,
    getItems,
    deleteItem,
    updateItem,
};