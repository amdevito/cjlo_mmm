"use strict";

/*****************
mapping montreal application
 need to-
 create better designed button
 takee out the extra pages
 store soundcloud links in the json file
use google maps api to show gems on a map

 });

You are the main character from the 1984 movie, Labyrinth.

You find out your baby brother, Toby has disappeared and need to search the labyrinth for characters and items in order to find the Goblin King, Jareth and get your baby brother, Toby back!

- enter your name and password, which is then saved locally to be recalled later.
- Search the different scenes using the drop down menus for items and characters to help you on your way.
- you need to find 7 characters and 4 items by the end of the game or else you can't face off against Jareth and are forced to start again.

- at the top of each scene/level, a picture from that part of the movie is shown and you are given the storyline of that scene. Press the start your search button to advance to the searching aspect of that level.

- Be careful where you look because there are traps that will force you to start over!
- hit the advance to next scene button when you are ready to look in a different location.

- press a button to see the map of the labyrinth, but you only see an optical illusion.


- your geolocation is visible, telling you where you are in the labyrinth (actually in real-life) - I decided that having someone walk around their space may be impractical right now, but I still wanted to try and utilize a geolocation library so I have kept that in the application for visual UI purposes mainly.

******************/

//set variables for LOGOS
let cjloLogo;
let canRadioLogo;
let allabLogo;
let cohdsLogo;

let searchPageHead;

let gem;

let name;
let password;
let data;

//set beginning state for the game
let state = "enter";

// declare the latitude and longitude variables to set the geolocation of the user.
let lat;
let long;

//create scene variable that will then have one added at every scene advance
// let scene = ``;

//create variable to store the user's voice declaration of the secret line for the final scene.
// let currentAnswer = ``;

// Store the game profile data and all corresponding ifo for game.
//labyrinthProfile changed to mmmProfile -- Jan7.22
let mmmProfile = {
  name: ``,
  searchLocation: `----------`, //neighbourhood?
  // charactersCollected: 0, //start with no characters collected
  audioGemsCollected: 0, //start with no items collected ---jan 7 change to audioGemsCollected from 'itemscollected'
  // currentScene: 0, //no scene until entering scene 1
  selection: `----------`, ///what type of audio gem
  password: ``, // save the user's password entered in prompt.
  hiddenThingFound: ``, // name of thing hidden in that scene, in that location. Fetches thing and story line element from the location_data.json file.
};

// Variable to store JSON data for generating the scene's found items and storyline
let gameData = undefined;

//button variables - size and location
let buttonXPosition = 250;
let buttonYPosition = 120;
let buttonXSize = 105;
let buttonYSize = 50;

///sign in page
let signInNameInput;
let signInButton;
let registerButton;
let passwordInput;
let signInBoxColor = "white";

//main search page
let saveAndStartButton;
//neightbourhood buttons
let plateauOutremontButton;
let villerayRosemontButton;
let villeMarieButton;
let ndgCDNButton;
let hochelagaMaisonButton;
let sudOuestButton;
let verdunPointeSCButton;
let mysteryHoodButton;

//how would you like to hunt Buttons
let mysteryWalkButton;
let verbalDirectionsButton;
let followTheMapButton;
let surpriseMeButton;

//variables to store the gif with the storyline for the start of each scene
let signInPage = undefined;
// let enterOneInfo = undefined;
// let enterTwoInfo = undefined;
// let enterThreeInfo = undefined;
// let enterFourInfo = undefined;
// let enterFiveInfo = undefined;

//variables to store the image at the top of each scene (accompanied by the info above)
let sceneOneIntroImage = undefined;
let sceneTwoIntroImage = undefined;
let sceneThreeIntroImage = undefined;
let sceneFourIntroImage = undefined;
let sceneFiveIntroImage = undefined;

let loseImage = undefined; //don't need this?
//same as above but for final scene
// let winInfo = undefined;
let winImage = undefined;

//end game win scene variables
let winEndInfo = undefined; //you beat jareth!
let winEndImage = undefined;

//reset variables for collected items
let charactersCollectedData = 0;
let itemsCollectedData = 0;

//actual lat and long of user [ in real world ]
let realLocationData = undefined;

//set search location elements for the different menus in each scene. Empty because they are assigned at each unique scene.
let searchLocation = {
  one: ``,
  two: ``,
  three: ``,
  four: ``,
};
//character and item menu items stay consistant across the game.
let whatType = {
  one: `Character`,
  two: `Item`,
};

//design elements for the search pages - white boxes for all searching info/text
let inputBox = {
  name: {
    r: 255,
    g: 255,
    b: 255,
  },
  collectedCharacters: {
    r: 255,
    g: 255,
    b: 255,
  },
  collectedItems: {
    r: 255,
    g: 255,
    b: 255,
  },
  geolocation: {
    r: 255,
    g: 255,
    b: 255,
  },
  current: {
    r: 255,
    g: 255,
    b: 255,
  },
};

//white outlines on boxes
let inputBoxStroke = {
  name: 255,
  collected: 255,
  geolocation: 255,
  current: 255,
  hunting: 255,
};
//set dropmenus on the left of the pages
let dropMenuLocation = {
  x: 22,
  y: 210,
  xv: 1,
  yv: 1,
};
//set dropmenus on the left of the pages
let dropMenuSelection = {
  x: 22,
  y: 430,
  xv: 1,
  yv: 1,
};

let searchItemFound = undefined; ///title of the item/character found from the JSON file

let labyrinthBanner = undefined; // set app banner image variable

let labyrinthTrickMap = undefined; ///in the labyrinth, nothing is what it seems! - take to a map that is just an optical illusion, playing  on the movie theme that nothing is what it seems... and the labyrinth is NOT FAIR!
///variables for user inputs

let userInputLocation = undefined; //user enters where they want to search in the scene
let userInputSelection = undefined; //is user looking for an item or character?

// buttons variables
// let seeMapButton = undefined; //click to show the labyrinth (just a trick! an optical illusion! - it should say- 'IN THE LABYRINTH, NOTHING IS WHAT IT SEEMS!')

