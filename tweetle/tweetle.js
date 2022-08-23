var turnCounter = 1; // track which turn it is
var correctAnswer = 0; // the correct number of likes
var currentGuess = 0; // the users last guess
resultsHTML = ""; // the HTML string that populates the tweet card

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
//end of modal handling --------------------------------------------------------------

//STATS initialization----------------------------------------------------------------
if(getCookie("tweetle_gamesPlayed") != ""){ // number of games completed in history
    var gamesPlayed = parseInt(getCookie("tweetle_gamesPlayed"));
    document.getElementById("gamesPlayed").innerHTML = "<hr>Played: " + gamesPlayed + "<br>";
    document.getElementById("goodLuck").innerHTML = "<br>";
}
else{
    var gamesPlayed = 0;
    //modal2.style.display = "block"; //pop instructions on first play, not nice on desktop
}
if(getCookie("tweetle_gamesWon") != ""){ // number of games won in history
    var gamesWon = parseInt(getCookie("tweetle_gamesWon"));
    document.getElementById("gamesWon").innerHTML = "Won: " + gamesWon + "<br>";
}
else{
    var gamesWon = 0;
}
var avgLossAmount = 0; //defined globally since it will not be calculated if there is no existing save data
if(getCookie("tweetle_sumOfLostDifferences") != ""){ // the sum of loss differences, used to calculate the mean
    var sumOfLostDifferences = parseInt(getCookie("tweetle_sumOfLostDifferences"));
    if(sumOfLostDifferences > 0){
        avgLossAmount = sumOfLostDifferences/(gamesPlayed-gamesWon);
    }
    document.getElementById("avgLossAmount").innerHTML = "Average Loss Amount: " + avgLossAmount + "<br>";
}
else{
    var sumOfLostDifferences = 0;
}
if(getCookie("tweetle_currentStreak") != ""){ // current number of consecutive wins
    var currentStreak = parseInt(getCookie("tweetle_currentStreak"));
    document.getElementById("currentStreak").innerHTML = "Current Streak: " + currentStreak + "<br>";
}
else{
    var currentStreak = 0;
}
if(getCookie("tweetle_maxStreak") != ""){ // current number of consecutive wins
    var maxStreak = parseInt(getCookie("tweetle_maxStreak"));
    document.getElementById("maxStreak").innerHTML = "Max Streak: " + maxStreak + "<br>";
}
else{
    var maxStreak = 0;
}

//var countOfHighGuesses = 0;
//var countOfLowGuesses = 0; // should we show a pie graph of too high vs too low
//var firstGuesses = []; // it could be cool to show mean, median, and mode first guess

var distributionOfWonGuesses = []; // do not show in dom, will be used by plotly graph upon game completion
for(var i = 1; i <= 6; i++){
    if(getCookie("tweetle_distribution" + i.toString()) != ""){
        distributionOfWonGuesses[i] = parseInt(getCookie("tweetle_distribution" + i.toString()));
        plotDist();
    }
    else{
        distributionOfWonGuesses[i] = 0;
    }
}
//end of stats------------------------------------------------------------------------

//check the URL to determine whether to use a given handle or randomly pick one
let params = (new URL(document.location)).searchParams;
let urlHandle = params.get('h'); // check the URL for forced handles

