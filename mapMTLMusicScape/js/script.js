"use strict";

/*****************
E3: Spy Profile Generator PLUS
-- Mapping the Montreal Musicscape, An Interactive AudioCast.
By: Alana DeVito

Mapping the Montreal MusicScape is an Interactive AudioCast that leads users to different locations around Montreal to uncover, listen to and collect different 'Audio Gems' that represent that unqiue neighbourhood in Montreal. The soundscape, playlist, interview, story or some other type of audio piece created and submitted by an audioCast user can be found by users when their geolocation tracked by the app enters specific lat and long points in that neighbourhood. While the user can only access these 'audio Gems' when they enter that specific location, they can collect those pieces and listen or re-listen later when they are no longer in that location.

This is a mockup app that only retrieves, displays saves and stores data that would then be used to direct the user to the appropriate audio pieces (or 'gems') 'hidden' around the city.
There are currently no audio files active in this mock-up.
The design is only a rough sketch of the actual mobile app graphic design and user interface. All graphics, font and colours should be considered temporary.

Interaction and User Direction:
-Upon opening up the app or going to the website on your mobile phone (can be accessed on desktops/laptops as well, but it is not size responsive to a larger screen)- the user is prompted to enter in a User Name and Password if they have not logged on before. If they have, and get their name or password incorrect, they will be asked to create a new user name and password.

- NOT YET IMPLIMENTED, TO BE ADDED: Next prompt will ask the user is they would like to listen to CJLO live online or listen to a generative ambient soundscape during their audio hunt (this will stop once they find the 'audioGems').

- The user name will be displayed on the app under name (in the blue box).
- NEXT: The user chooses the neighbourhood that they would like to start their audioCast hunt in (choose the neighbourhood that best describes where they are) with the drop down menu that says 'Choose where you would like to hunt.' below 'Hunt Neighbourhood'.

- NEXT: The user chooses how they would like to hunt for the audio under 'How would you like to hunt?'' in the dropbox underneath that says 'Choose the method or randomize.'
  - the Hunt methods are :
    - Mystery walk (Abstract audio direction only. A audio signal will get louder or quieter as they get closer or further away from an item they are searching.)
    - Direct me with words.
    - Map only. ( Pressing the 'See MMMap' Button in the upper right corner will always show the map, but this method will not provide other assistance. (the 'See MMMAP' button is not active in this mock-up.)
    - Random will choose one of the above methods.

- NEXT: The user chooses the type of audio gem that they would like to seek out under 'What kind of audio gem are you hunting?' in the dropdown menu that says 'Choose the type or randomize.'
  - the Audio Gem types are:
    - Soundscape
    - Interview
    - Story
    - Playlist
    - User Created - Users can create their own audio Gems and submit to be included in their chosen neighbourhood (preferrably something that represents the neighbourhood to them).
    - Random will choose one of the above methods.
- NEXT: At the bottom of the app, the user's choices will be displayed - 'how they are searching' TO 'what type of audio gem' IN 'neighbourhood' - this section is in pink under 'My Current Hunt'.
    - Also, the title of what they will be searching for is in the yellow box at the very bottom under 'Currently Hunting'.

- NEXT (NOT ACTIVE) : The user will listen to an ambient soundscape or  CJLO live radio while they hunt for the audio gems in their neighbourhood.
- As the user collects 'Audio Gems' they can see the amount they've collected in a pink box titled 'Audio Gems Collected'.

- Each time a user opens their app their last search will be active until they change the parameters, ending with the audio gem type.

Next steps will be integrating geolocation into this app.
- geolocation data: https://editor.p5js.org/shiffman/sketches/HkQ8kMdee


Brief:
- *Create the design of the application for a mobile app (improve the mobile display)
- Add the ability to delete the current profile data with a keyboard command or button (reset) QUESTION  - how to do this?
- *store the items you searched for at each visit
- *Allow the user to selectively regenerate specific categories in the profile using drop down menues.
- Enter your name and password, if you type 'create new' then you are asked to create them.
- If they do not match what is already on file, the system will just ask you to generate a new one.
- *audio gems collected should read 0 at first unless old profile is pulled up x - every time you activate a new audio gem search you add a gem to your tally (eventually this will only be added when you actually hunt and find the audio gem in that location).

******************/

// The audio scape profile data while the program is running
let mmMapProfile = {
  name: ``,
  homeHood: `----------`, //hunt neighbourhood
  audioGemsCollected: 0, //number of audio gems Collected
  currentLocation: ``, ///geolocation - fetch lat and long - not yet active, just placeholder for now
  huntMethod: `----------`, //how the user wants to be led to the audioGem
  selection: `----------`, ///current audioGem: --if choose random, generate randomly, else, choose in app, not in prompt
  currentHuntHood: `----------`, //neighbourhood determined by geolocation
  password: ``, // save the user's password entered in prompt.
  huntAddress: ``, ///where you are going to find the audio gem (shown just in mockup prototype) this is where the user is led - currently it just shows the name of the AudioGem that the user is hunting.
};
// Variables to store JSON data for generating the profile

let audioScapeData = undefined;

