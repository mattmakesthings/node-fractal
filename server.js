const express = require('express');
const app = express();
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
	const totalX = 1000;
	const totalY = 1000;
	const cluster = require('cluster');
	const numCPUs = require('os').cpus().length/2;

	let imagearr = []




	workerarr = [numCPUs];
	for( let i = 0; i < numCPUs; i++){
		workerarr = 0;
	}


	function getWorkerNum(){
		for( let i = 0; i < workerarr.length; ++i == workerarr.length? i = i : i = 0 ){
			if( workerarr[i] == 0){
				workerarr[i] = 1;
				return i;
			}
		}

	}

	function releaseWorker(workerNum){
		if(workerarr[workerNum] == 1){
			workerarr[workerNum] = 0;
		}
	}

	function calcSpace(workerNum,numCPUs,totalX,totalY){
	   if( typeof calcSpace.xlength == 'undefined'){
		    calcSpace.xlength = totalX /2 ;
   			calcSpace.ylength = totalY / (numCPUs/2);
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


	function messageHandler(msg){
		console.log("mandelbrot pts received");
		imagearr.concat(msg.data);
	}

	if(cluster.isMaster){
		console.log('Master ${process.pid} is running');

		let frame = 0;

		for ( let i = 0; i < numCPUs; i++){
			console.log('starting worker ' + i);
			var child = child_process.fork('./childMandelbrot');
			calcArea = calcSpace(workerNum,numCPUs,totalX,totalY);
			child.send({calcArea:calcArea, frame:frame});
		}

		//receive array of mandelbrot points
		for (const id in cluster.workers) {
			//console.log('starting messageHandler ' + id);
	    	cluster.workers[id].on('message', messageHandler);
	  	}
		console.log('exit');
		for (const id in cluster.workers) {
	    	cluster.workers[id].on('exit', () => {
				let allDead = true;
				for( let i = 0; i < workerarr.length; i++)
					if( workerarr == 1)
						allDead = false

				if(allDead){
					res.render('mandelbrot',{imagearr:imagearr});
					imagearr = [];
					frame++;
					}
				});
			}

	  	}
		if (cluster.isWorker){
			console.log('enter');
			console.log('Worker ${process.pid} is running');
			//this is a worker process
			workerNum = getWorkerNum(numCPUs);
			if (typeof workerNum == 'undefined'){
				console.log('worker number exceeded');
				process.exit(0);
			}
			calcArea = calcSpace(workerNum,numCPUs,totalX,totalY);
			sendobj = mandelbrotCalc(calcArea,frame)
			process.send({ data: sendobj });
			releaseWorker(workerNum);


		}

});


function mandelbrotCalc(space, frame){
	let retarr = [];

	if (typeof mandelbrotCalc.color == 'undefined'){
		mandelbrotCalc.color = 0;
		mandelbrotCalc.magnificationFactor = 2900;
		mandelbrotCalc.panX = .7;
		mandelbrotCalc.panY = .6;

	}

	maxIterations = 300;

	xMin = space.xMin;
	xMax = space.xMax;
	yMin = space.yMin;
	yMax = space.yMax;

	// update color
	if (frame % 360/4 == 0)
			mandelbrotCalc.color = 0;
	mandelbrotCalc.color+=4;

	// calculate points
	function mandelbrot() {
	    function checkIfBelongsToMandelbrotSet(x,y) {
	        var realComponentOfResult = x;
	        var imaginaryComponentOfResult = y;

	        for(var i = 0; i < maxIterations; i++) {
	             var tempRealComponent  = realComponentOfResult * realComponentOfResult;
	                 tempRealComponent -= imaginaryComponentOfResult * imaginaryComponentOfResult;
	                 tempRealComponent += x;
	             var tempImaginaryComponent  = 2 * realComponentOfResult * imaginaryComponentOfResult
	                 tempImaginaryComponent += y;

	             realComponentOfResult = tempRealComponent;
	             imaginaryComponentOfResult = tempImaginaryComponent;

	             // Return a number as a percentage
	             if(realComponentOfResult * imaginaryComponentOfResult > 3)
	                return (i/maxIterations * 100);
	        }
	        return 0;   // Return zero if in set
	    }

	    for(var x=0; x > xMin && x < xMax; x++) {
	       for(var y=0; y > yMin && y < yMax; y++) {
	           var belongsToSet = checkIfBelongsToMandelbrotSet(x/magnificationFactor - panX,y/magnificationFactor - panY);
	              if(belongsToSet == 0) {
					  retarr.push({x:x, y:y, fill:'hsl(0,100%,0%)' });
	               } else {
					   retarr.push({x:x, y:y, fill:'hsl('+color+', 100%, ' + belongsToSet + '%)'});
	               }
	       	}
	    }
		return retarr;
	};
	return mandelbrot()
}

app.listen(sock,()=>console.log('App listening on port ' + sock ));
