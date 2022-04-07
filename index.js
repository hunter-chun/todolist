const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {startDb} = require('./database/mongo');
const {insertItem,getItems} = require('./database/db');
const {deleteItem,updateItem} = require('./database/db');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
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

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-t05rxows.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://testcall-todos',
    issuer: 'https://dev-t05rxows.us.auth0.com/',
    algorithms: ['RS256']
});


app.use(jwtCheck)
app.post('/', async (req,res) => {
    const newItem = req.body;
    await insertItem(newItem);
    res.send({message:'Item inserted'});
});

app.use(jwtCheck)
app.delete('/:id', async (req,res) => {
    await deleteItem(req.params.id);
    res.send({message:'Item removed'});
});

app.use(jwtCheck)
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
