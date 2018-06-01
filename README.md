# node-fractal

Because node.js provides multithreading functionality and fractal calculations are 'embarassingly parallel' this is an exercise in multithreading in node.js

## Installing
```
git clone https://github.com/mattmakesthings/node-fractal
cd node-fractal
npm install
```
## Running 
```
node server.js
```
then visit 
```
http://localhost:3000/mandelbrot
```
in your browser (has only been tested with google chrome)

## Built With

* [Node.js](https://nodejs.org/en/) 
* [Express](https://expressjs.com/)
* [ejs](http://ejs.co/) 

## Authors

* **Matthew Weidman** - [github](https://github.com/mattmakesthings)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

[this post](https://progur.com/2017/02/create-mandelbrot-fractal-javascript.html)
was used as the basis for calculating the mandelbrot set