// let nextSceneButton = undefined; //button to leave current search scene and move to next intro scene
let nothingIsAsItSeemsButton = undefined; //leave the trick map scene and return to the search interface/scene
let advanceToScene = undefined; //leave the scene entrance/storyline element and begin the search
let loseRestartButton = undefined; //pops up when user loses and needs to restart the game
let figthJarethButton = undefined; //when user is in position to win (has the right number of characters and items and finds Jareth or Toby and must face Jareth)

function preload() {
  //set up variables with their respective physical elements

  ///LOGOS
  cjloLogo = loadImage(`assets/images/cjloLogoSml.png`); //load CJLO logo
  canRadioLogo = loadImage(`assets/images/canRadioLogo.png`); //load Can Radio logo
  allabLogo = loadImage(`assets/images/allabLogo.png`); //load allab logo
  cohdsLogo = loadImage(`assets/images/cohdsLogo.png`); //load allab logo
  searchPageHead = loadImage(`assets/images/searchPageHead.png`); //load search Page header with logos
  gem = loadImage(`assets/images/gem.png`); //load gem images

  labyrinthBanner = loadImage(`assets/images/labyrinthBanner.png`); //load the banner image into the labyrinthBanner variable - 8bit Labyrinth game logo
  labyrinthTrickMap = loadImage(`assets/images/labyrinthBackground.jpg`); //load the optical illusion labyrinth trick map

  ///typing gifs with each scene's storyline typing out : from http://wigflip.com/minifesto/

  signInPage = loadImage(`assets/images/homePage1.png`); //load home page image
  // enterOneInfo = loadImage(`assets/images/enterOneInfo.gif`); //load the storyline gif for scene one - 'oh no! you've come to your baby brother's room...''
  // enterTwoInfo = loadImage(`assets/images/enterTwoInfo.gif`); //load the storyline gif for scene two - 'Jareth, the goblin King tells you...'
  // enterThreeInfo = loadImage(`assets/images/sceneThreeInfo.gif`); //load the storyline gif for scene three - 'you find a set of doors guarded by a set of dog-like creatures... '
  // enterFourInfo = loadImage(`assets/images/enterFourInfo.gif`); //load the storyline gif for scene four - 'after escaping out of the oubliette, you encounter the Wiseman...'
  // enterFiveInfo = loadImage(`assets/images/enterFiveInfo.gif`); //load the storyline gif for scene five - "you make it to the Castle at the center of the Goblin City..."
  // winInfo = loadImage(`assets/images/winInfo.gif`); ////load the storyline gif for when user faces off against Jareth 'say the line!'

  //images for the storylines - 8bit images from the movie
  sceneOneIntroImage = loadImage(`assets/images/sceneOneIntroImage.jpg`); //Toby's room with empty cirb
  sceneTwoIntroImage = loadImage(`assets/images/sceneTwoIntroImage.jpg`); //scenery view/opening view of the Labyrinth
  sceneThreeIntroImage = loadImage(`assets/images/sceneThreeIntroImage.jpg`); //dog characters with blue and red shield guarding doors
  sceneFourIntroImage = loadImage(`assets/images/sceneFourIntroImage.jpg`); //wiseman with bird on head
  sceneFiveIntroImage = loadImage(`assets/images/sceneFiveIntroImage.jpg`); //house of stairs image with a hidden Toby

  winImage = loadImage(`assets/images/winImage.jpg`); //Jareth reaching out - face Jareth to win. (not win yet!)

  winEndInfo = loadImage(`assets/images/winEndInfo.gif`); /// abstract image with the cystal sphere in air and a hand. you win!
  winEndImage = loadImage(`assets/images/winEndImage.jpg`); // gif with winning info - YOU BEAT JARETH!

  gameData = loadJSON(`assets/data/location_data.json`); //load the JSON file containing the specific found items and characters. Some story elements are included in these text elements.

  //fetch the IRL position of the user via geolocation.js library and set to variable
  realLocationData = getCurrentPosition();
}

function setup() {
  // Create the canvas

  // pop();
  createCanvas(375, 667); //size of iphone 6/7/8 -meant to be a mobile app.
  ////!!!START HERE first make password input box and then position buttons in a better location. then place them into their own functions and use the button and input remover to make them disappear when you go into the application
  //create button, username and password inputs and position
  // push();
  signInNameInput = createInput("NAME", "text");
  signInNameInput.size(238, 30);
  passwordInput = createInput("password", "password");
  passwordInput.size(238, 30);
  registerButton = createButton("register");
  signInButton = createButton("LET'S GO!");
  signInNameInput.position(width / 6, height / 2 + height / 20);
  passwordInput.position(width / 6, height / 2 + height / 8);
  registerButton.position(width / 6, height / 2 + height / 5);
  signInButton.position(width / 2 + width / 8.5, height / 2 + height / 5);
  // pop();
  //check if geolocation is available
  if (geoCheck() == true) {
    //geolocation is available -
  } else {
    //error getting geolocation
  }

  //voice recognition for line to beat Jareth in winScene.
  //activate the annyang voice recognition library

  //geolocation function to report a new location if the user changes location from the original position.
  watchPosition(positionChanged);

  //Below is to help track geolocation elements through testing.
  // console.log(realLocationData.latitude);
  // console.log(realLocationData.longitude);
  // console.log(realLocationData.accuracy);
  // console.log(realLocationData.altitude);
  // console.log(realLocationData.altitudeAccuracy);
  // console.log(realLocationData.heading);
  // console.log(realLocationData.speed);

  ///Game profile saving and setting to the mmmProfile variable.
  // Check of there is a saved profile and try to load the data
}

