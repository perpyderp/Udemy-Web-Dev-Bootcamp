
// const fs = require("fs");

// fs.copyFileSync("file1.txt", "file2.txt");

var superheroes = require("superheroes");
var superHeroName = superheroes.random();
var supervillains = require("supervillains");
var villainName = supervillains.random();

console.log("Villain Name: " + villainName);
console.log("Superhero Name: " + superHeroName);