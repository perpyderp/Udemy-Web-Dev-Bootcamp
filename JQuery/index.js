
$("body").css("background-color", "black");
$("h1").css("color", "red");

$("a").attr("href", "https://www.yahoo.com");

// changes h1 elements to blue on click
// $("h1").click(function() {
//     $("h1").css("color", "blue");
// });

// Change h1 to purple with buttons
// $("button").click(function() {
//     $("h1").css("color", "purple");
// });

// Detects any key pressed and changes h1
// $(document).keypress(function (event) {
//     $("h1").text(event.key);
// });

// Change h1 color on mouseover
// $("h1").on("mouseover", function() {
//     $("h1").css("color", "purple");
// })

// Hide h1 element
// $("button").on("click", function() {
//     $("h1").toggle();
// })

$("button").on("click", function() {
    $("h1").animate({opacity: 0.5});
})