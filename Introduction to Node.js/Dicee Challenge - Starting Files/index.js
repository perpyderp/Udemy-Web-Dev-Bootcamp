
var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomNumber2 = Math.floor(Math.random() * 6) + 1;

// alert("Player 1 rolled: " + randomNumber1);
// alert("Player 2 rolled: " + randomNumber2);
changeImage(randomNumber1, 0);
changeImage(randomNumber2, 1);

determineWinner(randomNumber1, randomNumber2);

function changeImage(number, image) {
    if(number == 1) {
        document.querySelectorAll("img")[image].setAttribute("src", "images/dice1.png");
    }
    else if(number == 2) {
        document.querySelectorAll("img")[image].setAttribute("src", "images/dice2.png");
    }
    else if(number == 3) {
        document.querySelectorAll("img")[image].setAttribute("src", "images/dice3.png");
    }
    else if(number == 4) {
        document.querySelectorAll("img")[image].setAttribute("src", "images/dice4.png");
    }
    else if(number == 5) {
        document.querySelectorAll("img")[image].setAttribute("src", "images/dice5.png");
    }
    else if(number == 6) {
        document.querySelectorAll("img")[image].setAttribute("src", "images/dice6.png");
    }
    else {
        alert("Something went wrong choosing dice image");
    }
}

function determineWinner(number1, number2) {
    if(number1 > number2) {
        document.querySelector("h1").innerHTML = "🚩Player 1 Wins!";
    }
    else if(number2 > number1) {
        document.querySelector("h1").innerHTML = "Player 2 Wins!🚩";
    }
    else {
        document.querySelector("h1").innerHTML = "Draw";
    }
}