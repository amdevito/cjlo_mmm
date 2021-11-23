"use strict";

/*****************
Project One: Labyrinth GO (the game)
By: Alana DeVito

You are the main character from the 1984 movie, Labyrinth.

You find out your baby brother, Toby has disappeared and need to search the labyrinth for characters and items in order to find the Goblin King, Jareth and get your baby brother, Toby back!

- enter your name and password, which is then saved locally to be recalled later.
- Search the different scenes using the drop down menus for items and characters to help you on your way.
- you need to find 7 characters and 4 items by the end of the game or else you can't face off against Jareth and are forced to start again.

- at the top of each scene/level, a picture from that part of the movie is shown and you are given the storyline of that scene. Press the start your search button to advance to the searching aspect of that level.

- Be careful where you look because there are traps that will force you to start over!
- hit the advance to next scene button when you are ready to look in a different location.

- press a button to see the map of the labyrinth, but you only see an optical illusion.

- Annyang voice recognition employed for the closing scene where the user has to face off against Jareth. User beats Jareth by saying the phrase 'you have no power over me' which they would have learned in the first scene search when they picked up the book, Labyrinth and read that line.

- your geolocation is visible, telling you where you are in the labyrinth (actually in real-life) - I decided that having someone walk around their space may be impractical right now, but I still wanted to try and utilize a geolocation library so I have kept that in the application for visual UI purposes mainly.

******************/
//set beginning state for the game
let state = "enter";

// declare the latitude and longitude variables to set the geolocation of the user.
let lat;
let long;

//create scene variable that will then have one added at every scene advance
let scene = ``;

//create variable to store the user's voice declaration of the secret line for the final scene.
let currentAnswer = ``;

