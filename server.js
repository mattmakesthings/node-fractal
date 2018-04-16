const express = require('express');
const app = express();
const cluster = require('cluster');
const fs = require('fs');

const window   = require('svgdom')
const SVG      = require('svg.js')(window)
const document = window.document

const draw = SVG(document.documentElement);

var path = require("path")

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');


let sock = 3000


app.get('/', function(req, res){
  console.log('web page requested')
});



app.get('/mandelbrot', function(req,res){
	draw.rect(100,100).fill('yellow').move(50,50)
	console.log(draw.svg())
});
app.listen(sock,()=>console.log('App listening on port ' + sock ));