//the first opening welcome scene when you launch the application
function enterIntro() {
  push();
  imageMode(CENTER);
  image(signInPage, width / 2 + 7, 200);

  push();
  // image(labyrinthBanner, 0, 0);
  textFont(`Verdana`);
  textSize(8);
  textAlign(CENTER, CENTER);
  fill(0);
  text(
    `PRODUCED WITH ASSISTANCE FROM THE COMMUNITY RADIO FUND OF CANADA`,
    width / 2,
    height - height / 35
  );
  //position logos
  imageMode(CENTER);
  image(cjloLogo, width / 2 + width / 16, height - height / 10);
  // width / 2 + width / 33, height - height / 11
  image(canRadioLogo, width / 2 + width / 3, height - height / 10);
  image(allabLogo, width / 4, height - height / 13);
  image(cohdsLogo, width / 5, height - height / 8);

  pop();
  // introStoryBoxes();
  ////change let name = prompt ... to input.userName? and same with password
  data = JSON.parse(localStorage.getItem(`labyrinth-profile-data`));
  //CHANGE BELOW TO HAPPEN IF SOMEONE SAYS SIGN IN BUT NO INFO IS FOUND, THEN POP UP WITH A NOTICE TO CREATE A NEW profile
  //FOR NOW, HAVE THIS HAPPEN WHEN SOME ONE REGISTERS

  name = signInNameInput.value();
  password = passwordInput.value();
  ///IF DATA = NULL AND REGISTER BUTTON IS PRESSED, MAKE NAME AND PASSWORD INPUT PROFILE INFO
  registerButton.mousePressed(generateLabyrinthProfile);
  signInButton.mousePressed(checkMMMProfile);
  //
  // if (data !== null) {
  //   let name = signInNameInput.value(); //enter user name or ask to create new one
  //   // let name = prompt(`What is your user name? Or type "create new"`);
  //   if (name === `create new`) {
  //     generateLabyrinthProfile(); //create new profile
  //   } else {
  //     let password = passwordInput.value();
  //     if (password === data.password && name === data.name) {
  //       mmmProfile.name = data.name;
  //       mmmProfile.searchLocation = data.searchLocation;
  //
  //       mmmProfile.currentScene = data.currentScene;
  //       mmmProfile.audioGemsCollected = data.audioGemsCollected;
  //       mmmProfile.selection = data.selection;
  //     } else if (
  //       (password !== data.password && name !== data.name) ||
  //       (name === data.name && password !== data.password) ||
  //       (name !== data.name && password === `create new`)
  //     ) {
  //       //if password and usernames dont match one on file, generate new profile.
  //       generateLabyrinthProfile();
  //     }
  //   }
  // } else {
  //   generateLabyrinthProfile();
  // }
}

function checkMMMProfile() {}
// function
//Create
// Assigns across the profile properties from the data to the current profile
//CALL BELOW IF THE REGISTER BUTTON IS PRESSED

function generateLabyrinthProfile() {
  mmmProfile.name = signInNameInput.value(); //prompt answer saved into the variable mmmProfile.name
  mmmProfile.password = passwordInput.value(); //prompt answer saved into the variable mmmProfile.password

  localStorage.setItem(
    //store info in localStorage
    `labyrinth-profile-data`,
    JSON.stringify(mmmProfile)
  );

  ///!!!!!****
  ///BELOW - REGISTER IS PRESSED, SO MAIN PROFILE PAGE APPEARS
  state = `scene_One`;
  console.log(state);

  //localStorage is the object that knows how to save things
  //setItem is the method that does the saving
  //'labyrinth-profile-data' is the key
  //stringify the thing you want to save
}

function draw() {
  background(220, 219, 217);

  //different states for the different scenes/levels and win or lose screens
  //enter_scene_# - are the states/scenes that tell you the story about that scene/ part of the story
  if (state === `enter`) {
    enterIntro(); //welcome and how to play the game
  } else if (state === `enter_scene_One`) {
    enterOne();
  } else if (state === `scene_One`) {
    mainProfilePage();
  } else if (state === `enter_scene_Two`) {
    enterTwo();
  } else if (state === `scene_Two`) {
    mainProfilePage();
  } else if (state === `enter_scene_Three`) {
    enterThree();
  } else if (state === `scene_Three`) {
    mainProfilePage();
  } else if (state === `enter_scene_Four`) {
    enterFour();
  } else if (state === `scene_Four`) {
    mainProfilePage();
  } else if (state === `enter_scene_Five`) {
    enterFive();
  } else if (state === `scene_Five`) {
    mainProfilePage();
    // nextSceneButton.remove();
  } else if (state === `win`) {
    win();
  } else if (state === `win end`) {
    winEnd();
  } else if (
    state === `map` ||
    state === `map1` ||
    state === `map2` ||
    state === `map3` ||
    state === `map4` ||
    state === `map5`
  ) {
    trickMapImage();
  }
}

//when the user selects where to search in that scene, set it to the variable mmmProfile.searchLocation
function sendSearchLocation() {
  mmmProfile.searchLocation = userInputLocation.value();
}

///in winScene, when up against Jareth at final scene in game - say line, check if right line:
function guessLine(line) {
  console.log(line);
  if (line.toLowerCase() === `you have no power over me`) {
    state = `win end`;
  } else {
    alert(
      `That is incorrect. Try again or refresh to start the game over to find the line somewhere in the game.`
    );
  }
}

///FETCHING JSON INFO - after sendSelection is called when the user uses the dropMenu to select whether they are choosing to search for an item or a character.

