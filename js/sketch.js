
var songKey = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
var songHue = [120, 80, 60, 45, 30, 0, 330, 285, 260, 235, 190, 160]
//  hsl(key, valence, energy)
//  key = 11 = B = 160
//  valence = 0.818 * 100 = 81.1
//  energy = 0.578 * 100 = 57.8
//  = hsl(160, 81.1, 57.8)


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
var amplitude
var radiusSize
var radiusRatio = 1
var myInput

var beats = [];


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
 window.alert("Please authorise your Spotify account")
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
    
       key = mySong.key                //  Set KEY to coresponding HUE (See top table)
       valence = mySong.valence   //  Set VALENCE to SATURATION (rounded)
       energy = mySong.energy    //  Set ENERGY to BRIGHTNESS (rounded)
       amplitude = mySong.loudness // CHANGED from amplitude to loudness
       radiusSize = mySong.tempo     //  Set TEMPO to RADIUS (rounded)
     }
 })
}

function searchAudioAnalysis() {
  s.getAudioAnalysisForTrack(songID, function(err, data) {
    if(err) console.error(err);
    else {
      beats = mySong.beats;
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
   songID = ""
   key = 0
   valence = 0
   energy = 100
   radiusSize = 0
 }
 //  Otherwise search Spotify for myInput
 else {
   s.searchTracks(myInput, function(err, data) {
     //  If there's an error, throw an error
     if (err) console.error(err)
     //  Otherwise continue as planned
     else {
       searchList = returnData(data)
       //  if the search didn't return anything, show it
       if (searchList.tracks.items == 0) {
         document.getElementById("name").innerHTML = "No Results"
         document.getElementById("artist").innerHTML = "Please try another search"
       }
       //  Otherwise get on with it
       else {
         //  Grab the first track's Spotify ID
         songID = searchList.tracks.items[0].id
         //  Display the song name and artist on the page
         document.getElementById("name").innerHTML = searchList.tracks.items[0].name
         document.getElementById("artist").innerHTML = searchList.tracks.items[0].artists[0].name

         //  Using that track's ID, grab the Audio Features
		 searchAudioFeatures(songID)
		 searchAudioAnalysis();
         //  Clear the search box
         document.getElementById("searchBox").value = ""
         myInput = "test"
       }
     }
   })
 }
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

                              /*******DRAW CODE BELOW*******/


//Global Variables
var sound//, amplitude; //sound - plays the song, amplitude - accesses amplitude values of sound
var p = [];						//array of particles

// function preload(){
// 	//Funny Song. (2018). [Online]. Retrieved from https://www.bensound.com/royalty-free-music/track/funny-song
//   sound = loadSound('bensound-funnysong.mp3'); 																											//loading song
// }

function setup() {
  var canvas = createCanvas(500, 500);
  canvas.parent(mySketch);
	noCursor();
	background(0);
}
function draw() {
  background(0, 5);
  colorMode(HSB)
  var c = color(key, valence, energy, 0.5)
  // strokeWeight(1)
  // stroke(0, 0, 100)
  noStroke()
  fill(c)
  translate(width/2, height/2)
  rotate(45)
  ellipse(0, 0, 20, 10);
  for(var i = 0; i < beats.length; i++) {
	var rand = floor(random(0, 100));
	ellipse(rand, rand, 20, 10);
  }
}
/*function draw() {
	background(255);
	
  var spectrum = beats;
  //var spectrum = [0, 1, 2, 3, 100];
	colorMode(HSB, 512, 1024, 1024, 100);
	p.push(new Particle(color(colourChoose(), 1024, 1024)));
	
	var level = amplitude.getLevel();
	//mapping the amplitude from 0 - 1, to 0 - 200 as it'll be used for the size of the brush
  var size = map(level, 0, 1, 0, 200);																															
	
	for (var i = 0; i < p.length; i ++) {
		//Creating a variable to use so that if there are more particles than the samples(1024)
		// spectrum will not have an arrayindexoutofbounds error
		var freqId = i % 1024;																																					
		//Created a variable that will use the frequency as the particle's speed
		var spec = map(spectrum[freqId], 0, 255, 0, 0.01);																							
		p[i].display();
		p[i].speedFactor = spec;
		p[i].update();
		//If the distance from the position of the particle to it's target destination is less than the size of the amplitude
		if (dist(p[i].pos.x, p[i].pos.y, p[i].targetPos.x, p[i].targetPos.y) < size) {
				//Destroy the particle 
				//Used for visual and optimisation purposes
				p.splice(i, 1);																																							
		}
	}
	
	//Amplitude Cursor
	push();
	stroke(colourChoose(), 1024, 1024, 100);
	strokeWeight(size);
	line(pmouseX, pmouseY, mouseX, mouseY);
  pop();
}*/

/*function draw() {
	background(0, 5);
	
  //var spectrum = fft.analyze();
  var spectrum = [0, 1, 2, 3, 100];
	colorMode(HSB, 512, 1024, 1024, 100);
	p.push(new Particle(color(colourChoose(), 1024, 1024)));
	
	var level = amplitude.getLevel();
	//mapping the amplitude from 0 - 1, to 0 - 200 as it'll be used for the size of the brush
  var size = map(level, 0, 1, 0, 200);																															
	
	for (var i = 0; i < p.length; i ++) {
		//Creating a variable to use so that if there are more particles than the samples(1024)
		// spectrum will not have an arrayindexoutofbounds error
		var freqId = i % 1024;																																					
		//Created a variable that will use the frequency as the particle's speed
		var spec = map(spectrum[freqId], 0, 255, 0, 0.01);																							
		p[i].display();
		p[i].speedFactor = spec;
		p[i].update();
		//If the distance from the position of the particle to it's target destination is less than the size of the amplitude
		if (dist(p[i].pos.x, p[i].pos.y, p[i].targetPos.x, p[i].targetPos.y) < size) {
				//Destroy the particle 
				//Used for visual and optimisation purposes
				p.splice(i, 1);																																							
		}
	}
	
	//Amplitude Cursor
	push();
	stroke(colourChoose(), 1024, 1024, 100);
	strokeWeight(size);
	line(pmouseX, pmouseY, mouseX, mouseY);
	pop();
}*/

//Analyses the frequency of a song to produce the colour of the song at a particular frame ranging from 0 - 1024
function colourChoose() {
    //var spectrum = fft.analyze();
    var spectrum = [0, 1, 2, 3, 100];
		var specHue = 0;
		//Go through all frequency samples and add them to get the total value
		for (var i = 0; i < spectrum.length; i++) {
			/*Variable created mapping the frequency values from 0-255 to 0-1 so that the maximum value for the total will be 1024*/
			var m = map(spectrum[i], 0, 255, 0, 1);
			specHue += m;
		}
		return specHue;
}

//Particle class
//col - colour of the particle
function Particle(col) {
	
	//Initialising where the particle will spawn when the particle is created
	//Returns a vector that is on one of the four edges of the screen
	this.init = function() {																																	
		var rand = floor(random(0, 4));
		var vec;
		if (rand == 0) {
			//Top
			vec = createVector(random(width), 0);																													
		} else if (rand == 1) {
			//Bottom
			vec = createVector(random(width), height);																										
		} else if (rand == 2) {
			//Left
			vec = createVector(0, random(height));																												
		} else {
			//Right
			vec = createVector(width, random(height));																										
		}
		return vec;
	}
	
	/*Variables are called after the init() function as it causes an error for the pos variable*/
	this.pos = this.init();
	this.targetPos = createVector(mouseX, mouseY);
	/*Will be the colour of the frequency when the particle is created */
	this.col = col;
	this.speedFactor;
	
	//Updates the position of the particle as well as the targetPosition
	this.update = function() {
		//Easing formula - as the particle moves closer to the target, slow down the speed of the particle
		this.pos.x += (this.targetPos.x - this.pos.x) * this.speedFactor;
		this.pos.y += (this.targetPos.y - this.pos.y) * this.speedFactor;
		//targetPos = mouse position
		this.targetPos.x = mouseX;
		this.targetPos.y = mouseY;
	}
	
	//Display the particle
	this.display = function() {
		fill(this.col);
		noStroke();
		ellipse(this.pos.x, this.pos.y, 10);
	}
	
}








// /*function setup() {
//  var canvas = createCanvas(400,400)
//  canvas.parent(mySketch)

// }*/

// function setup() {
// 	createCanvas(windowWidth, windowHeight);
// 	//sound.loop();
//   //fft = new p5.FFT();
// 	//amplitude = new p5.Amplitude();
// 	noCursor();
// 	background(0);
// }

// function draw() {
//  background(255)
//  colorMode(HSB)
//  var c = color(key, valence, energy, 0.5)
//  // strokeWeight(1)
//  // stroke(0, 0, 100)
//  noStroke()
//  fill(c)
//  translate(width/2, height/2)
//  rotate(45)
//  rectMode(RADIUS)
//  angleMode(DEGREES)
//  // Create ring
//  // for (var i =0; i < 40; i++) {
//  //   push()
//  //   rotate(i / 6.35 )
//  //   triangle(0, 0, radiusSize, 0, energy, 50)
//  //   pop()
//  // }
//  for (var i = 0; i < energy; i++) {
//    rotate(540 / energy)
//    rect(0,0, 1, radiusSize - i/2)
//  }

//  // randomSeed(Date.now())
//  // var w = random(-15,15)
//  fill(255)
//  ellipse(0, 0, radiusSize*1.1, radiusSize*1.1)
//  fill(c)
//  ellipse(0, 0, radiusSize, radiusSize)

//  var cssCol = 'hsl(' + key + ',' + valence + '%,' + energy + '%)'
//  select("#info").style('color', cssCol)
// }

