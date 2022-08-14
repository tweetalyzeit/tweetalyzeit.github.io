var turnCounter = 1; // track which turn it is
var correctAnswer = 0; // the correct number of likes
var currentGuess = 0; // the users last guess
resultsHTML = ""; // the HTML string that populates the tweet card

//let handleList = ["ABC", "CBSNews", "CNN","FoxNews", "MSNBC", "NBCNews", "nytimes","USATODAY","WSJ","washingtonpost","business","VICENews","HuffPost","TMZ","CNET","NPR","THR","Newsweek","NewYorker","TIME", "usnews","guardian","BBCWorld","latimes","chicagotribune"];
let handleList = ["prattprattpratt","AnnaKendrick47","azizansari","chrissyteigen","VancityReynolds","ConanOBrien","SHAQ","TheEllenShow","JimGaffigan","oliviamunn","SteveMartinToGo","amyschumer","RobertDowneyJr","ChrisEvans","MarkRuffalo","chrishemsworth","GrahamStephan","RealHughJackman","brielarson","TheRock","katyperry","jtimberlake","jimmyfallon","neiltyson","ActuallyNPH","ZooeyDeschanel","Pink","Nick_Offerman"];
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
            //var sortedLikes = responseText.trend_likes.reverse(); // reverse the like data to be ordered in line with tweet bodies
            var sortedRetweets = responseText.trend_retweets.reverse(); // reverse the RT data to be ordered in line with tweet bodies

            var pickATweet = Math.floor(Math.random() * arr.length); //pick a random tweet from this user's sample
            //correctAnswer = sortedLikes[pickATweet];
            correctAnswer = sortedRetweets[pickATweet];
            console.log("Correct Answer: " + correctAnswer);

            var myDate = new Date(responseText.dates[pickATweet]); // get the specific tweet's timestamp
            resultsHTML = '<h5><img style="border-radius:50%;float:left" src="' + responseText.profilePicURL +  '"><span style="font-weight:bold;padding-left:8px;"><a style="color:black;" href="https://twitter.com/' + responseText.name +  '" target="_blank">' + responseText.userLabel + '</a></span><br><span style="font-size:75%;padding-left:8px;color:grey;"><a style="color:grey;" href="https://twitter.com/' + responseText.name +  '" target="_blank">@' + responseText.name + '<br><a style="color:grey;" href="https://twitter.com/' + responseText.name + '/status/' + responseText.tweetIDs[pickATweet] + '" target="_blank">' + myDate.toLocaleString() + '</a></span><br><span style="font-size:75%;">' + arr[pickATweet] +'</span></h5>';
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
    //console.log("Is Empty? 0  means yes: " + isEmpty);

    if(isEmpty != 0 && currentGuess>=0){

        document.getElementById("guess" + turnCounter.toString() + "bar").className = "";
        document.getElementById("guess" + turnCounter.toString() + "bar").innerHTML = "<div id='progressbarcontainer" + turnCounter.toString() +  "'class='progress input-group mb-3' style='height:calc(1.5em + 1rem + 2px);font-size:1.25rem;border-radius:0.3rem;'><div id='progressbar" + turnCounter.toString() +"' class='progress-bar' role='progressbar' style='width:0%;color:#495057;background-color: #EAE4A6;transition: width 1s ease 0s;'><div style='padding:.5rem 1rem;text-align: left;'>" + currentGuess.toString() + "</div></div></div>";

        //dummy text to force the progress bar to work
        document.getElementById("guess7").disabled = false;
        document.getElementById("guess7").placeholder = "Guess how many retweets...";
        document.getElementById("guess7").focus();

        //setup the next turn or declare the game over
        turnCounter += 1;
        if(currentGuess != correctAnswer){
            if(turnCounter <= 6){ // get the next guess input ready unless the player is winning
                document.getElementById("guess" + turnCounter.toString()).disabled = false;
                document.getElementById("guess" + turnCounter.toString()).placeholder = "Guess how many retweets...";
                document.getElementById("guess" + turnCounter.toString()).focus();
            }
            else{ // no more guesses, player loses
                console.log("you lose")
                document.getElementById("sendGuess").style.display = "none";
                document.getElementById("modalTitle").innerHTML = "Thank you for playing Tweetle";
                document.getElementById("results").innerHTML = "<br>Sorry, the correct answer was " + correctAnswer.toString() + ".<br>You were off by " + (Math.abs(correctAnswer-currentGuess)).toString() + "!<br><br>";
                setTimeout(function(){modal2.style.display = "block";},2000);
            }
        }

        //evaluate the guess
        if(currentGuess == correctAnswer){ //win condition
            console.log("you win");
            document.getElementById("sendGuess").style.display = "none";
            //modal
            document.getElementById("modalTitle").innerHTML = "Thank you for playing Tweetle";
            document.getElementById("results").innerHTML = "<br>Congratulations, you won after " + (turnCounter-1).toString() + " turns!<br><br>";
            setTimeout(function(){modal2.style.display = "block";},2000);
            //progress bar
            document.getElementById("progressbar" + (turnCounter-1).toString()).style.width = "100%";
            setTimeout(function(){document.getElementById("progressbar" + (turnCounter-1).toString()).style.backgroundColor = "#A6ECA8";document.getElementById("progressbarcontainer" + (turnCounter-1).toString()).style.animation = "pulse 1s";}, 1000);
        }
        else if(currentGuess < correctAnswer){ // if the previous guess was too low
            console.log("go higher");
            document.getElementById("progressbar" + (turnCounter-1).toString()).style.width = ((currentGuess/correctAnswer)*100).toString() + "%"; 
        }
        else{ // if the previous guess was too high
            console.log("go lower");
            document.getElementById("progressbar" + (turnCounter-1).toString()).style.width = "100%";
            setTimeout(function(){document.getElementById("progressbar" + (turnCounter-1).toString()).style.backgroundColor = "#E8A4A4";document.getElementById("progressbarcontainer" + (turnCounter-1).toString()).style.animation = "shake 0.5s";}, 1000);
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