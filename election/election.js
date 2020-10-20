let respBiden = [];
let respTrump = [];

function generateFunction(){
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel&user=JoeBiden&replies=1&search=';
    $.ajax({
        url: Url,
        type:"GET",
        beforeSend: function(){
            console.log(Url)
        },
        success: function(responseText){
            console.log(responseText)
            //var resp = responseText;
            respBiden = responseText;
            //trendTheData(resp);
            getTrump();
        },
        error:function(error){
            console.log("Error")
        }
    })
}
function getTrump(){
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel&user=realDonaldTrump&replies=1&search=';
    $.ajax({
        url: Url,
        type:"GET",
        beforeSend: function(){
            console.log(Url)
        },
        success: function(responseText){
            console.log(responseText)
            respTrump = responseText;
            //graphTrump(resp);
            graph(respBiden, respTrump);
        },
        error:function(error){
            console.log("Error")
        }
    })
}

function graph(respBiden, respTrump){

    var trace1 = {
        x: ['Biden', 'Trump'],
        y: [respBiden.math_mean_likes, respTrump.math_mean_likes],
        name: 'Likes',
        type: 'bar',
        marker: {color: 'rgb(224, 36, 94)'},
        text: [Math.round(respBiden.math_mean_likes), Math.round(respTrump.math_mean_likes)],
        textposition: 'auto',
        textfont: {color: '#FFFFFF'}
      };
      
      var trace2 = {
        x: ['Biden', 'Trump'],
        y: [respBiden.math_mean_retweets, respTrump.math_mean_retweets],
        name: 'Retweets',
        type: 'bar',
        marker: {color: 'rgb(23, 191, 99)'},
        text: [Math.round(respBiden.math_mean_retweets), Math.round(respTrump.math_mean_retweets)],
        textposition: 'auto',
        textfont: {color: '#FFFFFF'}
      };
      
      var data = [trace1, trace2];
      
      var layout = {barmode: 'group',showlegend: false,
        xaxis: {
            autorange: true,
            showgrid: false,
            //zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: true
        },
        yaxis: {
            //autorange: true,
            //showgrid: false,
            //zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false
        },
        title: {
            text:'Average Tweet Reception',
            font: {
              family: 'Courier New, monospace',
              size: 24
            },
            xref: 'paper',
            x: 0.5,
          },

        };

      var config = {
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'resetScale2d', 'hoverClosestGl2d', 'hoverClosestPie','toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox','hoverClosestCartesian', 'hoverCompareCartesian'], 
        displaylogo: false,
        responsive: true,
        };
      
      Plotly.newPlot('BarGraph', data, layout, config);
}

function graphTrump(resp){
    var data = [{
        values: [resp.num_replies, resp.sampleSize-resp.num_replies],
        labels: ['Replies', 'Tweets'],
        type: 'pie', 
        hole: .6,
        textinfo: "label+percent",
        textposition: "outside",
      }];
      
      var layout = {
        showlegend: false,
        annotations: [
            {
              font: {
                size: 20
              },
              showarrow: false,
              text: resp.sampleSize,
              x: 0.5,
              y: 0.5
            },
          ],
      };

      var config = {
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'resetScale2d', 'hoverClosestGl2d', 'hoverClosestPie','toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox','hoverClosestCartesian', 'hoverCompareCartesian'], 
        displaylogo: false,
        responsive: true,
        };
      
    Plotly.newPlot('TrumpDonut', data, layout, config);
}