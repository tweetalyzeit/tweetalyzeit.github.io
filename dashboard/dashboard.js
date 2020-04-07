// Create Tweetalyze Dashboard

let csvString = "Timestamp,Username,Include Replies?,Include Retweets?,Search Term,Sample Size,Number of Retweets,Percent Retweets,Number of Replies,Percent Replies,Time Since Last Tweet (Days),Average Frequency (Tweets/Day),Average Period Between Tweets (Hours),Average Tweet Length (Characters),Unique Words,Tweets Including Search Term,Followers,Following,Average Tweet Likes,Average Tweet Retweets,Tweet Clients\n";
let wordCloudString = "";
let inclRetweets = "";
let inclReplies = "";
let array_timestamp = [];
let array_username = [];
let array_samplesize = [];
let array_frequency = [];
let array_tweetlength = [];
let array_uniqueWords = [];
let array_followers = [];
let array_following = [];
let array_avgTweetLikes = [];
let array_avgTweetRetweets = [];
let array_percentRetweets = [];
let array_percentReplies = [];
let array_percentOther = [];

function getUserInfo(id, user){
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + $(user).val() + inclReplies + inclRetweets + '&search=';
    $.ajax({
        url: Url,
        type:"GET",
        beforeSend: function(){
            console.log(Url)
            $(id).attr("disabled",true);
            $(id).html("...");  
        },
        success: function(responseText){
            console.log(responseText)
            addToCSV(responseText);
            wordCloudString = responseText.name + " - Recently Used Words\nWord,Count\n" + responseText.wordCloudList;
            addToArrays(responseText);
            showChart(array_username, array_samplesize, 'SampleSize');
            showChart(array_username, array_frequency, 'Frequency');
            showChart(array_username, array_tweetlength, 'Length');
            showChart(array_username, array_uniqueWords, 'UniqueWords');
            showChart(array_username, array_followers, 'Followers');
            showChart(array_username, array_following, 'Following');
            showChart(array_username, array_avgTweetLikes, 'AverageLikes');
            showChart(array_username, array_avgTweetRetweets, 'AverageRetweets');
            showTriBar(array_username, array_percentReplies, array_percentRetweets, array_percentOther, 'TweetComposition');
            wordCloud(responseText);
            $('#DashboardHistory').append("<img src='" + responseText.profilePicURL + "' align='middle' style='border-radius:50%;float:right;padding-left:8px;padding-right:8px;height:32px;width:auto'>");
            $(id).attr("disabled",false);
            $(id).html("<i class='fas fa-search fa-sm'></i>");
        },
        error:function(error){
            console.log("Error")
            $(id).html("Oops!");
        }
    })
}

function addToArrays(responseText){
    array_timestamp.push(Date(Date.now()));
    array_username.push(responseText.name);
    array_samplesize.push(responseText.sampleSize);
    array_frequency.push(responseText.perDay.toFixed(2));
    array_tweetlength.push(responseText.avgTweetLength.toFixed(2));
    array_uniqueWords.push(responseText.uniqueWords);
    array_followers.push(responseText.followers);
    array_following.push(responseText.followings);
    array_avgTweetLikes.push(responseText.avg_likes.toFixed(2));
    array_avgTweetRetweets.push(responseText.avg_retweets.toFixed(2));
    array_percentRetweets.push((responseText.perc_RTs*100).toFixed(2));
    array_percentReplies.push((responseText.perc_replies*100).toFixed(2));
    array_percentOther.push(((1-responseText.perc_RTs-responseText.perc_replies)*100).toFixed(2));
}
function addToCSV(responseText){
    csvString += Date(Date.now()) + "," + responseText.name + "," + inclReplies + "," + inclRetweets + ",," + responseText.sampleSize + "," + responseText.num_RTs + "," + responseText.perc_RTs + "," + responseText.num_replies + "," + responseText.perc_replies + "," + responseText.daysSince + "," + responseText.perDay + "," + responseText.avgHoursBetween + "," + responseText.avgTweetLength + "," + responseText.uniqueWords + "," + responseText.searchHits + "," + responseText.followers + ","+ responseText.followings + "," + responseText.avg_likes + "," + responseText.avg_retweets + "," + responseText.tweet_clients + "\n";
}
function downloadCSV(){
    console.log(csvString);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'tweetalyze-' + Date(Date.now()) + '.csv';
    hiddenElement.click();
}

function incRetweets(tagID, tagIDM){
    if(inclRetweets == ""){
        inclRetweets = "&rts=1";
        $(tagID).removeClass("btn btn-secondary");
        $(tagID).addClass("btn btn-success");
        $(tagIDM).removeClass("btn btn-secondary");
        $(tagIDM).addClass("btn btn-success");
    }
    else{
        inclRetweets = "";
        $(tagID).removeClass("btn btn-success");
        $(tagID).addClass("btn btn-secondary");
        $(tagIDM).removeClass("btn btn-success");
        $(tagIDM).addClass("btn btn-secondary");
    }
}

