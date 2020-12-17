//  Circle of Fifths to Spectrum
//  #   Key     Hz     Colour      Nm (WVLNTH)    Hue (deg)
//  ---------------------------------------------------
//  0   C       523    Green       525            120
//  1   C#/Db   554    Lime        564            80
//  2   D       587    Yellow      570            60
//  3   D#/Eb   622    Y-Orange    580            45
//  4   E       659    Orange      620            30
//  5   F       698    Red         700            0
//  6   F#/Gb   739    Magenta     740            330
//  7   G       392    Violet      435            285
//  8   G#/A    415    Purple      446            260
//  9   A       440    Dark Blue   450            235
//  10  A#/Bb   466    Blue        466            190
//  11  B       493    Aqua        488            160
//
 var songKey = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
 var songHue = [120, 80, 60, 45, 30, 0, 330, 285, 260, 235, 190, 160]
//  hsl(key, valence, energy)
//  key = 11 = B = 160
//  valence = 0.818 * 100 = 81.1
//  energy = 0.578 * 100 = 57.8
//  = hsl(160, 81.1, 57.8)

//  Colour Picker:
//  Key = Hue
//  Valence = Saturation
//  Energy = Luminance
//
//  Tempo = radius
//  Danceability
//  Loudness
//  Mode (Major=1/Minor=0)
// var authenticateButton = document.getElementById("authenticate").href
// var auth
// var authURL = "https://accounts.spotify.com/authorize"
// var authClient = "?client_id=" + "865f5b5b201c4f16ba15284057e4f26b"
// var authRType = "&response_type=token"
// var authRedirect = "&redirect_uri=" + encodeURIComponent("https://adrianfranzese.github.io/P5_plus_Spotify/")
// // var authRedirect = "&redirect_uri=" + encodeURIComponent("http://0.0.0.0:8000/")
// var authScope = "&scope=" + "user-read-currently-playing"
// auth = authURL + authClient + authRType + authRedirect + authScope
// authenticateButton = authURL + authClient + authRType + authRedirect + authScope

var s = new SpotifyWebApi()
var searchList
var mySong
var songID = ""

var key
var valence
var energy
var loudness
var tempo

var myInput

function getURLQuery(u) {
  var q = window.location.hash.substring(1)
  var v = q.split('&')
  for (var i = 0; i < v.length; i++) {
    var pair = v[i].split("=")
    if (pair[0] == u){return pair[1]}
  }
  return false
}


if (window.location.hash == "") {
  window.alert("Please authorize your Spotify account");
}
else {
  s.setAccessToken(getURLQuery('access_token'))
}

function searchAudioFeatures() {
  s.getAudioFeaturesForTrack(songID, function(err, data) {
      if (err) console.error(err)
      else {
        //  set mySong to the returned data object (same deal with search data - NEED TO USE FUNCTION)
        mySong = returnData(data)
        //  Set some vars to specific values
        key = mySong.key;
        valence = mySong.valence;
        energy = mySong.energy;
        loudness = mySong.loudness;
        tempo = mySong.tempo;
        document.write(key);
        document.write(valence);
        document.write(loudness);

      }
  })
}

function returnData(responseData){
  return responseData
}

function searchForSong(myInput) {
  //  set myInput to search box contents
  myInput = document.getElementById("searchBox").value
  //  If the box is empty, dont search and set some blank vars
  if (myInput == "") {
    songID = "";
    key = 0;
    valence = 0;
    energy = 0;
    tempo = 0;
    loudness = 0;
  }
  //  Otherwise search Spotify for myInput
  else {
    s.searchTracks(myInput, function(err, data) {
      //  If there's an error, throw an error
      if (err) console.error(err)
      //  Otherwise continue as planned
      else {
        //  send the returned data to a function to deal with it
        //  (Data wont have been downloaded by the time 'return data' is run, here the function just passes
        //  back Data once it's ready)
        searchList = returnData(data)
        //  if the search didn't return anything, show it
        if (searchList.tracks.items == 0) {
          document.getElementById("name").innerHTML = "No Results"
          document.getElementById("artist").innerHTML = "Please try another search"
        }
        //  Otherwise get on with it
        else {
          //  Grap the first track's Spotify ID
          songID = searchList.tracks.items[0].id
          //  Display the song name and artist on the page
          document.getElementById("name").innerHTML = searchList.tracks.items[0].name
          document.getElementById("artist").innerHTML = searchList.tracks.items[0].artists[0].name
          document.write(songID);

          //  Using that track's ID, grab the Audio Features
          searchAudioFeatures()
          //  Clear the search box
          document.getElementById("searchBox").value = ""
          myInput = ""
        }
      }
    })
  }
  window.alert(valence);
}

function getCurrentTrack() {
  s.getGeneric("https://api.spotify.com/v1/me/player/currently-playing", function(err, data) {
    if (err) console.error(err)
    else {
      searchList = returnData(data)
      if (searchList.item == 0) {
        document.getElementById("name").innerHTML = "No Results"
        document.getElementById("artist").innerHTML = "Please try another search"
      }
      else {
        songID = searchList.item.id
        searchAudioFeatures(songID)
        document.getElementById("name").innerHTML = searchList.item.name
        document.getElementById("artist").innerHTML = searchList.item.artists[0].name
      }
    }
  })
}