function sendSelection() {
  //force items and characters collcted to test the final scenes:
  //
  // mmmProfile.audioGemsCollected = 4; //take away after testing done

  // testing console.logs to track exacly what info is being found throughout the code.
  //
  // console.log(mmmProfile.audioGemsCollected, `items`);
  // console.log(gameData);
  // console.log(mmmProfile.searchLocation);
  // console.log(mmmProfile.selection);

  mmmProfile.selection = userInputSelection.value().toLowerCase();

  ///logic / if else statements to fetch specific JSON data from location_data.json file.
  ///from the JSON variables - ex.gameData.location_finds[0][`under bed`][1]: first [0] refers to the scene, ['location in the scene'], [0] - character, [1] - item
  //LEVEL ONE
  if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `under bed`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[0][`under bed`][0];
    // mmmProfile.charactersCollected++; //character found, add a character point
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `under bed`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[0][`under bed`][1]; ///nothing is there, so no point added
    ///// diff location in that same scene
  } else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `behind curtain`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[0][`behind curtain`][0];
    // mmmProfile.charactersCollected++; //character found add point
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `behind curtain`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[0][`behind curtain`][1]; //nothing there, no point added
    ///// diff location in that same scene
  } else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `in bookshelf`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[0][`in bookshelf`][0]; //nothing there, no point added
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `in bookshelf`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[0][`in bookshelf`][1];
    mmmProfile.audioGemsCollected++; //item found, add point
    ///// diff location in that same scene
  } else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `in closet`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[0][`in closet`][0]; //nothing, no point
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `in closet`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[0][`in closet`][1];
    mmmProfile.audioGemsCollected++; //found item add point
  }
  ///sceneTwo
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `under rock`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[1][`under rock`][0];
    // mmmProfile.charactersCollected++; //characters found and add point
    //
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `under rock`
  ) {
    //
    mmmProfile.hiddenThingFound = gameData.location_finds[1][`under rock`][1]; //nothing there, no point
    /// different search location in the scene
  } else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `behind tree`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[1][`behind tree`][0];
    // mmmProfile.charactersCollected++; //character found, add point.
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `behind tree`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[1][`behind tree`][1]; //no item there, no point.
    //different search location in the scene.
  } else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `check wall`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[1][`check wall`][0];
    // mmmProfile.charactersCollected++; //found character in that place, add point.
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `check wall`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[1][`check wall`][1]; // no item there, no point
    ///different search location in that scene
  } else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `check ground`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[1][`check ground`][0]; //no character there, no point
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `check ground`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[1][`check ground`][1];
    mmmProfile.audioGemsCollected++; //item found on ground, add point.
  }
  ///sceneThree
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `check left corridor`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[2][`check left corridor`][0];
    // mmmProfile.charactersCollected++; //character found on the ground, add point.
    //
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `check left corridor`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[2][`check left corridor`][1]; //item is not found there, no point.
  } ///new location in that scene
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `check door one`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[2][`check door one`][0];
    youLoseButton(); // door one is certain death! - call the you lose button -first GAME OVER trap - RESTART and try again!
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `check door one`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[2][`check door one`][1];
    youLoseButton(); // door one is certain death! - call the you lose button -first GAME OVER trap - RESTART and try again!
  } ///new location in that scene
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `check right corridor`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[2][`check right corridor`][0]; /// nothing is there, no point
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `check right corridor`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[2][`check right corridor`][1]; //no item is there, no point.
  } ///new location in that scene
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `check door two`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[2][`check door two`][0];
    mmmProfile.audioGemsCollected++; /// character found, add point.
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `check door two`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[2][`check door two`][1]; ///no item there, no point found.
  }
  ///sceneFour
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `look around tree`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[3][`look around tree`][0];
    // mmmProfile.charactersCollected++; //character found, add point.
    //
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `look around tree`
  ) {
    //
    mmmProfile.hiddenThingFound =
      gameData.location_finds[3][`look around tree`][1];
  } /// new location in scene
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `look in bush`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[3][`look in bush`][0];
    // mmmProfile.charactersCollected++; ///character is found and point is added.
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `look in bush`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[3][`look in bush`][1]; ///no item is found there, no point added.
  } ///new location in scene
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `look in dark tunnel`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[3][`look in dark tunnel`][0]; //no character is found, no point
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `look in dark tunnel`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[3][`look in dark tunnel`][1];
    //fall into the bog of eternal stench! Game over button - restart game
    youLoseButton();
  }
  //new location in scene
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `climb tree`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[3][`climb tree`][0]; //character not found, no points
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `climb tree`
  ) {
    mmmProfile.hiddenThingFound = gameData.location_finds[3][`climb tree`][1];
    youLoseButton();
    //poison peach sends you back to the start of the game.
  }
  ///sceneFive
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `climb up stairs`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[4][`climb up stairs`][0];
    youLoseButton();
    /// fall in love with Jareth (let's not kid ourselves here, it is DAVID BOWIE after allllllll <3) - game over and restart.
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `climb up stairs`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[4][`climb up stairs`][1]; //nothing found there, keep searching.
  }
  ///new search location in scene
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `go down stairs`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[4][`go down stairs`][0]; //no charater there, keep searching.
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `go down stairs`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[4][`go down stairs`][1];
    youLoseButton();
    //run out of time, game over.
  }
  ///search new location in scene
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `go through doorway` &&
    // mmmProfile.charactersCollected >= 7 && //if user has 7 or more characters collected, and 4 or more items collected, then they can face Jareth to win the game.
    mmmProfile.audioGemsCollected >= 4
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[4][`go through doorway`][0];
    faceJarethButton(); ///go to the winScene where user has to say the line, 'you have no power over me' to win the game, or they must restart if they can't remember that line.
  } else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `go through doorway` &&
    // mmmProfile.charactersCollected < 7 && ///if user doesn't collect enough items and characters, user must restart the game and try again.
    mmmProfile.audioGemsCollected < 4
  ) {
    youLoseButton(); ///game over, try again
    mmmProfile.hiddenThingFound = `You didn't collect enough characters\n     or items. Start over and try again.`;
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `go through doorway`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[4][`go through doorway`][1]; //nothing there, keep searching
  }
  //search different location in scene.
  else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `jump off ledge` &&
    // mmmProfile.charactersCollected >= 7 && ///if user has collected 7 or more items and characters, face Jareth in the winScene.
    mmmProfile.audioGemsCollected >= 4
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[4][`jump off ledge`][0];
    faceJarethButton();
    //chance to win by facing Jareth
  } else if (
    mmmProfile.selection === `character` &&
    mmmProfile.searchLocation === `jump off ledge` &&
    // mmmProfile.charactersCollected < 7 && //if user has collected less than 5 items and characters, lose
    mmmProfile.audioGemsCollected < 4
  ) {
    youLoseButton();
    mmmProfile.hiddenThingFound = `You didn't collect enough characters\n     or items. Start over and try again.`;
  } else if (
    mmmProfile.selection === `item` &&
    mmmProfile.searchLocation === `jump off ledge`
  ) {
    mmmProfile.hiddenThingFound =
      gameData.location_finds[4][`jump off ledge`][1];
    youLoseButton();

    // fall to death, lose.
  }
}

