let allTweets = [];

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
            for(var i = 0; i < arr.length; i++){
                allTweets.push({username: responseText.name, userlabel: responseText.userLabel, profilePic: responseText.profilePicURL, tweetText: arr[i]});
            }
            //console.log(allTweets);
            $('#AddHistory').append("<img src='" + responseText.profilePicURL + "' style='border-radius:50%;padding-left:8px;padding-right:8px;padding-top:8px;'>");
            search();
            $('#submitHandle').html("Done!");
            $('#submitHandle').attr("disabled",false);
            $('#submitHandle').html("Add");
        },
        error:function(error){
            console.log("Error")
            $('#submitHandle').html("Oops!");
        }
    })
}

function search(){
    if($('#searchTerm').val() != ""){
        var patterns = [$('#searchTerm').val()];
        var fields = {tweetText: true};    
        var results = smartSearch(allTweets, patterns, fields);
        console.log(results);

        //prepare to loop through results
        resultsHTML = "";
        var plotlyValues = [];
        var plotlyLabels = [];
        for(var j = 0; j < results.length; j++){
            resultsHTML += '<h5><img style="border-radius:50%;float:left" src="' + results[j].entry.profilePic +  '"><span style="font-weight:bold;padding-left:8px;">' + results[j].entry.userlabel + ' (<a href="https://twitter.com/' + results[j].entry.username +  '">@'+ results[j].entry.username + '</a>)</span><br><span style="font-size:75%;padding-left:8px">' + results[j].entry.tweetText +'</span></h5><hr>';
            
            if(plotlyLabels.includes(results[j].entry.username)){
                plotlyValues[results[j].entry.username]++;
            }
            else{
                plotlyLabels.push(results[j].entry.username);
                plotlyValues[results[j].entry.username] = 1;
            }
        }
        $('#searchResults').html(resultsHTML);

        var plotlyValueList = [];
        for(var k = 0; k < plotlyLabels.length; k++){
            plotlyValueList.push(plotlyValues[plotlyLabels[k]]);
        }

        //plotly
        console.log(plotlyValues);
        var data = [{
            values: plotlyValueList,
            labels: plotlyLabels,
            type: 'pie', 
            hole: .5,
            textinfo: "label+value",
            textposition: "inside",
        }];
          
        var layout = {
            showlegend: false,
            annotations: [
                {
                    font: {
                    size: 24
                    },
                    showarrow: false,
                    text: results.length,
                    x: 0.5,
                    y: 0.5
                },
            ],
            width: 128,
            height: 128,
            margin: {
                l: 8,
                r: 8,
                b: 8,
                t: 8,
                pad: 4
              },
        };

        var config = {
            modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'resetScale2d', 'hoverClosestGl2d', 'hoverClosestPie','toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox','hoverClosestCartesian', 'hoverCompareCartesian'], 
            displaylogo: false,
            responsive: true,
        };
          
        Plotly.newPlot('resultsDonut', data, layout, config);
    }
}