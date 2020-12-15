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
        //  Set some vars to specific values
        key = mySong.key
        valence = mySong.valence
        energy = mySong.energy
        loudness = mySong.loudness
        tempo = mySong.tempo

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
    energy = 0
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

let song, analyzer;

function preload() {
  song = loadSound('assets/claude.mp3');
}

function setup() {
  createCanvas(710, 200);
  song.loop();

  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();

  // Patch the input to an volume analyzer
  analyzer.setInput(song);
}

function draw() {
  background(255);

  // Get the average (root mean square) amplitude
  let rms = analyzer.getLevel();
  fill(127);
  stroke(0);

  // Draw an ellipse with size based on volume
  ellipse(width / 2, height / 2, 10 + rms * 200, 10 + rms * 200);
}
