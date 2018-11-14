const CharacterSheet = require("../dist/character-sheet");

// create a new Character Sheet System
const DungeonsAndDragons5E = CharacterSheet();

// create a new stat called "strength"
DungeonsAndDragons5E.define("strength")
  .describe({ name: "Strength", description: "A measure of physical force." })
  .default(0);

// create a stat that's calculated based on "strength"
DungeonsAndDragons5E.define("strength-modifier")
  .describe({
    name: "Strength Modifier",
    description: "Add to your strength based rolls."
  })
  .using("strength")
  .calculate(str => Math.floor(str / 2) - 5);

// instantiate an actual workable sheet
const myPlayersSheet = new DungeonsAndDragons5E();

// set strength value
myPlayersSheet("strength").set(14);

// show all calculated values
myPlayersSheet.getSheet(); // { strength: 14, 'strength-modifier': 2 }