// Store the game profile data and all corresponding ifo for game.
let labyrinthProfile = {
  name: ``,
  searchLocation: `----------`, //search a specific place in that scene
  charactersCollected: 0, //start with no characters collected
  itemsCollected: 0, //start with no items collected
  currentScene: 0, //no scene until entering scene 1
  selection: `----------`, ///what is the user searching for - item or character?
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

//variables to store the gif with the storyline for the start of each scene
let enterIntroInfo = undefined;
let enterOneInfo = undefined;
let enterTwoInfo = undefined;
let enterThreeInfo = undefined;
let enterFourInfo = undefined;
let enterFiveInfo = undefined;

//variables to store the image at the top of each scene (accompanied by the info above)
let sceneOneIntroImage = undefined;
let sceneTwoIntroImage = undefined;
let sceneThreeIntroImage = undefined;
let sceneFourIntroImage = undefined;
let sceneFiveIntroImage = undefined;

let loseImage = undefined; //don't need this?
//same as above but for final scene
let winInfo = undefined;
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
let seeMapButton = undefined; //click to show the labyrinth (just a trick! an optical illusion! - it should say- 'IN THE LABYRINTH, NOTHING IS WHAT IT SEEMS!')

let nextSceneButton = undefined; //button to leave current search scene and move to next intro scene
let nothingIsAsItSeemsButton = undefined; //leave the trick map scene and return to the search interface/scene
let advanceToScene = undefined; //leave the scene entrance/storyline element and begin the search
let loseRestartButton = undefined; //pops up when user loses and needs to restart the game
let figthJarethButton = undefined; //when user is in position to win (has the right number of characters and items and finds Jareth or Toby and must face Jareth)

function preload() {
  //set up variables with their respective physical elements

  labyrinthBanner = loadImage(`assets/images/labyrinthBanner.png`); //load the banner image into the labyrinthBanner variable - 8bit Labyrinth game logo
  labyrinthTrickMap = loadImage(`assets/images/labyrinthBackground.jpg`); //load the optical illusion labyrinth trick map

  ///typing gifs with each scene's storyline typing out : from http://wigflip.com/minifesto/

  enterIntroInfo = loadImage(`assets/images/enterIntroInfo.gif`); //load the optical illusion labyrinth trick map
  enterOneInfo = loadImage(`assets/images/enterOneInfo.gif`); //load the storyline gif for scene one - 'oh no! you've come to your baby brother's room...''
  enterTwoInfo = loadImage(`assets/images/enterTwoInfo.gif`); //load the storyline gif for scene two - 'Jareth, the goblin King tells you...'
  enterThreeInfo = loadImage(`assets/images/sceneThreeInfo.gif`); //load the storyline gif for scene three - 'you find a set of doors guarded by a set of dog-like creatures... '
  enterFourInfo = loadImage(`assets/images/enterFourInfo.gif`); //load the storyline gif for scene four - 'after escaping out of the oubliette, you encounter the Wiseman...'
  enterFiveInfo = loadImage(`assets/images/enterFiveInfo.gif`); //load the storyline gif for scene five - "you make it to the Castle at the center of the Goblin City..."
  winInfo = loadImage(`assets/images/winInfo.gif`); ////load the storyline gif for when user faces off against Jareth 'say the line!'

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
  createCanvas(375, 667); //size of iphone 6/7/8 -meant to be a moile app.

  //check if geolocation is available
  if (geoCheck() == true) {
    //geolocation is available -
  } else {
    //error getting geolocation
  }

  //voice recognition for line to beat Jareth in winScene.
  //activate the annyang voice recognition library
  if (annyang) {
    let commands = {
      //assign the user's guess to the command variable and call the guess line function. //listen to all of the user's speech
      "*userSpeech": guessLine,
    };

    annyang.addCommands(commands);
    annyang.start();
  }

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

  ///Game profile saving and setting to the labyrinthProfile variable.
  // Check of there is a saved profile and try to load the data
  let data = JSON.parse(localStorage.getItem(`labyrinth-profile-data`));
  if (data !== null) {
    let name = prompt(`What is your user name? Or type "create new"`); //enter user name or ask to create new one
    if (name === `create new`) {
      generateLabyrinthProfile(); //create new profile
    } else {
      let password = prompt(`What is your password? Or type "create new"`);
      if (password === data.password && name === data.name) {
        labyrinthProfile.name = data.name;
        labyrinthProfile.searchLocation = data.searchLocation;
        labyrinthProfile.charactersCollected = data.charactersCollected;
        labyrinthProfile.currentScene = data.currentScene;
        labyrinthProfile.itemsCollected = data.itemsCollected;
        labyrinthProfile.selection = data.selection;
      } else if (
        (password !== data.password && name !== data.name) ||
        (name === data.name && password !== data.password) ||
        (name !== data.name && password === `create new`)
      ) {
        //if password and usernames dont match one on file, generate new profile.
        generateLabyrinthProfile();
      }
    }
  } else {
    generateLabyrinthProfile();
  }
}

// Assigns across the profile properties from the data to the current profile

function generateLabyrinthProfile() {
  labyrinthProfile.name = prompt(`What is your name?`); //prompt answer saved into the variable labyrinthProfile.name
  labyrinthProfile.password = prompt(`Please create a password.`); //prompt answer saved into the variable labyrinthProfile.password

  localStorage.setItem(
    //store info in localStorage
    `labyrinth-profile-data`,
    JSON.stringify(labyrinthProfile)
  );
  //localStorage is the object that knows how to save things
  //setItem is the method that does the saving
  //'labyrinth-profile-data' is the key
  //stringify the thing you want to save
}

function draw() {
  background(0);

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
    nextSceneButton.remove();
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

//when the user selects where to search in that scene, set it to the variable labyrinthProfile.searchLocation
function sendSearchLocation() {
  labyrinthProfile.searchLocation = userInputLocation.value();
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
  // labyrinthProfile.charactersCollected = 7; //take away after testing done
  // labyrinthProfile.itemsCollected = 4; //take away after testing done

  // testing console.logs to track exacly what info is being found throughout the code.
  // console.log(labyrinthProfile.charactersCollected, `characters`);
  // console.log(labyrinthProfile.itemsCollected, `items`);
  // console.log(gameData);
  // console.log(labyrinthProfile.searchLocation);
  // console.log(labyrinthProfile.selection);

  labyrinthProfile.selection = userInputSelection.value().toLowerCase();

  ///logic / if else statements to fetch specific JSON data from location_data.json file.
  ///from the JSON variables - ex.gameData.location_finds[0][`under bed`][1]: first [0] refers to the scene, ['location in the scene'], [0] - character, [1] - item
  //LEVEL ONE
  if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `under bed`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[0][`under bed`][0];
    labyrinthProfile.charactersCollected++; //character found, add a character point
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `under bed`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[0][`under bed`][1]; ///nothing is there, so no point added
    ///// diff location in that same scene
  } else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `behind curtain`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[0][`behind curtain`][0];
    labyrinthProfile.charactersCollected++; //character found add point
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `behind curtain`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[0][`behind curtain`][1]; //nothing there, no point added
    ///// diff location in that same scene
  } else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `in bookshelf`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[0][`in bookshelf`][0]; //nothing there, no point added
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `in bookshelf`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[0][`in bookshelf`][1];
    labyrinthProfile.itemsCollected++; //item found, add point
    ///// diff location in that same scene
  } else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `in closet`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[0][`in closet`][0]; //nothing, no point
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `in closet`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[0][`in closet`][1];
    labyrinthProfile.itemsCollected++; //found item add point
  }
  ///sceneTwo
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `under rock`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[1][`under rock`][0];
    labyrinthProfile.charactersCollected++; //characters found and add point
    //
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `under rock`
  ) {
    //
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[1][`under rock`][1]; //nothing there, no point
    /// different search location in the scene
  } else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `behind tree`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[1][`behind tree`][0];
    labyrinthProfile.charactersCollected++; //character found, add point.
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `behind tree`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[1][`behind tree`][1]; //no item there, no point.
    //different search location in the scene.
  } else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `check wall`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[1][`check wall`][0];
    labyrinthProfile.charactersCollected++; //found character in that place, add point.
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `check wall`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[1][`check wall`][1]; // no item there, no point
    ///different search location in that scene
  } else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `check ground`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[1][`check ground`][0]; //no character there, no point
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `check ground`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[1][`check ground`][1];
    labyrinthProfile.itemsCollected++; //item found on ground, add point.
  }
  ///sceneThree
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `check left corridor`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[2][`check left corridor`][0];
    labyrinthProfile.charactersCollected++; //character found on the ground, add point.
    //
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `check left corridor`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[2][`check left corridor`][1]; //item is not found there, no point.
  } ///new location in that scene
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `check door one`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[2][`check door one`][0];
    youLoseButton(); // door one is certain death! - call the you lose button -first GAME OVER trap - RESTART and try again!
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `check door one`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[2][`check door one`][1];
    youLoseButton(); // door one is certain death! - call the you lose button -first GAME OVER trap - RESTART and try again!
  } ///new location in that scene
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `check right corridor`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[2][`check right corridor`][0]; /// nothing is there, no point
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `check right corridor`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[2][`check right corridor`][1]; //no item is there, no point.
  } ///new location in that scene
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `check door two`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[2][`check door two`][0];
    labyrinthProfile.itemsCollected++; /// character found, add point.
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `check door two`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[2][`check door two`][1]; ///no item there, no point found.
  }
  ///sceneFour
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `look around tree`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[3][`look around tree`][0];
    labyrinthProfile.charactersCollected++; //character found, add point.
    //
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `look around tree`
  ) {
    //
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[3][`look around tree`][1];
  } /// new location in scene
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `look in bush`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[3][`look in bush`][0];
    labyrinthProfile.charactersCollected++; ///character is found and point is added.
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `look in bush`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[3][`look in bush`][1]; ///no item is found there, no point added.
  } ///new location in scene
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `look in dark tunnel`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[3][`look in dark tunnel`][0]; //no character is found, no point
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `look in dark tunnel`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[3][`look in dark tunnel`][1];
    //fall into the bog of eternal stench! Game over button - restart game
    youLoseButton();
  }
  //new location in scene
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `climb tree`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[3][`climb tree`][0]; //character not found, no points
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `climb tree`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[3][`climb tree`][1];
    youLoseButton();
    //poison peach sends you back to the start of the game.
  }
  ///sceneFive
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `climb up stairs`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[4][`climb up stairs`][0];
    youLoseButton();
    /// fall in love with Jareth (let's not kid ourselves here, it is DAVID BOWIE after allllllll <3) - game over and restart.
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `climb up stairs`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[4][`climb up stairs`][1]; //nothing found there, keep searching.
  }
  ///new search location in scene
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `go down stairs`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[4][`go down stairs`][0]; //no charater there, keep searching.
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `go down stairs`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[4][`go down stairs`][1];
    youLoseButton();
    //run out of time, game over.
  }
  ///search new location in scene
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `go through doorway` &&
    labyrinthProfile.charactersCollected >= 7 && //if user has 7 or more characters collected, and 4 or more items collected, then they can face Jareth to win the game.
    labyrinthProfile.itemsCollected >= 4
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[4][`go through doorway`][0];
    faceJarethButton(); ///go to the winScene where user has to say the line, 'you have no power over me' to win the game, or they must restart if they can't remember that line.
  } else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `go through doorway` &&
    labyrinthProfile.charactersCollected < 7 && ///if user doesn't collect enough items and characters, user must restart the game and try again.
    labyrinthProfile.itemsCollected < 4
  ) {
    youLoseButton(); ///game over, try again
    labyrinthProfile.hiddenThingFound = `You didn't collect enough characters\n     or items. Start over and try again.`;
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `go through doorway`
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[4][`go through doorway`][1]; //nothing there, keep searching
  }
  //search different location in scene.
  else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `jump off ledge` &&
    labyrinthProfile.charactersCollected >= 7 && ///if user has collected 7 or more items and characters, face Jareth in the winScene.
    labyrinthProfile.itemsCollected >= 4
  ) {
    labyrinthProfile.hiddenThingFound =
      gameData.location_finds[4][`jump off ledge`][0];
    faceJarethButton();
    //chance to win by facing Jareth
  } else if (
    labyrinthProfile.selection === `character` &&
    labyrinthProfile.searchLocation === `jump off ledge` &&
    labyrinthProfile.charactersCollected < 7 && //if user has collected less than 5 items and characters, lose
    labyrinthProfile.itemsCollected < 4
  ) {
    youLoseButton();
    labyrinthProfile.hiddenThingFound = `You didn't collect enough characters\n     or items. Start over and try again.`;
  } else if (
    labyrinthProfile.selection === `item` &&
    labyrinthProfile.searchLocation === `jump off ledge`
  ) {
    labyrinthProfile.hiddenThingFound =
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
function buttonRemover() {
  userInputLocation.remove();
  userInputSelection.remove();
  nextSceneButton.remove();
  seeMapButton.remove();
}

//set and create the buttons used throughout the game
function buttonMaker() {
  nextSceneButton = createButton("Done Searching, Go to Next Scene");
  seeMapButton = createButton("See the Labyrinth");
}

///remove all buttons and menus used for searching and place button that restarts the game.
function youLoseButton() {
  nextSceneButton.remove();
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
  labyrinthProfile.hiddenThingFound = ``; //clear item or characters found in last part
  labyrinthProfile.itemsCollected = 0; //reset items collected to zero to restart game
  labyrinthProfile.charactersCollected = 0; //reset characters collected to zero to restart game
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
  fill(200, 100, 0, 75);
  tint(75);
  stroke(0, 61, 61);

  image(labyrinthBanner, 0, 0);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2 - 7, height / 2 + 55, 330, 480);
  strokeWeight(3);
  stroke(250, 233, 0);

  fill(0);

  rect(width / 2 + 7, height / 2 + 35, 330, 480);
  pop();
}

