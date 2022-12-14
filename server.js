
require('dotenv').config()


const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync().then(() => {
  console.log('Drop and Resync Db');
  // initial();
});


function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/project.routes')(app);
require('./app/routes/subs.routes')(app);

app.get('/api/test', (req, res) => {
  console.log('connection test successfull')
  res.send('connected')
})
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});