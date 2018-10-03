const express = require('express');
const app = express();
var cors = require('cors');

const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
child = exec("casperjs subasta.js", function (error, stdout, stderr){
  console.log(stdout);
});  
setInterval(function(){ 
  child = exec("casperjs subasta.js", function (error, stdout, stderr){
    console.log(stdout);
  });  
}, 60*60*1000);

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist/subasta-app'));
// use it before all route definitions
// app.use(cors({origin: 'http://localhost:4300'}));
app.use(cors())
// For all GET requests, send back index.html
// so that PathLocationStrategy can be use
app.get('/api', (req, res) => res.json({ application: 'Reibo collection' }));
app.get('/api/subastas', (req, res) => {
    try {
      return res.json({ subastas: JSON.parse(fs.readFileSync('subasta.json', 'utf8')) });
    } catch (err) {
      console.log(err);
      return res.json({'message': err  });
    }
});
app.get('/api/log', (req, res) => {  
  try {
    res.json( JSON.parse( fs.readFileSync('log', 'utf8') ) );
  } catch(e) {
    res.json({message: "error"});
  }
});
// var obj = JSON.parse(fs.readFileSync('file', 'utf8'));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/subasta-app/index.html'));
  });
app.get('/*', (req, res) => {
    res.json({ 'message': 'page dont fount' }) 
  }  
);
// Start the app by listening on the default
// Heroku portgit
app.listen(4300, function() {
    console.log("Server started in port " + 4300 + ".......");
});