//the first opening welcome scene when you launch the application
function enterIntro() {
  introStoryBoxes();

  push();
  imageMode(CENTER);
  image(enterIntroInfo, width / 2 + 7, height / 2 + 35);
  pop();
}

///entrance scene with image from movie and a storyline talking about the situation surround the current enviroment that the user will be searching in.
function enterOne() {
  introStoryBoxes();

  push();
  imageMode(CENTER);
  image(enterOneInfo, width / 2 + 7, height / 4);
  image(sceneOneIntroImage, width / 2 + 7, height / 4 + 250);
  pop();
}
///entrance scene with image from movie and a storyline talking about the situation surround the current enviroment that the user will be searching in.
function enterTwo() {
  introStoryBoxes();
  buttonRemover();
  push();
  imageMode(CENTER);
  image(enterTwoInfo, width / 2 + 7, height / 4 + 15);
  image(sceneTwoIntroImage, width / 2 + 7, height / 4 + 250);
  pop();
}

///entrance scene with image from movie and a storyline talking about the situation surround the current enviroment that the user will be searching in.
function enterThree() {
  introStoryBoxes();
  buttonRemover();
  push();
  imageMode(CENTER);
  image(enterThreeInfo, width / 2 + 7, height / 4 + 35);
  image(sceneThreeIntroImage, width / 2 + 7, height / 4 + 225);
  pop();
}

