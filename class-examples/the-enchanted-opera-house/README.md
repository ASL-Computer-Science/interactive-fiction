# After the Last Curtain

A self-contained, playable four-room interactive fiction demonstration for the November HTML/CSS/JavaScript unit.

## Play

1. Unzip the downloaded archive.
2. Open `index.html` in Chrome, Firefox, Safari, or another modern browser.
3. Click **Continue** to reveal one paragraph at a time.
4. After the last paragraph in a room, choose one of the generated destination buttons.
5. On returning to a room, all paragraphs you previously revealed are immediately visible. If the room is fully read, its exits appear immediately.
6. Explore all four rooms. **Start over** clears reading progress and visited flags and returns to the entrance.

No web server, internet connection, account, or installation is required. Artwork is included as locally stored SVG images.

## Project files

- `index.html`: Room presentation structure: empty image/title placeholders, story area, and controls. The JavaScript engine fills these from the selected room object when the page loads.
- `styles.css`: Visual appearance and responsive layout.
- `script.js`: **Story data**, **program state**, and **functions** that render rooms, reveal paragraphs, and generate navigation buttons.
- `images/`: Four original illustrative SVG room images.

## Room presentation and initialization

The initial HTML deliberately does not specify an Entrance Hall title or image. It defines the places where room content will appear (`roomImage`, `roomTitle`, `story`, and `controls`). At the end of `script.js`, `enterRoom("entrance")` selects the opening room, updates the HTML, and reveals its first paragraph. All room-specific content is maintained in the `rooms` object, not duplicated in `index.html`.

## Room data and named destinations

The `rooms` object in `script.js` contains one property for each room identifier. Every room has `name`, `image`, `imageDescription`, `paragraphs`, `exits`, `readingProgress`, and `visited`. The final two properties are updated by the program as the player explores.

An exit uses a **room identifier** such as `"auditorium"`, not a numeric array index. To add a new room, add a new property to `rooms`, create or supply its image, and include its identifier in another room's `exits` array.

## Learning connections

- **JavaScript objects** hold related information about each location.
- **Arrays** store paragraphs and exits for each room.
- **Persistent state** uses a `readingProgress` number and a `visited` Boolean on each room; only `currentRoom` is kept separately. These values are remembered while the page stays open, not after a browser reload.
- **A `for` loop** restores previously revealed paragraphs when a room is revisited.
- **Functions** handle entering rooms, continuing the story, and presenting exits.
- **A `for...of` loop** creates a button for every available destination.
- **DOM manipulation** changes the image, title, text, and controls without loading another page.
- **Event listeners** make buttons invoke the appropriate functions.

## Suggested student customizations

Change the text and images first. Then add a room, connect it using named exits, and verify that the link back works. The core task is complete when all rooms can be reached and each room's paragraphs appear in sequence before its exits are offered.

The browser console reports an error if the program tries to enter an unknown room identifier. Each room's exits must match an existing identifier exactly.

## Credits

Room illustrations: original SVG assets generated for this project. No third-party dependencies.
