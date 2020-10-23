function generateFunction(){
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + $('#user').val() + '&replies=1&search=';
    $.ajax({
        url: Url,
        type:"GET",
        beforeSend: function(){
            console.log(Url)
            $('#submitHandle').attr("disabled",true);
            $('#submitHandle').html("Thinking..");  
        },
        success: function(responseText){
            console.log(responseText);
            console.log(Math.round(responseText.math_mean_sentiment_score));
            switch(Math.round(responseText.math_mean_sentiment_score)){
                case -5: $('#Emoji').html("😭"); break;
                case -4: $('#Emoji').html("😢"); break;
                case -3: $('#Emoji').html("😧"); break;
                case -2: $('#Emoji').html("😦"); break;
                case -1: $('#Emoji').html("🙁"); break;
                case 0: $('#Emoji').html("😐"); break;
                case 1: $('#Emoji').html("🙂"); break;
                case 2: $('#Emoji').html("😊"); break;
                case 3: $('#Emoji').html("😀"); break;
                case 4: $('#Emoji').html("😄"); break;
                case 5: $('#Emoji').html("🥰"); break;
                default: $('#Emoji').html("⚠️"); break;
            }
            if(responseText.math_mean_sentiment_score < -5){
                $('#Emoji').html("😭");
            }
            else if(responseText.math_mean_sentiment_score > 5){
                $('#Emoji').html("🥰");
            }

            $('#submitHandle').html("Done!");
            $('#submitHandle').attr("disabled",false);
            $('#submitHandle').html("Rate");  
        },
        error:function(error){
            console.log("Error")
            $('#submitHandle').html("Oops!");
        }
    })
}