///entrance scene with image from movie and a storyline talking about the situation surround the current enviroment that the user will be searching in.
function enterFour() {
  introStoryBoxes();
  buttonRemover();
  push();
  imageMode(CENTER);
  image(enterFourInfo, width / 2 + 7, height / 4 + 15);
  image(sceneFourIntroImage, width / 2 + 7, height / 4 + 250);
  pop();
}

///entrance scene with image from movie and a storyline talking about the situation surround the current enviroment that the user will be searching in.
function enterFive() {
  introStoryBoxes();
  buttonRemover();
  push();
  imageMode(CENTER);
  image(enterFiveInfo, width / 2 + 7, height / 4 + 15);
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
  image(winInfo, width / 2 + 7, height / 4 + 15); //'say the line!''
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
  seeMapButton.position(250, 120); //located at upper right corner
  seeMapButton.mousePressed(sendMapButton); //call a function when button is pressed
  seeMapButton.size(105, 50);

  advanceToScene.remove();

  inputBoxes(); //place the white boxes on canvas to hold the data

  //profle text with changing data in the template literals
  //user's name, the number of characters and items collected over the span of the game
  //what scene the user is in and what specific item or character was found (activated after the drop menu with character or item is switched)

  let profile = `
  Name:
    ${labyrinthProfile.name}

  Where would you like to search?


  Characters Collected:
    ${labyrinthProfile.charactersCollected}
  Items Collected:
    ${labyrinthProfile.itemsCollected}




  What are you looking for?



    Current Scene: ${labyrinthProfile.currentScene}
    Item Found:
    ${labyrinthProfile.hiddenThingFound}



`;

  //display the text (using the variable above and template literates) along with the design, 8bit Labyrinth Go game banner at the top
  push();
  image(labyrinthBanner, 0, 0);
  textFont(`American Typewriter`);
  textSize(16);
  textAlign(LEFT, TOP);
  fill(0, 139, 140);
  text(profile, 10, 100);

  pop();
  //display the user's location in the real-world
  let geolocationProfile = `
My Geolocation:
 Lat: ${labyrinthProfile.currentLocationLat}
 Long: ${labyrinthProfile.currentLocationLong}
    `;

  push();
  textFont(`American Typewriter`);
  textSize(16);
  textAlign(LEFT, TOP);
  fill(0, 139, 140);
  text(geolocationProfile, 22, 300);
  pop();

  push();
  nextSceneButton.position(width - 135, height - 90); //located at upper right corner
  nextSceneButton.mousePressed(goToNextScene); //call the function when mouse is pressed
  nextSceneButton.size(105, 50);
  pop();
}

