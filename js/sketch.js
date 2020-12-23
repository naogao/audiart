
var songKey = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
var songHue = [120, 80, 60, 45, 30, 0, 330, 285, 260, 235, 190, 160]
//  hsl(key, valence, energy)
//  key = 11 = B = 160
//  valence = 0.818 * 100 = 81.1
//  energy = 0.578 * 100 = 57.8
//  = hsl(160, 81.1, 57.8)

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
var radiusSize
var radiusRatio = 1
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
       //  Set some vars to specific values - THE MEAT OF THE PROGRAM
       key = songHue[mySong.key]                //  Set KEY to coresponding HUE (See top table)
       valence = Math.round(mySong.valence * 100)   //  Set VALENCE to SATURATION (rounded)
       energy = Math.round(mySong.energy * 100)    //  Set ENERGY to BRIGHTNESS (rounded)
       radiusSize = Math.round(mySong.tempo)     //  Set TEMPO to RADIUS (rounded)
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
         //  Grap the first track's Spotify ID
         songID = searchList.tracks.items[0].id
         //  Display the song name and artist on the page
         document.getElementById("name").innerHTML = searchList.tracks.items[0].name
         document.getElementById("artist").innerHTML = searchList.tracks.items[0].artists[0].name
         //  Using that track's ID, grab the Audio Features
         searchAudioFeatures()
         //  Clear the search box
         document.getElementById("searchBox").value = ""
         myInput = ""
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

/*function setup() {
 var canvas = createCanvas(400,400)
 canvas.parent(mySketch)

}*/

function setup() {
	createCanvas(windowWidth, windowHeight);
	//sound.loop();
  //fft = new p5.FFT();
	//amplitude = new p5.Amplitude();
	noCursor();
	background(0);
}

function draw() {
 background(0,5);
 colorMode(HSB)
 var c = color(key, valence, energy, 0.5)
 // strokeWeight(1)
 // stroke(0, 0, 100)
 noStroke()
 fill(c)
 translate(width/2, height/2)
 rotate(45)
 rectMode(RADIUS)
 angleMode(DEGREES)
 // Create ring
 // for (var i =0; i < 40; i++) {
 //   push()
 //   rotate(i / 6.35 )
 //   triangle(0, 0, radiusSize, 0, energy, 50)
 //   pop()
 // }
 for (var i = 0; i < energy; i++) {
   rotate(540 / energy)
   rect(0,0, 1, radiusSize - i/2)
 }

 // randomSeed(Date.now())
 // var w = random(-15,15)
 fill(0,5);
 ellipse(0, 0, radiusSize*1.1, radiusSize*1.1)
 fill(c)
 ellipse(0, 0, radiusSize, radiusSize)

 var cssCol = 'hsl(' + key + ',' + valence + '%,' + energy + '%)'
 select("#info").style('color', cssCol)
}

