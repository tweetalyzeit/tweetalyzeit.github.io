function generateFunction(){
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + $('#user').val() + '&replies=1&search=';
    $.ajax({
        url: Url,
        type:"GET",
        beforeSend: function(){
            console.log(Url)
            $('#submitHandle').attr("disabled",true);
            $('#submitHandle').html("Classifying..");  
        },
        success: function(responseText){
            console.log(responseText)
            var resp = responseText;

            classifyPic(resp);
            $('#submitHandle').html("Done!");
            $('#submitHandle').attr("disabled",false);
            $('#submitHandle').html("Classify");  
        },
        error:function(error){
            console.log("Error")
            $('#submitHandle').html("Oops!");
        }
    })
}

function classifyPic(resp) {

    $("#Result").html('<img id="img" src="' + resp.profilePicURL + '" crossorigin="anonymous"></img>');
    const img = document.getElementById('img');

    // Load the model.
    mobilenet.load().then(model => {
      // Classify the image.
      model.classify(img).then(predictions => {
        console.log('Predictions: ');
        console.log(predictions);
        $("#Result").html('<img id="img" src="' + resp.profilePicURL + '" crossorigin="anonymous"></img><br><br><p>Guess 1: ' + predictions[0].className + '</p><p>Guess 2: ' + predictions[1].className + '</p><p> Guess 3: ' + predictions[2].className + '</p>');
      });
    });
}