//call this function to change to the next scene's intro and storyline info
function goToNextScene() {
  if (state === `scene_One`) {
    state = `enter_scene_Two`;
    introAdvanceButton();
    labyrinthProfile.hiddenThingFound = ``; //clear item or character found in the previous section
  } else if (state === `scene_Two`) {
    state = `enter_scene_Three`;
    introAdvanceButton();
    labyrinthProfile.hiddenThingFound = ``; //clear item or character found in the previous section
  } else if (state === `scene_Three`) {
    state = `enter_scene_Four`;
    introAdvanceButton();
    labyrinthProfile.hiddenThingFound = ``; //clear item or character found in the previous section
  } else if (state === `scene_Four`) {
    state = `enter_scene_Five`;
    introAdvanceButton();
    labyrinthProfile.hiddenThingFound = ``; //clear item or character found in the previous section
  }
}

function sceneOneMenus() {
  /// user's bedroom - find goblins, snake, goblin king, clock
  //user chooses their search location in that scene

  labyrinthProfile.currentScene = 1; //set the scene to one
  //assign locations specific to this scene
  searchLocation.one = `under bed`; //find goblins
  searchLocation.two = `behind curtain`; //goblin king
  searchLocation.three = `in bookshelf`; //snake
  searchLocation.four = `in closet`; //clock
}

