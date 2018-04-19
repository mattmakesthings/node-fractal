
function mandelbrotCalc(space, frame){


	if (typeof mandelbrotCalc.color == 'undefined'){
		mandelbrotCalc.color = 0;
		mandelbrotCalc.magnificationFactor = 2900;
		mandelbrotCalc.panX = .7;
		mandelbrotCalc.panY = .6;

	}

	let magnificationFactor = mandelbrotCalc.magnificationFactor;
	let panX = mandelbrotCalc.panX;
	let panY = mandelbrotCalc.panY;
	let color = mandelbrotCalc.color;

	maxIterations = 300;

	let xMin = space.xMin;
	let xMax = space.xMax;
	let yMin = space.yMin;
	let yMax = space.yMax;

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
		let retarr = [];
	    for(var x=xMin;  x <= xMax; x++) {
	       for(var y=yMin; y <= yMax; y++) {
	           var belongsToSet = checkIfBelongsToMandelbrotSet(x/magnificationFactor - panX,y/magnificationFactor - panY);
	              if(belongsToSet == 0) {
					  retarr.push({x:x, y:y, fill:'#000' });
	               } else {
					  retarr.push({x:x, y:y, fill:'hsl('+color+', 100%, ' + belongsToSet + '%)'});
	               }
	       	}
	    }
		return retarr;
	}
	return mandelbrot()
}

//calc and return to master
process.on('message', function(message){
	console.log('[child ' + message.workerNum + ']  message received from server');
	console.log(message.calcArea);
	let manarr = mandelbrotCalc(message.calcArea, message.frame);
	console.log(manarr.length);
	//for (let i= 0; i < manarr.length; i++){
	process.send({
		result	  : manarr,
		workerNum : message.workerNum,
		done 	  : false
	});

	//}
	process.send({
		result 	  : undefined,
		workerNum : message.workerNum,
		done 	  : true
	});
	console.log('[child ' + message.workerNum + '] response sent to server');
	process.exit();
})
