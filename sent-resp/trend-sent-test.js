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
            $('#submitHandle').html("Analyze");  
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

    let temp_trend_x_data = resp.trend_sentiment_score.reverse();

    var trace1 = {
        x: temp_trend_x_data,
        y: resp.trend_likes,
        //text: trend_tweet_text,
        name: "Likes",
        type: 'scatter',
        mode: 'markers',
        line: {
            color: 'rgb(224, 36, 94)',
        }
    };
    var trace2 = {
        x: temp_trend_x_data,
        y: resp.trend_retweets,
        name: "Retweets",
        mode: 'markers',
        line: {
            color: 'rgb(23, 191, 99)'
        }
    };

    var dataTrend = [trace1, trace2];

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
            showline: false,
            title: {
                text: 'Sentiment Score',
            },
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