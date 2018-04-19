
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

//calc and return to master
process.on('message', function(message){
	console.log('[child] message received from server: ' , message);
	let manarr = mandelbrotCalc(message.calcArea, message.frame);
	process.send({result:manarr});
	process.disconnect();
})