if(!!urlHandle){ //check if url handle is not null, then use the given handle
    var pickAUser = urlHandle;
}
else{ // otherwise, pick one randomly from the list
    let handleList = ["prattprattpratt","AnnaKendrick47","azizansari","chrissyteigen","VancityReynolds","ConanOBrien","SHAQ","TheEllenShow","JimGaffigan","SteveMartinToGo","amyschumer","RobertDowneyJr","ChrisEvans","MarkRuffalo","chrishemsworth","GrahamStephan","RealHughJackman","brielarson","TheRock","katyperry","jtimberlake","jimmyfallon","neiltyson","ActuallyNPH","ZooeyDeschanel","Pink","Nick_Offerman","BenAffleck","AvrilLavigne"];
    var pickAUser = handleList[Math.floor(Math.random() * handleList.length)]; // pick a random user from the list
}

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
                console.log("you lose");
                // Update Games Played, sum of loss differences, and streak
                gamesPlayed += 1;
                sumOfLostDifferences += Math.abs(correctAnswer-currentGuess);
                currentStreak = 0;
                updateCookiesAndDOM();

                document.getElementById("results").innerHTML = "<br>Sorry, the correct answer was " + correctAnswer.toString() + ".<br>You were off by " + (Math.abs(correctAnswer-currentGuess)).toString() + "!";
                setTimeout(function(){modal2.style.display = "block";},2000);
            }
        }

        //evaluate the guess
        if(currentGuess == correctAnswer){ //win condition
            console.log("you win");
            // Update Games Played, won, and streaks
            gamesPlayed += 1;
            gamesWon += 1;
            currentStreak += 1;
            if(currentStreak>maxStreak){
                maxStreak = currentStreak;
            }
            distributionOfWonGuesses[turnCounter-1] += 1;
            updateCookiesAndDOM();
            plotDist();
            //modal
            if(turnCounter-1 > 1){
                document.getElementById("results").innerHTML = "<br>Congratulations, you won after " + (turnCounter-1).toString() + " turns!";
            }
            else{
                document.getElementById("results").innerHTML = "<br>Wow, you got it on your first try!";
            }
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


//UPDATE STATS COOKIES AND DOM ELEMENTS after game end
function updateCookiesAndDOM(){
    document.getElementById("sendGuess").style.display = "none"; // get rid of the submit button
    document.getElementById("modalTitle").innerHTML = "Thank you for playing Tweetle";
    document.getElementById("goodLuck").innerHTML = "<br>";

    //stats
    setCookie("tweetle_gamesPlayed", gamesPlayed.toString());
    document.getElementById("gamesPlayed").innerHTML = "<hr>Played: " + gamesPlayed + "<br>";
    setCookie("tweetle_gamesWon", gamesWon.toString());
    document.getElementById("gamesWon").innerHTML = "Won: " + gamesWon + "<br>";
    setCookie("tweetle_sumOfLostDifferences", sumOfLostDifferences.toString());
    if(sumOfLostDifferences > 0){
        avgLossAmount = sumOfLostDifferences/(gamesPlayed-gamesWon);
    }
    document.getElementById("avgLossAmount").innerHTML = "Average Loss Amount: " + avgLossAmount + "<br>";
    setCookie("tweetle_currentStreak", currentStreak.toString());
    document.getElementById("currentStreak").innerHTML = "Current Streak: " + currentStreak + "<br>";
    setCookie("tweetle_maxStreak", maxStreak.toString());
    document.getElementById("maxStreak").innerHTML = "Max Streak: " + maxStreak + "<br>";
    setCookie("tweetle_distribution" + (turnCounter-1).toString(), distributionOfWonGuesses[turnCounter-1].toString()); // dom updated via plotly function
}

//COOKIE FUNCTIONS
function setCookie(cname, cvalue) {
    var exdays = 36525;
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

//PLOT DISTRIBUTION 
function plotDist(){
    var distributionXData = [];
    for(var n = 1; n <= 6; n++){
        distributionXData.push(distributionOfWonGuesses[n]);
    }
    var distChartData = [
        {
            type: 'bar',
            x: distributionXData,
            y: [1,2,3,4,5,6],
            orientation: 'h',
            textposition: 'inside',
            text: distributionXData,
        }
      ];
    var config = {
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'resetScale2d', 'hoverClosestGl2d', 'hoverClosestPie','toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox','hoverClosestCartesian', 'hoverCompareCartesian','toImage'], 
        displaylogo: false,
        responsive: true,
    };
    var layout = {
        width: 440,
        height: 200,
        yaxis: {
            tick0: 1,
            dtick: 1,
            tickfont: {
                family: 'Roboto, sans-serif',
                size: 14,
            },
            fixedrange: true,
        },
        xaxis:{
            showgrid: false,
            fixedrange: true,
        },
        margin: {
            l: 40,
            r: 100,
            b: 20,
            t: 0,
            pad: 16,
        },
        font: {
            size: 12,
            family: 'Roboto, sans-serif',
        }
    };
      
    Plotly.newPlot('distrbutionChart', distChartData, layout, config);
}