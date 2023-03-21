
var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;

function nextSequence() {
    // Choosing random number to determine color
    var randomNumber = Math.floor(Math.random() * 4);
    // Choosing the random color based on generated number
    var randomChosenColour = buttonColours[randomNumber];
    // Pushing random color to array
    gamePattern.push(randomChosenColour);
    // Flash chosen color's button
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

    playSound(randomChosenColour);
    
    console.log("Game pattern: " + gamePattern);
    console.log("User clicked pattern: " + userClickedPattern);

}


$(".btn").click(function() {
    if(started) {
        var userChosenColour = this.id;
        userClickedPattern.push(userChosenColour);

        console.log("Game pattern: " + gamePattern);
        console.log("User clicked pattern: " + userClickedPattern);

        checkAnswer(userClickedPattern.length-1);
        animatePress(userChosenColour);
        playSound(userChosenColour);
    }
});

$(document).keypress(function(event) {
    if(gamePattern.length == 0 && String.fromCharCode(event.keyCode) == 'a') {
        started = true;
        $("h1").text("Level " + level);
        nextSequence();
    }
});

function playSound(name) {
    var colorSound = new Audio("sounds/" + name + ".mp3");
    colorSound.play();
}

function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel) {
    // console.log(userClickedPattern[currentLevel] + " = " + gamePattern[currentLevel])
    if(userClickedPattern[gamePattern.length-1] == gamePattern[gamePattern.length-1]) {
        started = false;
        console.log("You completed the level!");
        setTimeout(function() {
            // Resetting userClickedPattern []
            userClickedPattern.splice(0, userClickedPattern.length);
            level++;
            $("h1").text("Level " + level);
            nextSequence();
            started = true;
        }, 1000);
    }
    else if(userClickedPattern[currentLevel] == gamePattern[currentLevel]) {
        console.log("Correct!");
    }
    else {
        started = false;
        var gameOverSound = new Audio("sounds/wrong.mp3");
        gameOverSound.play();
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("h1").text("Game Over, Press Any Key to Restart");
        console.log("Wrong");
        resetGame(); 

    }
} 

function resetGame() {
    gamePattern.splice(0, gamePattern.length);
    userClickedPattern.splice(0, userClickedPattern);
    level = 0;
}