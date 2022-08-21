var customLink = "";
var username = "";

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
            resultsHTML = '<h5><img style="border-radius:50%;float:left" src="' + responseText.profilePicURL +  '"><span style="font-weight:bold;padding-left:8px;"><a style="color:black;" href="https://twitter.com/' + responseText.name +  '" target="_blank">' + responseText.userLabel + '</a></span><br><span style="font-size:75%;padding-left:8px;color:grey;"><a style="color:grey;" href="https://twitter.com/' + responseText.name +  '" target="_blank">@' + responseText.name + '</span></h5>';
            $('#searchResults').html(resultsHTML);
            if(responseText.name != "User not found"){
                customLink = "https://tweetalyze.com/tweetle/?h=" + responseText.name;
                username = responseText.name;
                document.getElementById("play").style.display = "block";
                document.getElementById("share").style.display = "block";
                document.getElementById("copy").style.display = "block";
            }
            else{
                document.getElementById("play").style.display = "none";
                document.getElementById("share").style.display = "none";
                document.getElementById("copy").style.display = "none";
            }
        },
        error:function(error){
            console.log("Error");
        }
    })
}

function play(){
    window.open(customLink, "_blank");
}

function share(){
    const shareData = {
        title: 'Tweetle',
        text: 'Try playing Tweetle using @' + username + "'s tweets!\n",
        url: customLink
    }
    navigator.share(shareData);
}

function copy(){
    navigator.clipboard.writeText(customLink);
    document.getElementById("copy").innerHTML = "Copied!";
}