let homeHoodData = undefined;
let audioGemsCollectedData = 0;
let currentLocationData = undefined;
let currentHuntHoodData = undefined;

//arrays for audioGem types and audio hunt types - access for random selections.
let audioGems = ["Interview", "Story", "Playlist", "User created"];
let huntType = [
  "Mystery walk w/ audio cue",
  "Direct me with voice",
  "Map only",
];

let huntAddressData = undefined; ///where you are going to find the audio gem (shown as just the title of the audioGem being hunted in the mockup prototype) - this is where the user is led.

let mmmBanner = undefined; // set app banner image variable

///variables for user inputs

let userInputHomeHood = undefined; //user enters the name of the local neighourhood to hunt
let userInputSelection = undefined; //randomized if choice is random, else user enter soundscape, interview, story, playlist or user created.
let userInputHuntMethod = undefined; //choices are : Mystery walk (listen to a ambient playlist with abstract audio direction only. A audio signal will get louder or quieter as you get closer to an item.) Direct me with words. Show me a map. ( please be careful).

// buttons variables
let seeMapButton = undefined; //click to show the audiogems on a map (not active in mock up).

function preload() {
  mmmBanner = loadImage(`assets/images/mmmBanner.png`); //load the banner image into the mmmBanner variable

  audioScapeData = loadJSON(`assets/data/location_data.json`); //load the JSON file containing the neighbourhood audioGem titles, sorted by types and neighbourhood.
}

/**
Creates a canvas then handles loading profile data, checking password,
and generating a profile.
*/
function setup() {
  // Create the canvas
  createCanvas(375, 667); //size of iphone 6/7/8 - mobile first then make responsive to other shapes and sizes.

  //

  //commented out below because it was causing issues on first visit.
  //will revisit when I explore further.
  // let savedProfile = localStorage.getItem(`mmMap-profile-data`); //set prior information from the local storage into the savedProfile variable
  //
  // //set mmMapProfile as the savedProfile recived in localStorage.getItem
  // mmMapProfile = JSON.parse(savedProfile);

  //

  //drop down menues
  //user choose their hunt neighbourhood
  userInputHomeHood = createSelect(); //create dropdown menu with p5.js function
  userInputHomeHood.position(110, 245);
  userInputHomeHood.option("Choose where you would like to hunt.");
  userInputHomeHood.option("Plateau Mont Royal Outremont");
  userInputHomeHood.option("Villeray and Rosemont");
  userInputHomeHood.option("Ville Marie");
  userInputHomeHood.option("NDG CDN");
  userInputHomeHood.option("Hochelaga Maisonneuve");
  userInputHomeHood.option("Sud Ouest");
  userInputHomeHood.changed(sendHomeHood); // create action after the input drop down is changed - send to / call the sendHomHood function.

  //choose their hunt method
  userInputHuntMethod = createSelect(); //create dropdown menu with p5.js function
  userInputHuntMethod.position(130, 420);
  userInputHuntMethod.option("Choose the method or randomize.");
  userInputHuntMethod.option("Random");
  userInputHuntMethod.option("Mystery walk w/ audio cue");
  userInputHuntMethod.option("Direct me with voice");
  userInputHuntMethod.option("Map only");
  userInputHuntMethod.changed(sendHuntMethod); // create action after the input drop down is changed - send to / call the sendHuntMethod function.

  //choose their audio Gem selection to hunt
  userInputSelection = createSelect();
  userInputSelection.position(149, 480);
  userInputSelection.option("Choose the type or randomize.");
  userInputSelection.option("Random");
  userInputSelection.option("Interview");
  userInputSelection.option("Story");
  userInputSelection.option("Playlist");
  userInputSelection.option("User created"); //to find gems left by other users.< will need to be monitored. will be rated by other users?.
  userInputSelection.changed(sendSelection); // create action after the input drop down is changed - send to / call the sendSelection function.

  //create button

  seeMapButton = createButton("See MMMAP");
  seeMapButton.position(250, 115); //located at upper right corner
  seeMapButton.mousePressed(sendMapButton); //call a function when mouse is pressed
  seeMapButton.size(105, 50);

  ///When above information is submitted the data fills the coloured boxes in the app.

  // Check of there is a saved profile and try to load the data
  let data = JSON.parse(localStorage.getItem(`mmMap-profile-data`));
  if (data !== null) {
    let name = prompt(`What is your user name? Or type "create new"`); //enter user name or ask to create new one
    if (name === `create new`) {
      generateAudioScapeProfile(); //create new profile
    } else {
      let password = prompt(`What is your password? Or type "create new"`);
      if (password === data.password && name === data.name) {
        mmMapProfile.name = data.name;
        mmMapProfile.homeHood = data.homeHood;
        mmMapProfile.audioGemsCollected = data.audioGemsCollected;
        mmMapProfile.huntMethod = data.huntMethod;
        mmMapProfile.selection = data.selection;
      } else if (
        (password !== data.password && name !== data.name) ||
        (name === data.name && password !== data.password) ||
        (name !== data.name && password === `create new`)
      ) {
        //if password and usernames dont match one on file, generate new profile.
        generateAudioScapeProfile();
      }
    }
  } else {
    generateAudioScapeProfile();
  }
}

