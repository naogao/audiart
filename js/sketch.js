var s = new SpotifyWebApi()
var searchList
var mySong
var songID = ""

var key
var valence
var energy
var loudness
var tempo



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
  window.alert("Please authorize your Spotify account")
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
        key = mySong.key                //  Set KEY to coresponding HUE (See top table)
        valence = mySong.valence  //  Set VALENCE to SATURATION (rounded)
        energy = mySong.energy   //  Set ENERGY to BRIGHTNESS (rounded)
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

function setup() {
  var canvas = createCanvas(400,400)
  canvas.parent(mySketch)

}

function draw() {
  background(255)
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

  for (var i = 0; i < valence; i++) {
    rotate(540 / valence)
    rect(0,0, 1, radiusSize - i/2)
  }

  // randomSeed(Date.now())
  // var w = random(-15,15)
  fill(255)
  ellipse(0, 0, radiusSize*1.1, radiusSize*1.1)
  fill(c)
  ellipse(0, 0, radiusSize, radiusSize)

  var cssCol = 'hsl(' + key + ',' + valence + '%,' + energy + '%)'
  select("#info").style('color', cssCol)
}