function sceneTwoMenus() {
  //at the entrance of labyrinth - find hoggle [behind tree], faeries[under rock], bracelet [on ground], 'hello' caterpillar[at wall]
  //user chooses their search location in that scene
  labyrinthProfile.currentScene++; //add one to the scene #
  //assign locations specific to this scene
  searchLocation.one = `check wall`; //caterpillar
  searchLocation.two = `check ground`; //bracelet
  searchLocation.three = `behind tree`; //hoggle
  searchLocation.four = `under rock`; //faeriers
}

function sceneThreeMenus() {
  ///2 characters guarding doors that lie. 'certain death!'  - collect small characters from the tiles, and the helping hands -- 2 death options hidden in door one.
  //user chooses their search location in that scene

  labyrinthProfile.currentScene++; //add one to the scene #
  //assign locations specific to this scene
  searchLocation.one = `check left corridor`; //you catch small characters pop up from the tiles in the ground!
  searchLocation.two = `check door one`; // Certain death! Game over.
  searchLocation.three = `check right corridor`; //nothing.
  searchLocation.four = `check door two`; // you fall down a dark hole, but luckily the helping hands guide you into the oubliette and Hoggle helps you escape!
}

function sceneFourMenus() {
  // dark forest - collect the orange dancing bouncing head characters,ludo and try not to fall into the bog of eternal stench, and avoid the posion peach which sends you back to the start.
  //user chooses their search location in that scene

  labyrinthProfile.currentScene++; //add one to the scene #
  //assign locations specific to this scene
  searchLocation.one = `look around tree`; //ludo
  searchLocation.two = `look in bush`; ///dancing characters
  searchLocation.three = `look in dark tunnel`; /// get thrown into the bog of eternal stench and game over
  searchLocation.four = `climb tree`; //posion peach game over.
}

function sceneFiveMenus() {
  //final labyrinth, house of stairs.
  //user chooses their search location in that scene

  labyrinthProfile.currentScene++; //add one to the scene #
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
  push();
  fill(inputBox.name.r, inputBox.name.g, inputBox.name.b);
  stroke(253, 132, 0);
  rect(22, 138, 200, 20, 6);
  pop();

  //characters tally box
  push();
  fill(
    inputBox.collectedCharacters.r,
    inputBox.collectedCharacters.g,
    inputBox.collectedCharacters.b
  );
  stroke(253, 132, 0);
  rect(22, 257, 100, 20, 6);
  pop();

  //items tally box
  push();
  fill(
    inputBox.collectedItems.r,
    inputBox.collectedItems.g,
    inputBox.collectedItems.b
  );
  stroke(253, 132, 0);
  rect(22, 297, 100, 20, 6);

  pop();

  //my geolocation box
  push();
  fill(inputBox.geolocation.r, inputBox.geolocation.g, inputBox.geolocation.b);
  stroke(253, 132, 0);
  rect(22, 336, 250, 45, 6);

  pop();

  // Story line BOX - what scene are you in and what have you found.
  push();
  fill(inputBox.current.r, inputBox.current.g, inputBox.current.b);
  stroke(253, 132, 0);
  rect(22, 475, 330, 158, 6);
  pop();
}

//set the geolocation data from the library to the correct UI element in the profile.
function positionChanged(position) {
  labyrinthProfile.currentLocationLat = position.latitude;
  labyrinthProfile.currentLocationLong = position.longitude;
}

///mouse Press advances user from the open welcome and intro scene.
function mousePressed() {
  if (state === `enter`) {
    state = `enter_scene_One`;
    introAdvanceButton();
  }
}
