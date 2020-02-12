// Markov generated tweets using the Tweetalyze Twitter API engine
// Algorith based on Markov tutorial by Alex Kramer https://medium.com/@alexkrameris/markov-chain-implementation-in-javascript-a698f371d66f

function generateFunction(){
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + $('#user').val() + '&replies=1&search=';
    $.ajax({
        url: Url,
        type:"GET",
        beforeSend: function(){
            console.log(Url)
            $('#submitHandle').attr("disabled",true);
            $('#submitHandle').html("Loading");  
        },
        success: function(responseText){
            console.log(responseText)
            var arr = responseText.tweetBodies;
            var username = responseText.name;
            var url = responseText.profilePicURL;
            var name = responseText.userLabel;
            console.log("Markov Start")
            markovMe(arr, username, url, name);
            console.log("Markov End")
            $('#submitHandle').html("Done!");
            $('#submitHandle').attr("disabled",false);
            $('#submitHandle').html("Generate");
        },
        error:function(error){
            console.log("Error")
            $('#submitHandle').html("Oops!");
        }
    })
}

function markovMe(arr, username, url, name) {
    const markovChain = {}

    let stringTweets = ""

    for (let i = 0; i < arr.length; i++){
        stringTweets = stringTweets + arr[i] + ". "
    }

    const textArr = stringTweets.split(' ')
    for (let i = 0; i < textArr.length; i++) {
      let word = textArr[i].toLowerCase().replace(/[\W_]/, "")
      let httpCheck = word.includes("http")
      if (!httpCheck){
        if (!markovChain[word]) {
            markovChain[word] = []
            }
        if (textArr[i + 1]) {
            markovChain[word].push(textArr[i + 1].toLowerCase().replace(/[\W_]/, ""));
            }
        }
     }
    const words = Object.keys(markovChain)
    let word = words[Math.floor(Math.random() * words.length)]
    let result = ''
    for (let i = 0; i < words.length; i++ ) {
      result += word + ' ';
      newWord =  markovChain[word][Math.floor(Math.random() * markovChain[word].length)]
      word = newWord;
      if (!word || !markovChain.hasOwnProperty(word)) word = words[Math.floor(Math.random() * words.length)]
    }
    
    let tweetLength = Math.floor(Math.random() * 281); // returns a random integer from 0 to 280
    for(var l = tweetLength; l > 0; l--){
        if(result.substring(l, l+1) == " "){
            tweetLength = l;
            l = 0;
        }
    }
    document.getElementById('markovResults').innerText = result.substring(0, tweetLength);
    
    document.getElementById('markovUN').innerText = name;
    document.getElementById('markovHandle').innerText = "@" + username;
    var dt = new Date();
    document.getElementById("datetime").innerHTML = dt.toLocaleString() + " · Tweetalyze Tweet Imitator";
    document.getElementById("profilePic").src = url;
}