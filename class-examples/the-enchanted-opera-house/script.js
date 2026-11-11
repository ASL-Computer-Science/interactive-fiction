"use strict";

// STORY DATA: Students can add rooms, edit paragraphs, change images,
// and connect locations by listing their named destinations in exits.
// Images are stored locally in the images/ folder.
const rooms = {
  entrance: {
    name: "Entrance Hall",
    image: "images/entrance.svg",
    imageDescription: "An elegant opera-house foyer with a tall chandelier and grand staircase.",
    paragraphs: [
      "The last guests have gone. You stand beneath a chandelier whose lights flicker against the marble floor.",
      "A clerk has left a handwritten note on the reception desk: ‘Before you leave, listen to what the building remembers.’",
      "The cloakroom lies to your left. Ahead, the auditorium doors stand slightly open."
    ],
    exits: ["cloakroom", "auditorium"],
    readingProgress: 0,
    visited: false
  },
  cloakroom: {
    name: "Cloakroom",
    image: "images/cloakroom.svg",
    imageDescription: "A quiet coat-check room with hanging coats and a brass service bell.",
    paragraphs: [
      "The cloakroom smells faintly of rain and old wool. An abandoned ticket rests beneath a brass bell.",
      "You turn the ticket over. Someone has written: ‘Not every performance happens on the stage.’",
      "The reception desk is empty. You can return to the entrance hall."
    ],
    exits: ["entrance"],
    readingProgress: 0,
    visited: false
  },
  auditorium: {
    name: "Auditorium",
    image: "images/auditorium.svg",
    imageDescription: "An ornate auditorium with red velvet seats facing a glowing stage curtain.",
    paragraphs: [
      "The vast auditorium is empty, its velvet seats fading into the darkness. A single work light shines on the stage.",
      "A low melody rises from somewhere behind the curtain, although the orchestra pit is deserted.",
      "A door near the stage leads backstage. The entrance hall remains behind you."
    ],
    exits: ["entrance", "backstage"],
    readingProgress: 0,
    visited: false
  },
  backstage: {
    name: "Backstage",
    image: "images/backstage.svg",
    imageDescription: "A backstage corridor lined with ropes, scenery, and a warm work light.",
    paragraphs: [
      "Beyond the curtain, painted scenery leans against the walls. Thick ropes hang from the rigging above.",
      "The melody is coming from a small wind-up music box on a worktable. Its key turns slowly, then stops.",
      "The opera house falls silent. You have found the source of the mysterious music. You can return to the auditorium and explore again."
    ],
    exits: ["auditorium"],
    readingProgress: 0,
    visited: false
  }
};

// PROGRAM STATE: Only the current location is stored separately.
// Each room stores its own readingProgress and visited properties.
let currentRoom = "entrance";

// HTML ELEMENTS: Get each element once so the functions can update it.
const roomImage = document.getElementById("roomImage");
const roomTitle = document.getElementById("roomTitle");
const roomCount = document.getElementById("roomCount");
const story = document.getElementById("story");
const controls = document.getElementById("controls");
const restartButton = document.getElementById("restartButton");

// Enter a room, restoring its previously revealed paragraphs.
function enterRoom(destination) {
  if (!Object.hasOwn(rooms, destination)) {
    console.error("Unknown room:", destination);
    return;
  }

  currentRoom = destination;
  const room = rooms[currentRoom];
  room.visited = true;
  roomTitle.textContent = room.name;
  roomImage.src = room.image;
  roomImage.alt = room.imageDescription;
  const visitedCount = Object.values(rooms).filter(room => room.visited).length;
  roomCount.textContent = `${visitedCount} of ${Object.keys(rooms).length} rooms visited`;
  story.replaceChildren();
  controls.replaceChildren();

  // On first entry, reveal the first paragraph automatically.
  if (room.readingProgress === 0) {
    continueStory();
    return;
  }

  // On a return visit, restore exactly what was previously revealed.
  // The loop recreates visible paragraphs without advancing progress.
  for (let i = 0; i < room.readingProgress; i++) {
    appendParagraph(room.paragraphs[i]);
  }
  updateControls();
}

function appendParagraph(text) {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  story.appendChild(paragraph);
}

// Reveal one *new* paragraph and remember the result for this room.
function continueStory() {
  const room = rooms[currentRoom];
  const paragraphs = room.paragraphs;
  const nextParagraph = room.readingProgress;

  if (nextParagraph < paragraphs.length) {
    appendParagraph(paragraphs[nextParagraph]);
    room.readingProgress++;
    const visitedCount = Object.values(rooms).filter(room => room.visited).length;
    roomCount.textContent = `${visitedCount} of ${Object.keys(rooms).length} rooms visited`;
  }

  updateControls();
}

function updateControls() {
  const room = rooms[currentRoom];
  if (room.readingProgress >= room.paragraphs.length) {
    showExits();
  } else {
    showContinueButton();
  }
}

function showContinueButton() {
  controls.replaceChildren();
  const button = document.createElement("button");
  button.type = "button";
  button.className = "continue";
  button.textContent = "Continue ↓";
  button.addEventListener("click", continueStory);
  controls.appendChild(button);
}

// A for...of loop generates one button for each named destination.
function showExits() {
  controls.replaceChildren();

  const prompt = document.createElement("p");
  prompt.className = "prompt";
  prompt.textContent = "Where will you go next?";
  controls.appendChild(prompt);

  for (const destination of rooms[currentRoom].exits) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "exit";
    button.textContent = `Go to ${rooms[destination].name}`;
    button.addEventListener("click", function () {
      enterRoom(destination);
    });
    controls.appendChild(button);
  }
}

restartButton.addEventListener("click", function () {
  for (const room of Object.values(rooms)) {
    room.readingProgress = 0;
    room.visited = false;
  }
  enterRoom("entrance");
});

enterRoom("entrance");
