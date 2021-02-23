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

    // https://stackoverflow.com/questions/28269021/how-do-i-create-a-best-fit-polynomial-curve-in-javascript
    /*var x = resp.trend_sentiment_score;
    var y = resp.trend_likes;

    order = 3;

    var xMatrix = [];
    var xTemp = [];
    var yMatrix = numeric.transpose([y]);

    for (j=0;j<x.length;j++)
    {
        xTemp = [];
        for(i=0;i<=order;i++)
        {
            xTemp.push(1*Math.pow(x[j],i));
        }
        xMatrix.push(xTemp);
    }

    var xMatrixT = numeric.transpose(xMatrix);
    var dot1 = numeric.dot(xMatrixT,xMatrix);
    var dotInv = numeric.inv(dot1);
    var dot2 = numeric.dot(xMatrixT,yMatrix);
    var solution = numeric.dot(dotInv,dot2);
    console.log("Coefficients a + bx^1 + cx^2...")
    console.log(solution);*/

    //construct the normal curve - https://chartio.com/resources/tutorials/how-to-create-a-bell-curve/
    /*var temp_curve_xaxis = [];
    var temp_curve_likes = [];
    var term1 = 1/(resp.math_std_sentiment_score*Math.sqrt(2*Math.PI));
    lowX = Math.min(...resp.trend_sentiment_score);
    highX = Math.max(...resp.trend_sentiment_score);
    for(j = lowX; j <= highX; j++){
        temp_curve_xaxis.push(j);
        var term2 = (j-resp.math_mean_sentiment_score)/resp.math_std_sentiment_score;
        var term3 = Math.pow(term2,2);
        var term4 = -0.5*term3;
        var term5 = term1 * Math.pow(Math.E, term4);
        temp_curve_likes.push(term5*Math.max(...resp.trend_likes));
    }*/

    /// plot the averages for each sentiment score
    var temp_curve_xaxis = [];
    var temp_curve_likes = [];
    var temp_curve_retweets = [];
    var temp_like_sum = [];
    var temp_retweet_sum = [];
    var temp_count = [];
    lowX = Math.min(...resp.trend_sentiment_score);
    highX = Math.max(...resp.trend_sentiment_score);
    
    //initialize the arrays to use for calculating mean likes per sentiment score
    for(j = lowX; j <= highX; j++){
        temp_like_sum[j] = 0;
        temp_retweet_sum[j] = 0;
        temp_count[j] = 0;
    }
    //populate arrays to use for calculating mean likes per sentiment score
    for(i=0; i < resp.trend_sentiment_score.length; i++){
        temp_like_sum[resp.trend_sentiment_score[i]] += resp.trend_likes[i];
        temp_retweet_sum[resp.trend_sentiment_score[i]] += resp.trend_retweets[i];
        temp_count[resp.trend_sentiment_score[i]] += 1;
        //console.log(resp.trend_sentiment_score[i] + ": " + temp_like_sum[resp.trend_sentiment_score[i]]);
    }
    //feed the averages into an array
    for(k = lowX; k <= highX; k++){
        temp_curve_xaxis.push(k);
        temp_curve_likes.push(temp_like_sum[k]/temp_count[k]);
        temp_curve_retweets.push(temp_retweet_sum[k]/temp_count[k]);
    }    

    //Plotly graph
    var trace1 = {
        x: resp.trend_sentiment_score,
        y: resp.trend_likes,
        name: "Likes",
        type: 'scatter',
        mode: 'markers',
        line: {
            color: 'rgb(224, 36, 94)',
        }
    };
    var trace2 = {
        x: resp.trend_sentiment_score,
        y: resp.trend_retweets,
        name: "Retweets",
        mode: 'markers',
        line: {
            color: 'rgb(23, 191, 99)'
        }
    };
    var trace3 = {
        x: temp_curve_xaxis,
        y: temp_curve_likes,
        name: "Mean Likes",
        mode: 'lines',
        type: 'bar',
        opacity: 0.5,
        line: {
            color: 'rgb(224, 36, 94)',
            shape: 'spline',
            dash: 'dash',
        }
    };
    var trace4 = {
        x: temp_curve_xaxis,
        y: temp_curve_retweets,
        name: "Mean Retweets",
        mode: 'lines',
        type: 'bar',
        opacity: 0.5,
        line: {
            color: 'rgb(23, 191, 99)',
            shape: 'spline',
            dash: 'dash',
        }
    };

    //var dataTrend = [trace1, trace2, trace3, trace4];
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