//sendMapButton function keeps track of what scene user is in so they return to the right scene after viewing the labyrinth map, as well as displaying the 'trickMap' and removing all the search buttons and menus from the regular search scene UI
function sendMapButton() {
  if (state === `scene_One`) {
    state = `map1`;
  } else if (state === `scene_Two`) {
    state = `map2`;
  } else if (state === `scene_Three`) {
    state = `map3`;
  } else if (state === `scene_Four`) {
    state = `map4`;
  } else if (state === `scene_Five`) {
    state = `map5`;
  }

  buttonRemover();
  trickMap();
}

//take away the buttons and menus from canvas
////MAKE THIS FOR THE ENTER SCREEN
function buttonRemover() {
  signInNameInput.remove();
  passwordInput.remove();
  registerButton.remove();
  signInButton.remove();
  // userInputLocation.remove();
  // userInputSelection.remove();
  // nextSceneButton.remove();
  // seeMapButton.remove();
}

//set and create the buttons used throughout the game
function buttonMaker() {
  // nextSceneButton = createButton("Done Searching, Go to Next Scene");
  // seeMapButton = createButton("See the Labyrinth");
}

///remove all buttons and menus used for searching and place button that restarts the game.
function youLoseButton() {
  // nextSceneButton.remove();
  buttonRemover();
  loseRestartButton = createButton("You lose. Try again?");
  loseRestartButton.position(30, 580); //located at bottom center
  loseRestartButton.mousePressed(returnToStart); //call the function (returnToStart) to activate the return to start action, when the youLoseButton is pressed
  loseRestartButton.size(315, 40); // fill the white input box, width-wise
}

function returnToStart() {
  state = `enter_scene_One`; //change state back to enter_scene_one
  loseRestartButton.remove();
  buttonRemover(); //take out all search menus and buttons
  introAdvanceButton();
  mmmProfile.hiddenThingFound = ``; //clear item or characters found in last part
  mmmProfile.audioGemsCollected = 0; //reset items collected to zero to restart game
  // mmmProfile.charactersCollected = 0; //reset characters collected to zero to restart game
}

//create button to pop up when user has found jareth or toby and they have the right number of characters and items
function faceJarethButton() {
  buttonRemover();
  figthJarethButton = createButton("FACE JARETH TO WIN");
  figthJarethButton.position(30, 580); //located at bottom center
  figthJarethButton.mousePressed(returnFaceJareth); //call a function to create the scene where the user can face off against Jareth to win game.
  figthJarethButton.size(315, 40);
}

//this function doesnt create the scene itself, but it changes the state, which then calls the winScene, where the user faces Jareth
function returnFaceJareth() {
  state = `win`;
}

/// button to move past the intro storyline scene
function introAdvanceButton() {
  advanceToScene = createButton("Start your search");
  advanceToScene.position(150, 550); //located at bottom center
  advanceToScene.mousePressed(returnAdvanceButton); //call a function to change state and the scene/canvas
  advanceToScene.size(105, 50);
}

/// button to start search
function startSearchButton() {
  saveAndStartButton = createButton("SAVE AND START!");
  saveAndStartButton.position(width / 2 - 75, 600); //located at bottom center
  // saveAndStartButton.mousePressed(startSearch); //call a function (to be created) that begins the search
  saveAndStartButton.size(150, 30);
}

function mainSearchHeader() {
  push();
  imageMode(CENTER);
  image(searchPageHead, width / 2, 85);
  image(gem, width / 2 + 20, 150);
  push();
}

///neightbouthood Buttons for search screen
function neighbourhoodSearchButtons() {
  //plateau-outremont
  plateauOutremontButton = createButton("Plateau / Outremont");
  plateauOutremontButton.position(23, 190);
  // plateauOutremontButton.mousePressed(startSearchOutremont); //call a function (to be created) that begins the search
  plateauOutremontButton.size(150, 40);

  //villeray-rosemont
  villerayRosemontButton = createButton("Villeray / Rosemont");
  villerayRosemontButton.position(200, 190);
  // villerayRosemontButton.mousePressed(startSearchOutremont); //call a function (to be created) that begins the search
  villerayRosemontButton.size(150, 40);

  //ville-marie
  villeMarieButton = createButton("Ville Marie");
  villeMarieButton.position(23, 240);
  // villeMarieButton.mousePressed(startSearchOutremont); //call a function (to be created) that begins the search
  villeMarieButton.size(150, 40);

  //ndg-cdn
  ndgCDNButton = createButton("NDG / CDN");
  ndgCDNButton.position(200, 240);
  // ndgCDNButton.mousePressed(startSearchOutremont); //call a function (to be created) that begins the search
  ndgCDNButton.size(150, 40);

  //hochelaga Maisoneuve
  hochelagaMaisonButton = createButton("Hochelaga Maisonneuve");
  hochelagaMaisonButton.position(23, 290);
  // hochelagaMaisonButton.mousePressed(startSearchOutremont); //call a function (to be created) that begins the search
  hochelagaMaisonButton.size(150, 40);

  //sudOuest
  sudOuestButton = createButton("Sud Ouest");
  sudOuestButton.position(200, 290);
  // sudOuestButton.mousePressed(startSearchSudOuest); //call a function (to be created) that begins the search
  sudOuestButton.size(150, 40);

  //verdun PointeSC
  verdunPointeSCButton = createButton("Verdun / Point SC");
  verdunPointeSCButton.position(23, 340);
  // verdunPointeSCButton.mousePressed(startSearchverdunPointeSC); //call a function (to be created) that begins the search
  verdunPointeSCButton.size(150, 40);

  //mysteryHood search (random?)
  mysteryHoodButton = createButton("Mystery Hood");
  mysteryHoodButton.position(200, 340);
  // mysteryHoodButton.mousePressed(startSearchOutremont); //call a function (to be created) that begins the search
  mysteryHoodButton.size(150, 40);
}

