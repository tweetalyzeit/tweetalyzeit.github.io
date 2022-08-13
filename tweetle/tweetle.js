var turnCounter = 1; // track which turn it is
var correctAnswer = 0; // the correct number of likes
var currentGuess = 0; // the users last guess
resultsHTML = ""; // the HTML string that populates the tweet card

//let handleList = ["ABC", "CBSNews", "CNN","FoxNews", "MSNBC", "NBCNews", "nytimes","USATODAY","WSJ","washingtonpost","business","VICENews","HuffPost","TMZ","CNET","NPR","THR","Newsweek","NewYorker","TIME", "usnews","guardian","BBCWorld","latimes","chicagotribune"];
let handleList = ["elonmusk", "prattprattpratt","AnnaKendrick47","azizansari","chrissyteigen","VancityReynolds","mindykaling","ConanOBrien","evilhag","SHAQ","TheEllenShow","JimGaffigan","GabbySidibe","kristenschaaled","bjnovak","oliviamunn","SteveMartinToGo","WhitneyCummings","rickygervais","tommychong","amyschumer"];
var pickAUser = handleList[Math.floor(Math.random() * handleList.length)]; // pick a random user from the list

generateFunction(pickAUser);

function generateFunction(handle){
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + handle + '&search=';
    $.ajax({
        url: Url,
        type:"GET",
        beforeSend: function(){
            console.log(Url)
        },
        success: function(responseText){
            console.log(responseText)
            var arr = responseText.tweetBodies; // store all tweet text
            var sortedLikes = responseText.trend_likes.reverse(); // reverse the like data to be ordered in line with tweet bodies

            var pickATweet = Math.floor(Math.random() * arr.length); //pick a random tweet from this user's sample

            correctAnswer = sortedLikes[pickATweet];
            console.log("Correct Answer: " + correctAnswer);
            var myDate = new Date(responseText.dates[pickATweet]); // get the specific tweet's timestamp
            resultsHTML = '<h5><img style="border-radius:50%;float:left" src="' + responseText.profilePicURL +  '"><span style="font-weight:bold;padding-left:8px;">' + responseText.userLabel + ' (<a href="https://twitter.com/' + responseText.name +  '" target="_blank">@'+ responseText.name + '</a>)</span><br><span style="font-size:75%;padding-left:8px;"><a style="color:grey;" href="https://twitter.com/' + responseText.name + '/status/' + responseText.tweetIDs[pickATweet] + '" target="_blank">' + myDate.toLocaleString() + '</a></span><br><span style="font-size:75%;">' + arr[pickATweet] +'</span></h5>';
            $('#searchResults').html(resultsHTML);
        },
        error:function(error){
            console.log("Error")
        }
    })
}

function checkGuess(){

    currentGuess = document.getElementById("guess" + turnCounter.toString()).value;
    console.log("Current Guess: " + currentGuess);

    //check if the input is empty before proceeding
    isEmpty = currentGuess.toString().length;
    console.log("Is Empty? 0  means yes: " + isEmpty);

    if(isEmpty != 0){
        if(currentGuess == correctAnswer){ //win condition
            console.log("you win");
            document.getElementById("sendGuess").style.display = "none";
            document.getElementById("guess" + turnCounter.toString()).type = "text";
            document.getElementById("guess" + turnCounter.toString()).disabled = true;
            document.getElementById("guess" + turnCounter.toString()).style.backgroundColor = "#A6ECA8";
            document.getElementById("guess" + turnCounter.toString()).value = currentGuess.toString() + ": " + "That's correct! You win!";
            document.getElementById("progressBar").style="height:16px;width:100%;background-color:#A6ECA8;border-radius:10px;";
        }
        else{ //if the player did not guess the correct answer
            document.getElementById("guess" + turnCounter.toString()).type = "text";
            document.getElementById("guess" + turnCounter.toString()).disabled = true;
            document.getElementById("guess" + turnCounter.toString()).style.backgroundColor = "#EAE4A6";
            if(currentGuess < correctAnswer){ // guess is too low
                console.log("go higher");
                document.getElementById("guess" + turnCounter.toString()).value = currentGuess.toString() + ": " + "Too low!";
                document.getElementById("progressBar").style="height:16px;width:" + (currentGuess/correctAnswer)*100 + "%;background-color:#1D9BF0;border-radius:10px;";
            }
            else{ // guess is too high
                console.log("go lower");
                document.getElementById("guess" + turnCounter.toString()).value = currentGuess.toString() + ": " + "Too high!";
                document.getElementById("progressBar").style="height:16px;width:" + ((correctAnswer/currentGuess)*100).toString() + "%;background-color:#1D9BF0;border-radius:10px;";
            }

            if(turnCounter < 6){ // get the next guess input ready
                turnCounter += 1;
                document.getElementById("guess" + turnCounter.toString()).disabled = false;
                document.getElementById("guess" + turnCounter.toString()).placeholder = "Guess how many likes...";
                document.getElementById("guess" + turnCounter.toString()).focus();
            }
            else{ // no more guesses, player loses
                console.log("you lose")
                document.getElementById("sendGuess").style.display = "none";
            }
            
        }
    }
}

// submit guess if enter key is hit
document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        checkGuess();
    }
});


// MODAL HANDLING --------------------------------------------------------------------

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
}
//SECOND MODAL  
var modal2 = document.getElementById("myModal2");
var btn2 = document.getElementById("myBtn2");
var span2 = document.getElementsByClassName("close")[1];
btn2.onclick = function() {
  modal2.style.display = "block";
}