let song, analyzer;

function setup() {
  createCanvas(710, 200);
}

function draw() {
  background(255);
  fill(0);
  ellipse(width / 2, height / 2, key*5, key*5);
}

// function preload() {
//   song = loadSound('assets/claude.mp3');
// }

// function setup() {
//   createCanvas(710, 200);
//   song.loop();

//   // create a new Amplitude analyzer
//   analyzer = new p5.Amplitude();

//   // Patch the input to an volume analyzer
//   analyzer.setInput(song);
// }

// function draw() {
//   background(255);

//   // Get the average (root mean square) amplitude
//   let rms = analyzer.getLevel();
//   fill(127);
//   stroke(0);

//   // Draw an ellipse with size based on volume
//   ellipse(width / 2, height / 2, 10 + rms * 200, 10 + rms * 200);
// }



// By Roni Kaufman

// let kMax;
// let step;
// let n = 250; // number of blobs
// let radius = 80; // diameter of the circle
// let inter = 0.05; // difference between the sizes of two blobs
// let maxNoise = 500;

// var sound, amplitude;
// var p = [];

// /*function preload(){
//   sound = loadSound('claude.mp3'); 																											//loading song
// }*/

// let noiseProg = (x) => (x*x); // not from drawing code

// function setup() {
// 	createCanvas(windowWidth, windowHeight);
// 	sound.loop(); //TODO: Replace
//   fft = new p5.FFT();
// 	amplitude = new p5.Amplitude();
// 	noCursor();
// 	background(0);
// }

// function draw() {
// 	background(0, 5);
	
// 	var spectrum = fft.analyze();
// 	colorMode(HSB, 512, 1024, 1024, 100);
// 	p.push(new Particle(color(colourChoose(), 1024, 1024)));
	
// 	var level = amplitude.getLevel();
// 	//mapping the amplitude from 0 - 1, to 0 - 200 as it'll be used for the size of the brush
//   var size = map(level, 0, 1, 0, 200);																															
	
// 	for (var i = 0; i < p.length; i ++) {
// 		//Creating a variable to use so that if there are more particles than the samples(1024)
// 		/* spectrum will not have an arrayindexoutofbounds error */
// 		var freqId = i % 1024;																																					
// 		//Created a variable that will use the frequency as the particle's speed
// 		var spec = map(spectrum[freqId], 0, 255, 0, 0.01);																							
// 		p[i].display();
// 		p[i].speedFactor = spec;
// 		p[i].update();
// 		//If the distance from the position of the particle to it's target destination is less than the size of the amplitude
// 		if (dist(p[i].pos.x, p[i].pos.y, p[i].targetPos.x, p[i].targetPos.y) < size) {
// 				//Destroy the particle 
// 				/*Used for visual and optimisation purposes*/
// 				p.splice(i, 1);																																							
// 		}
//   }
//   //Amplitude Cursor
// 	push();
// 	stroke(colourChoose(), 1024, 1024, 100);
// 	strokeWeight(size);
// 	line(pmouseX, pmouseY, mouseX, mouseY);
// 	pop();
// }

// function colourChoose() {
//   var spectrum = fft.analyze();
//   var specHue = 0;
//   //Go through all frequency samples and add them to get the total value
//   for (var i = 0; i < spectrum.length; i++) {
//     /*Variable created mapping the frequency values from 0-255 to 0-1 so that the maximum value for the total will be 1024*/
//     var m = map(spectrum[i], 0, 255, 0, 1);
//     specHue += m;
//   }
//   return specHue;
// }

// //Particle class
// //col - colour of the particle
// function Particle(col) {
	
// 	//Initialising where the particle will spawn when the particle is created
// 	//Returns a vector that is on one of the four edges of the screen
// 	this.init = function() {																																	
// 		var rand = floor(random(0, 4));
// 		var vec;
// 		if (rand == 0) {
// 			//Top
// 			vec = createVector(random(width), 0);																													
// 		} else if (rand == 1) {
// 			//Bottom
// 			vec = createVector(random(width), height);																										
// 		} else if (rand == 2) {
// 			//Left
// 			vec = createVector(0, random(height));																												
// 		} else {
// 			//Right
// 			vec = createVector(width, random(height));																										
// 		}
// 		return vec;
// 	}
	
// 	/*Variables are called after the init() function as it causes an error for the pos variable*/
// 	this.pos = this.init();
// 	this.targetPos = createVector(mouseX, mouseY);
// 	/*Will be the colour of the frequency when the particle is created */
// 	this.col = col;
// 	this.speedFactor;
	
// 	//Updates the position of the particle as well as the targetPosition
// 	this.update = function() {
// 		//Easing formula - as the particle moves closer to the target, slow down the speed of the particle
// 		this.pos.x += (this.targetPos.x - this.pos.x) * this.speedFactor;
// 		this.pos.y += (this.targetPos.y - this.pos.y) * this.speedFactor;
// 		//targetPos = mouse position
// 		this.targetPos.x = mouseX;
// 		this.targetPos.y = mouseY;
// 	}
	
// 	//Display the particle
// 	this.display = function() {
// 		fill(this.col);
// 		noStroke();
// 		ellipse(this.pos.x, this.pos.y, 10);
//   }
// }

