let resp = [];

function generateFunction(){
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + $('#user').val() + '&replies=1&search=';
    $.ajax({
        url: Url,
        type:"GET",
        beforeSend: function(){
            console.log(Url)
            $('#submitHandle').attr("disabled",true);
            $('#submitHandle').html("Training..");  
        },
        success: function(responseText){
            resp = responseText.tweetBodies;
            console.log(responseText);

            $('#submitHandle').html("Done!");

            $('#AskATwitterUser').html("Ask a Twitter User    " + "<img src='" + responseText.profilePicURL + "' style='vertical-align: middle;'>");

            document.getElementById("user").style.display = "none";
            document.getElementById("submitHandle").style.display = "none";
            document.getElementById("tweettext").style.display = "inline";
            document.getElementById("predictButton").style.display = "inline";
        },
        error:function(error){
            console.log("Error")
            $('#submitHandle').html("Oops!");
        }
    })
}

async function askAQuestion(quest) {
    $('#predictButton').html("Thinking..");
    
    let stringTweets = ""
    for (let i = 0; i < resp.length; i++){
        stringTweets = stringTweets + resp[i] + ". "
    }

    const passage = stringTweets;
    const question = quest;
    //console.log("Passage: " + passage);
    console.log("Question: " + question);
    const model = await qna.load();
    const answers = await model.findAnswers(question, passage);
    console.log(answers);

    let answerText = "";
    for(var i = 0; i < answers.length; i++){
        answerText += answers[i].text + ", Confidence: " + Math.round(answers[i].score) + "%<br>";
    }

    $('#CurrentAnswers').html("<p>" + answerText + "</p>");

    $('#predictButton').html("Ask");
}