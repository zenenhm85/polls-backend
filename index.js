/*=============================================
REQUIREMENTS
=============================================*/
require('dotenv').config();
const express = require('express');
const cors = require('cors');


const {dbConection} = require('./database/config.database');


/*=============================================
/ Starting express server
=============================================*/
const app = express();

/*=============================================
RUNNING CORS
=============================================*/
app.use(cors());

/*=============================================
BODY READING AND PARSE
=============================================*/
// parse application/json
app.use(express.json());

/*=============================================
ROUTES
=============================================*/
app.use('/api/users', require('./routes/user.route'));
app.use('/api/login', require('./routes/auth.route'))

/*=============================================
DATABASE'S CONNECTION 
=============================================*/

dbConection();

/*=============================================
HTTP PORT OUTPUT
=============================================*/
app.listen(process.env.PORT, ()=>{
    console.log(`Server open in port: ${process.env.PORT}`);
});