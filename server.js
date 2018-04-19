const express = require('express');
const app = express();
const fs = require('fs');

const window   = require('svgdom')
const SVG      = require('svg.js')(window)
const document = window.document

const draw = SVG(document.documentElement);

var path = require("path")
var child_process = require('child_process');

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');


let sock = 3000


app.get('/', function(req, res){
  console.log('web page requested')
});



app.get('/mandelbrot', function(req,res){
	function calcSpace(workerNum,numCPUs,totalX,totalY){
	   if( typeof calcSpace.xlength == 'undefined'){
		    calcSpace.xlength = totalX  ;
   			calcSpace.ylength = totalY / (numCPUs);
	   }

	   if (workerNum % 2 == 0){
		  xMin = 0;
		  xMax = calcSpace.xlength-1;
		  yMin = (workerNum/2)*calcSpace.ylength;
		  yMax = yMin+calcSpace.ylength-1;
		  return{
			  xMin:xMin,
			  xMax:xMax,
			  yMin:yMin,
			  yMax:yMax
		  }
	  }else{
		  xMin = calcSpace.xlength;
		  xMax = calcSpace.xlength*2;
		  yMin = (workerNum/2)*calcSpace.ylength;
		  yMax = yMin+calcSpace.ylength-1;
		  return{
			  xMin:xMin,
			  xMax:xMax,
			  yMin:yMin,
			  yMax:yMax
		  }
	  }

	}

	console.log('Master ${process.pid} is running');

	const totalX = 1000;
	const totalY = 1000;
	const cluster = require('cluster');


	let imagearr = []

	let frame = 0;
	let done  = 0;
	let numCPUs = require('os').cpus().length/2;
	numCPUs = 1;
	for ( let i = 0; i < numCPUs; i++){
		console.log('starting worker ' + i);
		var child = child_process.fork('./childMandelbrot');
		calcArea = calcSpace(i,numCPUs,totalX,totalY);
		child.send({calcArea:calcArea, frame:frame});

		child.on('message', function(msg){
			console.log("[master] msg received from child");
			imagearr.concat(msg.result);
			done++

			if ( done == numCPUs ){
				console.log("all points calculated");
				console.log(imagearr);
				res.render('mandelbrot',{imagearr:imagearr});
				imagearr = [];
				done = 0;
				frame++;
			}
		});
	}


});

app.listen(sock,()=>console.log('App listening on port ' + sock ));
