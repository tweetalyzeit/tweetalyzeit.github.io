function generateFunction(){
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + $('#user').val() + '&replies=1&search=';
    $.ajax({
        url: Url,
        type:"GET",
        beforeSend: function(){
            console.log(Url)
            $('#submitHandle').attr("disabled",true);
            $('#submitHandle').html("Analyzing..");  
        },
        success: function(responseText){
            console.log(responseText)
            var resp = responseText;

            trendTheData(resp);
            $('#submitHandle').html("Done!");
            $('#submitHandle').attr("disabled",false);
            $('#submitHandle').html("Run");  
        },
        error:function(error){
            console.log("Error")
            $('#submitHandle').html("Oops!");
        }
    })
}

function trendTheData(resp) {

    //graph the trends
    $("#TrendLine").html('');

    let temp_trend_x_data = resp.dates.reverse();
    let temp_trend_tweet_text = resp.tweetBodies.reverse();
    let trend_tweet_text =[];
    let trend_fake = [];
    for(let i = 0; i < resp.sampleSize; i++){
        temp_slot = "";
        for(let j = 0; j < temp_trend_tweet_text[i].length; j++){
            if(j!= 0 && j%56 == 0){
                temp_slot += temp_trend_tweet_text[i][j] + "<br>";
            }
            else{
                temp_slot += temp_trend_tweet_text[i][j];
            }
        }
        trend_tweet_text.push(temp_slot);       
        trend_fake.push(0);
    }

    var trace1 = {
        x: temp_trend_x_data,
        y: resp.trend_sentiment_score,
        name: "Sentiment Score",
        mode: 'lines',
        line: {
            color: 'rgb(29, 161, 242)'
        }
    };

    var trace3 = {
        x: temp_trend_x_data,
        y: trend_fake,
        text: trend_tweet_text,
        name: "",
        mode: 'lines',
        opacity: 0,
        hovertemplate: '%{x}' + '<br><i>%{text}</i>',
        line: {
            color: 'rgb(29, 161, 242)'
        }
    };

    var dataTrend = [trace1, trace3];

    var configTrend = {
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'resetScale2d', 'hoverClosestGl2d', 'hoverClosestPie','toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox','hoverClosestCartesian', 'hoverCompareCartesian'], 
        displaylogo: false,
        responsive: true
    };
    var layoutTrend = {
        yaxis: {
            
        },
        xaxis: {
            //showticklabels: false,
            zeroline: false,
            showline: false
        },
        legend: {
            "orientation": "v",
            x: 0.5,
            y: 1.27
        },
        images: [
            {
              x: 0,
              y: 1.1,
              sizex: 0.2,
              sizey: 0.2,
              source: resp.profilePicURL,
              xanchor: "middle",
              xref: "paper",
              yanchor: "bottom",
              yref: "paper"
            }
          ]
    };

    Plotly.newPlot("TrendLine", dataTrend, layoutTrend, configTrend);
}