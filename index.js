const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {startDb} = require('./database/mongo');
const {insertItem,getItems} = require('./database/db');
const {deleteItem,updateItem} = require('./database/db');
const app = express();
const db = [];

app.use(helmet());
app.use(bodyParser());
app.use(cors());
app.use(morgan('combined'));

//routes
app.get('/', async (req,res) => {
    res.send(await getItems());
});

app.post('/', async (req,res) => {
    const newItem = req.body;
    await insertItem(newItem);
    res.send({message:'Item inserted'});
});

app.delete('/:id', async (req,res) => {
    await deleteItem(req.params.id);
    res.send({message:'Item removed'});
});

app.put('/:id', async (req,res) => {
    const updatedItem = req.body;
    await updateItem(req.params.id, updatedItem);
    res.send({message:'Item updated'});
});

startDb().then(async () => {
    await insertItem({title:"dummy todo!"});
    app.listen(3000,() => {
        console.log('App listening on port 3000!');
    });
});