function howToHuntButtons() {
  //mystery walk
  mysteryWalkButton = createButton("mystery walk");
  mysteryWalkButton.position(23, 420);
  // plateauOutremontButton.mousePressed(startSearchOutremont); //call a function (to be created) that begins the search
  mysteryWalkButton.size(75, 40);

  //verbal directions
  verbalDirectionsButton = createButton("verbal directions");
  verbalDirectionsButton.position(108, 420);
  // villerayRosemontButton.mousePressed(startSearchOutremont); //call a function (to be created) that begins the search
  verbalDirectionsButton.size(75, 40);

  //follow the map button
  followTheMapButton = createButton("follow the map");
  followTheMapButton.position(193, 420);
  // villeMarieButton.mousePressed(startSearchOutremont); //call a function (to be created) that begins the search
  followTheMapButton.size(75, 40);

  //surprise me button
  surpriseMeButton = createButton("surprise me!");
  surpriseMeButton.position(277, 420);
  // ndgCDNButton.mousePressed(startSearchOutremont); //call a function (to be created) that begins the search
  surpriseMeButton.size(75, 40);
}
//change scene from 'enter_scene_#' to 'scene_#'
function returnAdvanceButton() {
  if (state === `enter_scene_One`) {
    state = `scene_One`;
    sceneOneMenus(); //assign the unique search locations in scene one to the empty drop menus
    dropMenus(); //make the empty dropMenus
    buttonMaker(); //make the buttons
  } else if (state === `enter_scene_Two`) {
    state = `scene_Two`;
    sceneTwoMenus(); //assign the unique search locations in scene two to the empty drop menus
    dropMenus(); //make the empty dropMenus
    buttonMaker(); //make the buttons
  } else if (state === `enter_scene_Three`) {
    state = `scene_Three`;
    sceneThreeMenus(); //assign the unique search locations in scene three to the empty drop menus
    dropMenus(); //make the empty dropMenus
    buttonMaker(); //make the buttons
  } else if (state === `enter_scene_Four`) {
    state = `scene_Four`;
    sceneFourMenus(); //assign the unique search locations in scene four to the empty drop menus
    dropMenus(); //make the empty dropMenus
    buttonMaker(); //make the buttons
  } else if (state === `enter_scene_Five`) {
    state = `scene_Five`;
    sceneFiveMenus(); //assign the unique search locations in scene five to the empty drop menus
    dropMenus(); //make the empty dropMenus
    buttonMaker(); //make the buttons
  }
}

//set the labyrinth optical illusion map, and display
function trickMapImage() {
  push();
  imageMode(CENTER); //draw and position from the center of image
  image(labyrinthTrickMap, width / 2 + 7, height / 2 + 35);
  pop();
}

///create the button to return to the main profile search UI page.
function trickMap() {
  nothingIsAsItSeemsButton = createButton("Nothing is as it seems");
  nothingIsAsItSeemsButton.position(250, 120); //located at upper right corner
  nothingIsAsItSeemsButton.mousePressed(returnMapButton); //call the function when button is pressed
  nothingIsAsItSeemsButton.size(105, 50);
}

//go back to the search scenes after being in the trickMAP (optical illusion labyrinth map)
function returnMapButton() {
  if (state === `map1`) {
    state = `scene_One`;
    dropMenus();
    buttonMaker();
    nothingIsAsItSeemsButton.remove();
  } else if (state === `map2`) {
    state = `scene_Two`;
    dropMenus();
    buttonMaker();
    nothingIsAsItSeemsButton.remove();
  } else if (state === `map3`) {
    state = `scene_Three`;
    dropMenus();
    buttonMaker();
    nothingIsAsItSeemsButton.remove();
  } else if (state === `map4`) {
    state = ` scene_Four`;
    dropMenus();
    buttonMaker();
    nothingIsAsItSeemsButton.remove();
  } else if (state === `map5`) {
    state = `scene_Five`;
    dropMenus();
    buttonMaker();
    nothingIsAsItSeemsButton.remove();
  }
}
//boxes and box dropshadows for each story entrance scene
function introStoryBoxes() {
  push();
  // fill(200, 100, 0, 75);
  // tint(75);
  // stroke(0, 61, 61);

  // image(labyrinthBanner, 0, 0);
  // strokeWeight(3);
  // rectMode(CENTER);
  // rect(width / 2 - 7, height / 2 + 55, 330, 480);
  // strokeWeight(3);
  // stroke(250, 233, 0);

  // fill(255, 255, 255);

  // rect(width / 2 + 7, height / 2 + 35, 330, 480);
  pop();
}

///entrance scene with image from movie and a storyline talking about the
//situation surround the current enviroment that the user will be searching in.
function enterOne() {
  introStoryBoxes();

  push();
  imageMode(CENTER);
  // image(enterOneInfo, width / 2 + 7, height / 4);
  image(sceneOneIntroImage, width / 2 + 7, height / 4 + 250);
  pop();
}
///entrance scene with image from movie and a storyline talking about the situation surround the current enviroment that the user will be searching in.
function enterTwo() {
  introStoryBoxes();
  buttonRemover();
  push();
  imageMode(CENTER);
  // image(enterTwoInfo, width / 2 + 7, height / 4 + 15);
  image(sceneTwoIntroImage, width / 2 + 7, height / 4 + 250);
  pop();
}

///entrance scene with image from movie and a storyline talking about the situation surround the current enviroment that the user will be searching in.
function enterThree() {
  introStoryBoxes();
  buttonRemover();
  push();
  imageMode(CENTER);
  // image(enterThreeInfo, width / 2 + 7, height / 4 + 35);
  image(sceneThreeIntroImage, width / 2 + 7, height / 4 + 225);
  pop();
}

///entrance scene with image from movie and a storyline talking about the situation surround the current enviroment that the user will be searching in.
function enterFour() {
  introStoryBoxes();
  buttonRemover();
  push();
  imageMode(CENTER);
  // image(enterFourInfo, width / 2 + 7, height / 4 + 15);
  image(sceneFourIntroImage, width / 2 + 7, height / 4 + 250);
  pop();
}

