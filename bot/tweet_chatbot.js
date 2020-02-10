$(document).ready(function() {
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + $('#user').val() + '&replies=1&search=';
    $('.btn').click(function(){
        $.ajax({
            url: Url,
            type:"GET",
            beforeSend: function(){
                console.log(Url)
                $('#.btn').attr("disabled",true);
                $('#.btn').html("Loading");  
            },
            success: function(responseText){
                console.log(responseText)
                $('#.btn').html("Done!");
            },
            error:function(error){
                console.log("Error")
            }
        })
    })
})

/*
$(document).ready(function() {
    $("#tweetForm").ajaxForm({
        url: 'https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + $('#user').val() + '&replies=1',
        type: 'get', 
        beforeSend: function() {
            $('#tweetSubmit').attr("disabled",true);
            $('#tweetSubmit').html("Loading");  
            console.log('https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + $('#user').val() + '&replies=1');
            $("#currentDate").html(new Date().toString());
        },
        success: function(responseText, statusText, xhr, $form) {
            console.log(responseText);
            $('#tweetSubmit').attr("disabled",false);
            $('#tweetSubmit').html("Submit");
            
            console.log(responseText.name);
        }
    })
});*/