/**
Assigns across the profile properties from the data to the current profile
*/
function generateAudioScapeProfile() {
  mmMapProfile.name = prompt(`What is your name?`); //prompt answer saved into the variable
  mmMapProfile.password = prompt(`Please create a password.`); //prompt answer saved into the variable

  localStorage.setItem(`mmMap-profile-data`, JSON.stringify(mmMapProfile));
  //localStorage is the object that knows how to save things
  //setItem is the method that does the saving
  //'mmMap-profile-data' is the key
  //stringify the thing you want to save
}

function draw() {
  background(0);
  //coloured boxes behind data entered information.
  //name box - blue
  push();
  fill(35, 184, 198, 200);
  stroke(255);
  rect(22, 177, 200, 20, 6);
  pop();

  //audio gems tally box - pink
  push();
  fill(250, 72, 138, 200);
  stroke(255);
  rect(22, 297, 100, 20, 6);

  pop();

  //my geolocation box - green
  push();
  fill(188, 250, 100, 177);
  stroke(255);
  rect(22, 358, 200, 20, 6);

  pop();

  //My Current Hunt details - pink -- eventually these will change colour when changed in THIS session.
  push();
  fill(250, 72, 138, 200);
  stroke(255);
  rect(22, 537, 335, 41, 6);
  pop();

  //Currently Hunting box - green -- eventually these will change colour when changed in THIS session.
  push();
  fill(240, 183, 48, 200);
  stroke(255);
  rect(22, 619, 335, 19, 6);

  pop();

  //profle text with changing data in the template literals
  let profile = `
  AudioCast Profile

  Name:
    ${mmMapProfile.name}

  Hunt Neighbourhood:


  Audio Gems Collected:
    ${mmMapProfile.audioGemsCollected}

  My Geolocation (coming soon!)
    ${mmMapProfile.currentLocation}

  How would you like to hunt?


  What kind of audio gem are you hunting?


  My Current Hunt:
    ${mmMapProfile.huntMethod} to ${mmMapProfile.selection}
    in ${mmMapProfile.homeHood}

  Currently Hunting:
    ${mmMapProfile.huntAddress}`;

  //display the text along with the design banner at the top
  push();
  image(mmmBanner, 0, 0);
  textFont(`Tahoma`);
  textSize(16);
  textAlign(LEFT, TOP);
  fill(255);
  text(profile, 10, 100);

  pop();
}

//NOTE: User must do the audio gem last for the 'currently hunting' section to update to the correct audioGem destination. Will need to look into this.

//take dropdown selection from Hunt neighbourhood and set it to mmMapProfile.homeHood.
//save in local storage and reset the dropdown menu to Choose...
function sendHomeHood() {
  mmMapProfile.homeHood = userInputHomeHood.value();
  // userInputHomeHood.value("");
  localStorage.setItem(`mmMap-profile-data`, JSON.stringify(mmMapProfile));
  // userInputHomeHood.value(`Choose where you would like to hunt.`);
}
//take dropdown selection from Hunt method and set it to mmMapProfile.huntMethod.
//save in local storage and reset the dropdown menu to Choose...
function sendHuntMethod() {
  mmMapProfile.huntMethod = userInputHuntMethod.value();

  if (mmMapProfile.huntMethod === `Random`) {
    mmMapProfile.huntMethod = random(huntType); //if RANDOM, fetch random selection from the huntType array
    userInputHuntMethod.value(`Choose the method or randomize.`);
  } else {
    // userInputHuntMethod.value(`Choose the method or randomize.`);
  }
  localStorage.setItem(`mmMap-profile-data`, JSON.stringify(mmMapProfile));
}
function sendSelection() {
  mmMapProfile.selection = userInputSelection.value();

  if (mmMapProfile.selection === `Random`) {
    mmMapProfile.selection = random(audioGems); //if RANDOM, fetch random selection from the audioGems array
    userInputSelection.value(`Choose the type or randomize.`);
  } else {
    // userInputSelection.value(`Choose the type or randomize.`);
  }

  for (let i = 0; i < audioScapeData.location_audioGems.length; i++) {
    //go through the JSON data set with the for loop and find the user's audio gem selection for their choosen neighbourhood.
    if (
      audioScapeData.location_audioGems[i].neighbourhood ===
      mmMapProfile.homeHood
    ) {
      audioScapeData.location_audioGems[i][mmMapProfile.selection];
      mmMapProfile.huntAddress = random(
        audioScapeData.location_audioGems[i][
          mmMapProfile.selection.toLowerCase() //set to lower case so that the if statement will match
        ]
      );
    }
  }
  mmMapProfile.audioGemsCollected++; //for now just add a gem once you choose oneto search for. Will change to add one when the user actually enters that location.
  localStorage.setItem(`mmMap-profile-data`, JSON.stringify(mmMapProfile)); //store the number of gems the user collects.
}

function sendMapButton() {} /// Not currently active. Eventually this will bring up a small map showing the location of the audioGems to hunt for.