///entrance scene with image from movie and a storyline talking about the situation surround the current enviroment that the user will be searching in.
function enterFive() {
  introStoryBoxes();
  buttonRemover();
  push();
  imageMode(CENTER);
  // image(enterFiveInfo, width / 2 + 7, height / 4 + 15);
  image(sceneFiveIntroImage, width / 2 + 7, height / 4 + 220);
  pop();
}

//win function gets called only if the user has 4 items and 7 characters collected...(see fetch JSON win to see specifics)
function win() {
  figthJarethButton.remove();
  introStoryBoxes();
  buttonRemover();
  push();
  imageMode(CENTER);
  // image(winInfo, width / 2 + 7, height / 4 + 15); //'say the line!''
  image(winImage, width / 2 + 7, height / 4 + 220); ///Jareth in the final scene reaching out
  pop();
}

//when the user says the right line 'you have no power over me' - this gets called.
function winEnd() {
  introStoryBoxes();
  buttonRemover();
  push();
  imageMode(CENTER);
  image(winEndInfo, width / 2 + 7, height / 4 + 15); ///final screen 'You WIN, You Beat the Goblin king' text repeated.
  image(winEndInfo, width / 2 + 7, height / 4 + 35); ///final screen 'You WIN, You Beat the Goblin king' text repeated.
  image(winEndInfo, width / 2 + 7, height / 4 + 55); ///final screen 'You WIN, You Beat the Goblin king' text repeated.
  image(winEndInfo, width / 2 + 7, height / 4 + 75); ///final screen 'You WIN, You Beat the Goblin king' text repeated.
  image(winEndImage, width / 2 + 7, height / 4 + 220); ///you win Celebration image of all the characters from the Labyrinth.

  pop();
}

//function with the main design and updating info elements for the search pages in each scene.

function mainProfilePage() {
  //set button on canvas and direct the button press to a function
  // seeMapButton.position(250, 120); //located at upper right corner
  // seeMapButton.mousePressed(sendMapButton); //call a function when button is pressed
  // seeMapButton.size(105, 50);

  // advanceToScene.remove();
  mainSearchHeader();
  buttonRemover();
  inputBoxes(); //place the white boxes on canvas to hold the data

  //profle text with changing data in the template literals
  //user's name, the number of characters and items collected over the span of the game
  //what scene the user is in and what specific item or character was found (activated after the drop menu with character or item is switched)

  let profileName = `
HI ${mmmProfile.name}!
`;

  //display the text (using the variable above and template literates) along with the design, 8bit Labyrinth Go game banner at the top
  push();
  // image(labyrinthBanner, 0, 0);
  textFont(`Tahoma`);
  textSize(12);
  textAlign(LEFT, TOP);
  fill(0);
  text(profileName, 223, 115);

  pop();

  let profileWhere = `
WHERE DO YOU WANT TO GO TODAY?
  `;
  //display the text (using the variable above and template literates) along with the design, 8bit Labyrinth Go game banner at the top
  push();
  // image(labyrinthBanner, 0, 0);
  textFont(`Tahoma`);
  textSize(12);
  textAlign(LEFT, TOP);
  fill(0);
  text(profileWhere, 22, 155);

  pop();

  let profileHow = `
HOW WOULD YOU LIKE TO HUNT FOR GEMS:
`;

  //display the text (using the variable above and template literates) along with the design, 8bit Labyrinth Go game banner at the top
  push();
  // image(labyrinthBanner, 0, 0);
  textFont(`Tahoma`);
  textSize(12);
  textAlign(LEFT, TOP);
  fill(0);
  text(profileHow, 22, 380);

  pop();

  let profileWhat = `
WHAT KIND OF GEM ARE YOU HUNTING:
`;
  //display the text (using the variable above and template literates) along with the design, 8bit Labyrinth Go game banner at the top
  push();
  // image(labyrinthBanner, 0, 0);
  textFont(`Tahoma`);
  textSize(12);
  textAlign(LEFT, TOP);
  fill(0);
  text(profileWhat, 22, 465);

  pop();

  let profileCurrentHunt = `
 MY CURRENT GEM HUNT:
`;
  //display the text (using the variable above and template literates) along with the design, 8bit Labyrinth Go game banner at the top
  push();
  // image(labyrinthBanner, 0, 0);
  textFont(`Tahoma`);
  textSize(12);
  textAlign(LEFT, TOP);
  fill(0);
  text(profileCurrentHunt, 20, 512);

  pop();

  //display the user's location in the real-world
  let geolocationProfile = `


 Lat: ${mmmProfile.currentLocationLat}           Long: ${mmmProfile.currentLocationLong}
    `;

  push();
  textFont(`Tahoma`);
  textSize(12);
  textAlign(LEFT, TOP);
  fill(170, 169, 167);
  text(geolocationProfile, 22, 600);
  pop();

  // push();
  // nextSceneButton.position(width - 135, height - 90); //located at upper right corner
  // nextSceneButton.mousePressed(goToNextScene); //call the function when mouse is pressed
  // nextSceneButton.size(105, 50);
  // pop();
}

//call this function to change to the next scene's intro and storyline info
function goToNextScene() {
  if (state === `scene_One`) {
    state = `enter_scene_Two`;
    introAdvanceButton();
    mmmProfile.hiddenThingFound = ``; //clear item or character found in the previous section
  } else if (state === `scene_Two`) {
    state = `enter_scene_Three`;
    introAdvanceButton();
    mmmProfile.hiddenThingFound = ``; //clear item or character found in the previous section
  } else if (state === `scene_Three`) {
    state = `enter_scene_Four`;
    introAdvanceButton();
    mmmProfile.hiddenThingFound = ``; //clear item or character found in the previous section
  } else if (state === `scene_Four`) {
    state = `enter_scene_Five`;
    introAdvanceButton();
    mmmProfile.hiddenThingFound = ``; //clear item or character found in the previous section
  }
}

