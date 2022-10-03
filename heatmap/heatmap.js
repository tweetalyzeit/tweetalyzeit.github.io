// initialize arrays to accept data in heatmap function format
let SundayTimes = [];
let MondayTimes = [];
let TuesdayTimes = [];
let WednesdayTimes = [];
let ThursdayTimes = [];
let FridayTimes = [];
let SaturdayTimes = [];
for(var i = 0; i < 24; i++){
    SundayTimes[i] = 0;
    MondayTimes[i] = 0;
    TuesdayTimes[i] = 0;
    WednesdayTimes[i] = 0;
    ThursdayTimes[i] = 0;
    FridayTimes[i] = 0;
    SaturdayTimes[i] = 0;
}

includedHandles = "Sampled Users: ";

//initialize caption data
//newestTimestamp;
//oldestTimestamp;
sampleSize = 0;

// get the user's current browser timezone
dt = new Date();
browserTimezone = getBrowserTimezone(dt);

// change the x axis tick label frequency if the user is on mobile
userOnMobile = mobileCheck();
increment = 1;
if(userOnMobile){
    increment = 3;
}

function generateFunction(){
    const Url='https://tweetgettimestamps.herokuapp.com/?pw=newSreel' + '&user=' + $('#user').val() + '&search=';
    $.ajax({
        url: Url,
        type:"GET",
        beforeSend: function(){
            console.log(Url)
            $('#submitHandle').attr("disabled",true);
            $('#submitHandle').html("Loading");  
        },
        success: function(responseText){
            console.log(responseText);
            $('#AddHistory').append("<img src='" + responseText.profilePicURL + "' style='border-radius:50%;padding-left:8px;padding-right:8px;padding-top:8px;'>");

            //get caption data
            /*currentTweetsNewestTimestamp = new Date(responseText.dates[0]);
            if(newestTimestamp != null){
                if(currentTweetsNewestTimestamp > newestTimestamp){
                    newestTimestamp = currentTweetsNewestTimestamp;
                }
            }
            currentTweetsOldestTimestamp = new Date(responseText.dates[responseText.dates.length]);
            if(oldestTimestamp != null){
                if(currentTweetsOldestTimestamp < oldestTimestamp){
                    oldestTimestamp = currentTweetsOldestTimestamp;
                }
            }*/
            sampleSize += responseText.dates.length;
            console.log("Sample Size: " + sampleSize);
            document.getElementById("sampleSize").innerHTML = "Sample Size: " + sampleSize.toString();

            if(includedHandles == "Sampled Users: "){
                includedHandles += "@" + responseText.name;
            }
            else{
                includedHandles += ", @" + responseText.name;
            }
            document.getElementById("includedHandles").innerHTML = includedHandles;

            // map timestamps into heatmap data array format
            for(var j = 0; j < responseText.dates.length; j++){ 
                currentTweetsDayOfWeek = new Date(responseText.dates[j]);
                //console.log(currentTweetsDayOfWeek); // shows full timestamp of current tweet, in local time

                currentTweetsDayOfWeek = currentTweetsDayOfWeek.getDay();
                //console.log("Day of Week: " + currentTweetsDayOfWeek); // returns an integer 0-6, with 0 being Sunday and 6 being Saturday

                currentTweetsHourOfDay = new Date(responseText.dates[j]);
                currentTweetsHourOfDay = currentTweetsHourOfDay.getHours();
                //console.log("Hour: " + currentTweetsHourOfDay); // returns an integer, 0-23

                switch(currentTweetsDayOfWeek){
                    case 0: SundayTimes[currentTweetsHourOfDay] += 1; break;
                    case 1: MondayTimes[currentTweetsHourOfDay] += 1; break;
                    case 2: TuesdayTimes[currentTweetsHourOfDay] += 1; break;
                    case 3: WednesdayTimes[currentTweetsHourOfDay] += 1; break;
                    case 4: ThursdayTimes[currentTweetsHourOfDay] += 1; break;
                    case 5: FridayTimes[currentTweetsHourOfDay] += 1; break;
                    case 6: SaturdayTimes[currentTweetsHourOfDay] += 1; break;
                    default: console.log("There is an error inside the switch that increments the heatmap counter arrays!"); break;
                }
            }
            
            plotHeatmap(); // update the chart
            
            // wrap-up the handle add
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

function plotHeatmap(){
    var data = [
        {
          z: [SaturdayTimes,FridayTimes,ThursdayTimes,WednesdayTimes,TuesdayTimes,MondayTimes,SundayTimes],
          y: ['Sat','Fri','Thurs','Wed','Tues','Mon','Sun'],
          x: ['00', '01', '02', '03', '04', '05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
          type: 'heatmap',
          hoverongaps: false,
          hovertemplate: "Day: %{y}<br>Hour: %{x}<br>Count: %{z}<extra></extra>",
        }
      ];

    var layout = {
        xaxis: {
            autotick:false,
            dtick: increment,
            title: {
                text: 'Hour of Day (' + browserTimezone + ')',
            },
            label: "Hour: ",
        },
        title: "Tweet Times",
    }

    var config = {
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'resetScale2d', 'hoverClosestGl2d', 'hoverClosestPie','toggleHover', 'resetViews', 'sendDataToCloud', 'toggleSpikelines', 'resetViewMapbox','hoverClosestCartesian', 'hoverCompareCartesian'], 
        displaylogo: false,
        responsive: true
    };
      
    Plotly.newPlot('heatmap', data, layout, config);
}

function getBrowserTimezone(dt){
    return /\((.*)\)/.exec(new Date().toString())[1];
}

function mobileCheck(){
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}