function incReplies(tagID, tagIDM){
    if(inclReplies == ""){
        inclReplies = "&replies=1";
        $(tagID).removeClass("btn btn-secondary");
        $(tagID).addClass("btn btn-success");
        $(tagIDM).removeClass("btn btn-secondary");
        $(tagIDM).addClass("btn btn-success");
    }
    else{
        inclReplies = "";
        $(tagID).removeClass("btn btn-success");
        $(tagID).addClass("btn btn-secondary");
        $(tagIDM).removeClass("btn btn-success");
        $(tagIDM).addClass("btn btn-secondary");
    }
}

function wordCloud(responseText){
    let wordCloud = [];
    let minCount = 5;
    for (let i = 0; i < responseText.wordCloudList.length; i++) {
        if (responseText.wordCloudList[i][1] >= minCount)
            wordCloud.push(responseText.wordCloudList[i]);
    }
    wordCloud.sort(function(a, b) {
        return b[1] - a[1]
    });
    let max = parseInt(wordCloud[0][1]);
    for (let i = 0; i < wordCloud.length; i++) {
        wordCloud[i][1] = Math.ceil((wordCloud[i][1] * 100) / max);
    }
    let canvas = document.getElementById("wordCloud");
    WordCloud(canvas, {
        list: wordCloud, 
        gridSize: 10,
        weightFactor: function (size) {
            return size * (wordCloud.length > 100 ? 1.4 : 2);
        },
        minFontSize: "30px"
    });              
}
function convertCanvas() { //reads in canvas to variable and calls download function
    let canvas = document.getElementById('wordCloud');
    downloadCanvas(canvas, 'wordcloud.png');
}
/* Canvas Donwload */
function downloadCanvas(canvas, filename) {
    /// create an "off-screen" anchor tag
    var lnk = document.createElement('a'), e;
  
    /// the key here is to set the download attribute of the a tag
    lnk.download = filename;
  
    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    lnk.href = canvas.toDataURL("image/png;base64");
  
    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {
      e = document.createEvent("MouseEvents");
      e.initMouseEvent("click", true, true, window,
                       0, 0, 0, 0, 0, false, false, false,
                       false, 0, null);
  
      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent("onclick");
    }
}
function downloadWordCloudData(){
    let tempstring = "";
    for (let i = 0; i < wordCloudString.length; i++ ) {
        if(wordCloudString.substring(i-1, i) >= '0' && wordCloudString.substring(i-1, i) <= '9' && wordCloudString.substring(i, i+1) == ','){
            tempstring += "\n";
        }
        else{
            tempstring += wordCloudString.substring(i, i+1);
        }
    }
    wordCloudString = tempstring;
    
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(wordCloudString);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'tweetalyze-word cloud data-' + Date(Date.now()) + '.csv';
    hiddenElement.click();
}

function showChart(x_data, y_data, tagID){
    //if this is the first sample, show a value
    if(y_data.length <= 1){
        $("#" + tagID).html(y_data);
    }
    //if there are multiple samples, show a graph
    else{
        $("#" + tagID).html('');
        var data3 = [{ 
            x: x_data, 
            y: y_data, 
            type: 'bar',
            textposition: 'auto'
            }];

        var layout3 = {
            yaxis: {

                    },
            xaxis: {

                    }
            };
        
        var config = {
            modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'resetScale2d', 'hoverClosestGl2d', 'hoverClosestPie','toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox','hoverClosestCartesian', 'hoverCompareCartesian'], 
            displaylogo: false
        };

        Plotly.newPlot(tagID, data3, layout3, config);
    }
}

function showTriBar(x_data, y_data1, y_data2, y_data3, tagID){
    var trace1 = {
        x: x_data,
        y: y_data1,
        name: 'Replies',
        type: 'bar'
        };
        
    var trace2 = {
    x: x_data,
    y: y_data2,
    name: 'Retweets',
    type: 'bar'
    };

    var trace3 = {
        x: x_data,
        y: y_data3,
        name: 'Other',
        type: 'bar'
        };
    
    var data = [trace1, trace2, trace3];
    
    var layout = {barmode: 'stack'};

    var config2 = {
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'resetScale2d', 'hoverClosestGl2d', 'hoverClosestPie','toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox','hoverClosestCartesian', 'hoverCompareCartesian'], 
        displaylogo: false
    };

    Plotly.newPlot(tagID, data, layout, config2);
}