function sceneOneMenus() {
  /// user's bedroom - find goblins, snake, goblin king, clock
  //user chooses their search location in that scene

  // mmmProfile.currentScene = 1; //set the scene to one
  //assign locations specific to this scene
  searchLocation.one = `under bed`; //find goblins
  searchLocation.two = `behind curtain`; //goblin king
  searchLocation.three = `in bookshelf`; //snake
  searchLocation.four = `in closet`; //clock
}

function sceneTwoMenus() {
  //at the entrance of labyrinth - find hoggle [behind tree], faeries[under rock], bracelet [on ground], 'hello' caterpillar[at wall]
  //user chooses their search location in that scene
  // mmmProfile.currentScene++; //add one to the scene #
  //assign locations specific to this scene
  searchLocation.one = `check wall`; //caterpillar
  searchLocation.two = `check ground`; //bracelet
  searchLocation.three = `behind tree`; //hoggle
  searchLocation.four = `under rock`; //faeriers
}

function sceneThreeMenus() {
  ///2 characters guarding doors that lie. 'certain death!'  - collect small characters from the tiles, and the helping hands -- 2 death options hidden in door one.
  //user chooses their search location in that scene

  // mmmProfile.currentScene++; //add one to the scene #
  //assign locations specific to this scene
  searchLocation.one = `check left corridor`; //you catch small characters pop up from the tiles in the ground!
  searchLocation.two = `check door one`; // Certain death! Game over.
  searchLocation.three = `check right corridor`; //nothing.
  searchLocation.four = `check door two`; // you fall down a dark hole, but luckily the helping hands guide you into the oubliette and Hoggle helps you escape!
}

function sceneFourMenus() {
  // dark forest - collect the orange dancing bouncing head characters,ludo and try not to fall into the bog of eternal stench, and avoid the posion peach which sends you back to the start.
  //user chooses their search location in that scene

  // mmmProfile.currentScene++; //add one to the scene #
  //assign locations specific to this scene
  searchLocation.one = `look around tree`; //ludo
  searchLocation.two = `look in bush`; ///dancing characters
  searchLocation.three = `look in dark tunnel`; /// get thrown into the bog of eternal stench and game over
  searchLocation.four = `climb tree`; //posion peach game over.
}

function sceneFiveMenus() {
  //final labyrinth, house of stairs.
  //user chooses their search location in that scene

  // mmmProfile.currentScene++; //add one to the scene #
  //assign locations specific to this scene
  searchLocation.one = `climb up stairs`; //fall in love with Jareth game over
  searchLocation.two = `go down stairs`; //run out of time game over
  searchLocation.three = `go through doorway`; //meet Jareth and try to beat him (must say out loud the correct passage from the Labyrinth book (found in scene One)'you have no power over me') possible:  [you win]
  searchLocation.four = `jump off ledge`; //get Toby and try to beat Jareth (must say out loud the correct passage from the Labyrinth book (found in scene One)'you have no power over me') possible:  [you win]
}

function dropMenus() {
  //drop down menus
  //user choose their specific search location in that scene
  userInputLocation = createSelect(); //create dropdown menu with specific p5.js function
  userInputLocation.position(dropMenuLocation.x, dropMenuLocation.y); ///where on app
  userInputLocation.option("Location in Scene.");
  userInputLocation.option(searchLocation.one);
  userInputLocation.option(searchLocation.two);
  userInputLocation.option(searchLocation.three);
  userInputLocation.option(searchLocation.four);
  userInputLocation.changed(sendSearchLocation); // create action after the input drop down is changed - send to / call the sendSearchLocation function.

  //choose what to search> Character or item
  userInputSelection = createSelect();
  userInputSelection.position(dropMenuSelection.x, dropMenuSelection.y);
  userInputSelection.option("Character? or Item?");
  userInputSelection.option(whatType.one);
  userInputSelection.option(whatType.two);
  userInputSelection.changed(sendSelection); // create action after the input drop down is changed - send to / call the sendSelection function.
  //
}

function inputBoxes() {
  // boxes behind data entered information.
  //name box
  // push();
  // fill(inputBox.name.r, inputBox.name.g, inputBox.name.b);
  // stroke(220, 219, 217); //CHANGES ON HOVER
  // rect(22, 138, 200, 20, 6);
  // pop();

  //characters tally box
  // push();
  // fill(
  //   inputBox.collectedCharacters.r,
  //   inputBox.collectedCharacters.g,
  //   inputBox.collectedCharacters.b
  // );
  // stroke(220, 219, 217); //CHANGES ON HOVER
  // rect(22, 257, 100, 20, 6);
  // pop();
  let gemsCounter = ` ${mmmProfile.audioGemsCollected}   GEMS COLLECTED`;
  //items tally box
  push();
  fill(
    inputBox.collectedItems.r,
    inputBox.collectedItems.g,
    inputBox.collectedItems.b
  );
  // stroke(220, 219, 217); ///CHANGES ON HOVER
  // fill(255);
  // rect(222, 147, 20, 20, 6);

  fill(0);
  text(gemsCounter, 220, 155);

  pop();

  //what kind of gem are you hunting box
  push();
  ///put text here instead of above in the large text profile
  fill(inputBox.geolocation.r, inputBox.geolocation.g, inputBox.geolocation.b);
  stroke(220, 219, 217); //CHANGES TO BLACK ON HOVER
  rect(22, 500, 330, 20, 6);

  pop();

  // my current gem hunt box
  push();
  fill(inputBox.current.r, inputBox.current.g, inputBox.current.b);
  stroke(220, 219, 217); //CHANGES TO BLACK ON HOVER OR SELECT
  rect(22, 545, 330, 40, 6);
  startSearchButton();
  neighbourhoodSearchButtons();
  howToHuntButtons();
  pop();
}

//set the geolocation data from the library to the correct UI element in the profile.
function positionChanged(position) {
  mmmProfile.currentLocationLat = position.latitude;
  mmmProfile.currentLocationLong = position.longitude;
}

// ///mouse Press advances user from the open welcome and intro scene.
// function mousePressed() {
//   if (state === `enter`) {
//     state = `enter_scene_One`;
//     introAdvanceButton();
//   }
// }
