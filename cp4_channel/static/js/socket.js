var data;
var channelsObj;
var newObject;

// Set variables as global variables in order to use them inside onmessage()
var radioButtonO2 = document.getElementById('o2');
var radioButtonCO2 = document.getElementById('co2');
var radioButtonLN2 = document.getElementById('ln2');
var radioButtonH2 = document.getElementById('h2');


// Initialize selectedValue with a default value
let chsObj;
let selectedValue;
let existingNumbers = [];
let missingChannels = [];
let gasNotMonitored = [];
let channelRadioBtn;


// this code can work like ONCHANGE HOOK
// // Select the target node for mutation observation
// const targetNode = document.getElementById('graph_1'); 

// // Create a new instance of MutationObserver
// const observer = new MutationObserver((mutationsList) => {
//   // Callback function to execute when changes occur
// //   console.log('DOM changes detected:', mutationsList);

//   // Access the chsObj and log its value
//   console.log('chObj from outside onmessage method --->', chsObj);
// });

// // Configuration options for the observer (e.g., specify which mutations to observe)
// const config = { childList: true, subtree: true, attributes: true, characterData: true };

// // Start observing the target node with the specified configuration
// observer.observe(targetNode, config);


const sensorDropdown1 = document.getElementById('sensor_dropdown_1');
const sensorDropdown11 = document.getElementById('sensor_dropdown_11');
const options1 = sensorDropdown1.querySelectorAll('option');
const options11 = sensorDropdown11.querySelectorAll('option');

function enableAllOptions() {

    options1.forEach(option => {
      option.disabled = false;
    });   
    options11.forEach(option => {
      option.disabled = false;
    });

}

function disabledAllOptions() {

    options1.forEach(option => {
      option.disabled = true;
    });   
    options11.forEach(option => {
      option.disabled = true;
    });

}


function enableOptionsForIdentifier(avaibleCh) { 
  
    options1.forEach(option => {
      if (option.value === avaibleCh) {
        option.disabled = false;
      }
    });  
    options11.forEach(option => {
      if (option.value === avaibleCh) {
        option.disabled = false;
      }
    });
    
}


// Retrive last Channel Log Status from DataBase
function fetchLatestChannelLogData() {
    return fetch('/get_channel_log_data/') // Update the URL to match your Django route
        .then(response => response.json())
        .then(data => {
            // Handle the response data
            var latestChannelLogData = data;
            // Process the latestChannelLogData as needed
            // console.log("Socket.js: latest Channel log from Database", latestChannelLogData);
    
            // Return the processed data if needed
            return latestChannelLogData;
        })
        .catch(error => {
            // Handle the error
            console.log(error);
            // Rethrow the error if needed
            throw error;
        });
}

function processLatestChannelLogData(identifierToMatch) {
    disabledAllOptions();
    fetchLatestChannelLogData()
      .then(latestChannelLogData => {
        Object.keys(latestChannelLogData.data).forEach(key => {
          const avaibleCh = key.replace('ch_', '');
          const channel = latestChannelLogData.data[key];
          const identifier = channel.identifier;
  
          if (identifier === identifierToMatch) {
            // console.log("Matching identifier found for channel", avaibleCh, ":", identifier);
            enableOptionsForIdentifier(avaibleCh);
          } else {
            console.log("No Channel with this idenfier!")
            // alert("No Channel with this idenfier!");
          }
        });
      })
      .catch(error => {
        // Handle the error
        console.log(error);
      });
}



function toggleSecondDivO2() {
    processLatestChannelLogData('O');
}

function toggleSecondDivCO2() {
    processLatestChannelLogData('CO');
}

function toggleSecondDivLN2() {
    processLatestChannelLogData('LN');
}

function toggleSecondDivH2() {
    processLatestChannelLogData('H');
}

function toggleSecondDivAr() {
    processLatestChannelLogData('Ar');
}

// Define CurrentTime TimeStamp
const TimestampNow = Date.now(); // Get the current timestamp in milliseconds
const dateTime = new Date(TimestampNow); // Create a new Date object using the timestamp
const dateTimeString = dateTime.toLocaleString(); // Convert the Date object to a localized date and time string
const objTime = {
    applicationClosed: dateTimeString
};
const jsonifyTimestamp = JSON.stringify(objTime);


// Define a variable to store the interval reference
let intervalRef;

let timeoutUpdates = {}; // Object to store timeout values

// close the draggable modal when cp4 connection lost
const modal = document.getElementById("dragmodal");

function closeModal() {
    // console.log("socket.js");
    modal.style.display = "none";
    resetSensorValues();
}

// Create an HTTP POST request to send the data to the Django Database
fetch('/save-lost-connection/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: jsonifyTimestamp,
})
.then(response => response.json())
.then(data => {
    console.log("socket.js: data -->",data);
})
.catch(error => {
    console.error('socket.js: Error -->', error);
});


function countDown(element) {
        const updatedElement = document.getElementById(element);
        const countdownModal = document.getElementById('countdown-lost-cp4');

        // Clear the previous timeout, if any
        clearTimeout(timeoutUpdates[element]);

        // Start a new countdown timer
        timeoutUpdates[element] = setTimeout(() => {
            // Remove the class after the 30-second countdown
            updatedElement.classList.remove('sensor-below-title-color');
            updatedElement.classList.add('sensor-below-title-red');
            // Show the modal;
            countdownModal.style.display = 'block';
            closeModal();
            
            localStorage.setItem('appClosedTimestamp', jsonifyTimestamp);
            

        }, 60000); // 60 seconds (60000 milliseconds)
        // console.log("socket.js:  CP4: Connection Lost:", jsonifyTimestamp);        

}

const storedTimestamp = localStorage.getItem('appClosedTimestamp');
// console.log("socket.js: Stored value in local broser storage --> ",storedTimestamp);

if (storedTimestamp) {
    // Create an HTTP POST request to send the stored timestamp to the Django Database
    fetch('/save-lost-connection/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timestamp: storedTimestamp }), // Stringify the stored timestamp
    })
      .then(response => response.json())
      .then(data => {
        console.log("socket.js: data -->", data);
        // Remove the stored timestamp from local storage after successful registration
        localStorage.removeItem('appClosedTimestamp');
      })
      .catch(error => {
        console.error('socket.js: Error -->', error);
      });
  }

// reset option each iterations
function resetDropdownOptions() {
const sensor_dropdown_1 = document.getElementById('sensor_dropdown_1');
const sensor_dropdown_11 = document.getElementById('sensor_dropdown_11');

if (sensor_dropdown_1) {
    Array.from(sensor_dropdown_1.options).forEach((option) => {
    option.disabled = false;
    });
}

if (sensor_dropdown_11) {
    Array.from(sensor_dropdown_11.options).forEach((option) => {
    option.disabled = false;
    });
}
}

// Reset Sensor Value
function resetSensorValues() {
    var graphDropDown = document.getElementById('graph_dropdown');
    var sensorDropdown1 = document.getElementById("sensor_dropdown_1");
    var sensorDropdown2 = document.getElementById("sensor_dropdown_11");
    var rowSensors = document.getElementsByClassName("row_sensors");  // Retrieve row_sensors elements
    var generateBtn = document.getElementById("generate_btn");

    sensorDropdown1.value = "--";
    sensorDropdown2.value = "--";
    graphDropDown.value = "--";  
}


var alertDisplayed = false;
// open connection with websocket
var socket = new WebSocket('ws://localhost:8000/ws/some_url/');
socket.onmessage = function (event) {
    var d = event.data
    console.log("socket.js: raw data from cosumer before parse -->", d);
    data = JSON.parse(event.data);
    var parsedObject;
    // var channelsObj;
    console.log("socket.js: raw msg -->", data, "type -->", typeof data);
    var messageObject = data.message;
    console.log("socket.js: messageObject --->", messageObject);

    // Disabled options each time the onmessage method is called
    disabledAllOptions();

    // Reset SensorValue each iteration
    resetSensorValues();
    
    
    // uncomment out below code when usign cp4 serial port read
    // var jsonString = messageObject.data.replace(/^[^{\[]+/, ''); // Remove leading non-JSON characters
    // console.log("socket.js: jsonString --->", jsonString, typeof jsonString);
    
    // if (jsonString.trim() === '') {
    //     console.log('socket.js: Raw message is empty.');
    // } else {
    //     var parsedObject = JSON.parse(jsonString);
    //     var msgObj = {
    //         data: {
    //             meta: parsedObject.meta,
    //             headers: parsedObject.headers,
    //             data: parsedObject.data,
    //             date_time: messageObject.date_time
    //         }
    //     };
    //     console.log("socket.js: msgObj --->", msgObj);
    // }

    // if (parsedObject !== undefined) {
    //     channelsObj = parsedObject.data.Channels;
    //     var newChannels = {};


    //     for (var key in channelsObj) {
    //         if (channelsObj.hasOwnProperty(key)) {
    //           var value = channelsObj[key];
    //           var identifier = "";
    //           var channelValue = "";
          
    //           // Check if the value contains an asterisk as the identifier
    //           if (value.includes("*")) {
    //             identifier = "*";
    //             channelValue = "0";
    //           } else {
    //             // Extract identifier and value from the original value string
    //             var matches = value.match(/([\d.]+)\s*([\w*]+)/);
    //             if (matches && matches.length === 3) {
    //               channelValue = matches[1];
    //               identifier = matches[2];
    //             }
    //           }
          
    //           // Create a new object with identifier and value properties
    //           newChannels[key] = {
    //             identifier: identifier,
    //             value: channelValue
    //           };
    //         }
    //       }
        
    //     // Create the new object with modified Channels
    //     var newObject = {
    //         meta: parsedObject.meta,
    //         headers: parsedObject.headers,
    //         data: {
    //             Channels: newChannels,
    //             "Chan Num": parsedObject.data["Chan Num"],
    //             GPIO: parsedObject.data.GPIO,
    //             Accessory: parsedObject.data.Accessory,
    //             Valve: parsedObject.data.Valve,
    //             Fan: parsedObject.data.Fan,
    //             Alarm: parsedObject.data.Alarm
    //         },
    //         date_time: messageObject.date_time
    //     };
        
    //     console.log("socket.js: newObject -->", newObject, "type -->", typeof newObject);
    //     var jsonData = JSON.stringify(newObject);
    //     console.log("socket.js: jsonData stringfy newObject -->", jsonData,  "type -->", typeof jsonData);

    //     // Create an HTTP POST request to send the data to Django
    //     fetch('/save-data/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: jsonData,
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log("socket.js: data-->",data);
    //     })
    //     .catch(error => {
    //         console.error('socket.js: Error -->', error);
    //     });
        

    // }




    // use the below jsonString when testing without cp4 and no serial port comment out when using serial port read
    var jsonString = messageObject.data;
    console.log("socket.js: jsonString --->", jsonString, typeof jsonString);
    var parsedObject = JSON.parse(jsonString);
        var msgObj = {
            data: {
                meta: parsedObject.meta,
                headers: parsedObject.headers,
                data: parsedObject.data,
                date_time: messageObject.date_time
            }
        };
        console.log("socket.js: msgObj --->", msgObj);
   


    

    if (parsedObject !== undefined) {
            channelsObj = parsedObject.data.Channels;
            var newChannels = {};
    
    
            for (var key in channelsObj) {
                if (channelsObj.hasOwnProperty(key)) {
                    var value = channelsObj[key];
                    var identifier = "";
                    var channelValue = "";
                
                    // Check if the value contains an asterisk as the identifier
                    if (value.includes("*")) {
                    identifier = "*";
                    channelValue = "0";
                    } else {
                    // Extract identifier and value from the original value string
                    var matches = value.match(/([\d.]+)\s*([\w*]+)/);
                    if (matches && matches.length === 3) {
                        channelValue = matches[1];
                        identifier = matches[2];
                    }
                    }
                
                    // Create a new object with identifier and value properties
                    newChannels[key] = {
                    identifier: identifier,
                    value: channelValue
                    };
                }
                }
            
            // Create the new object with modified Channels
            newObject = {
                meta: parsedObject.meta,
                headers: parsedObject.headers,
                data: {
                    Channels: newChannels,
                    "Chan Num": parsedObject.data["Chan Num"],
                    GPIO: parsedObject.data.GPIO,
                    Accessory: parsedObject.data.Accessory,
                    Valve: parsedObject.data.Valve,
                    Fan: parsedObject.data.Fan,
                    Alarm: parsedObject.data.Alarm
                },
                date_time: messageObject.date_time
            };
            
            // console.log("socket.js: newObject -->", newObject, "type -->", typeof newObject);
            // chsObj = newObject['data']['Channels'];


            // Then check witch idenfier is seleced by the user and enable the corrisponding option ---> logic below!
            var radioInputs = document.querySelectorAll('div input[type="radio"]');
            var selectedIdenfierValue = "";

            for (var i = 0; i < radioInputs.length; i++) {
                if (radioInputs[i].checked) {
                    selectedIdenfierValue = radioInputs[i].value;
                    console.log("selected radio input",selectedIdenfierValue)
                    break;
                    
                }

            }
            if (selectedIdenfierValue !== "") {
            // console.log("Selected option:", selectedIdenfierValue, typeof selectedIdenfierValue);
            console.log("newObj data Channels:", newObject.data.Channels);

                Object.keys(newObject.data.Channels).forEach(key => {
                    const avaibleCh = key.replace('ch_', '');
                    const channel = newObject.data.Channels[key];
                    const identifier = channel.identifier;
                    console.log("Channel number ---> :", avaibleCh, "idenfier ---> :", identifier);
                    if (identifier === selectedIdenfierValue) {
                    // console.log("Matching identifier found for channel", avaibleCh, ":", identifier);
                    enableOptionsForIdentifier(avaibleCh);
                    } else {
                        console.log("idenfier not found in the Channels. Options still disabled");
                    }
                });

            } else {
            console.log("No option is selected or idenfier not present!.");
            }

            
            // console.log("socket.js: newObject ChannelsOBJ -->", chsObj);
            
            var jsonData = JSON.stringify(newObject);
            console.log("socket.js: jsonData stringfy newObject -->", jsonData,  "type -->", typeof jsonData);
    
            // Create an HTTP POST request to send the data to Django Database
            fetch('/save-data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonData,
            })
            .then(response => response.json())
            .then(data => {
                console.log("socket.js: data -->",data);
            })
            .catch(error => {
                console.error('socket.js: Error -->', error);
            });            
    
        }
     //END use the below jsonString when testing without cp4 and no serial port comment out when using serial port read


     
    
    var value;
    var identifier;
    var raw_identifier;
    var roundedValue;
    // startCountdown(secondsDiff);
    for (var i = 0; i < channels.length; i++) {
        if (newObject !== undefined) {
                // console.log("socket.js: channels from new raw msg", data.message.data);
                // console.log("socket.js: channels length -->", channels.length);
                // console.log("socket.js: i in channels -->", i);
                // console.log("socket.js: Channels in new obj --->", newObject.data.Channels)
                value = newObject.data.Channels['ch_' + (i + 1)]["value"];
                // console.log("socket.js: value ->", value, "type ->", typeof value);
                roundedValue = Number(value);
                roundedValue = roundedValue.toFixed(2);
                channels[i].push([data.message.date_time, roundedValue]);
                if (channels[i].length > 20) {
                    channels[i].shift(); // Remove the first element
                }
        } else {
                channels[i].push([data.message.date_time, "0"]); // initialize the channels array         
        }      
    }
    // console.log("socket.js: Channels initialized with default value '0' and date-time from consumer.py -->",  channels);

    
    var color;
    var color_identifier;
    var lastValue;
    for (var i = 0; i < charts.length; i++) {
        var newGraphDataY = channels[i].map(function (data) {
            // dataStr = data[1].toFixed(2);
            dataStr = data[1];

            // console.log("socket.js: dataStr ->", dataStr);
            // return data[1] !== undefined ? data[1] : 0;
            return dataStr
        });
        console.log("socket.js: newGraphDataY --->", "channel:", i + 1, newGraphDataY, "type ->", typeof newGraphDataY);
        
        
        var newGraphDataX = channels[i].map(function (data) {
            return new Date(data[0]).getTime(); // Convert date-time string to timestamp
        });
        // console.log("socket.js: newGraphDataX --->","channel:", i + 1, newGraphDataX);

        color = '#00FEFC'; // Default color
        color_identifier = '#00FEFC'; // Default color 

        if ( channels[i][(channels[i].length - 1)] !==undefined){
            lastValue = channels[i][channels[i].length - 1][1];
            // console.log("socket.js: lastValue for each channels array -->", lastValue);
        }
        lastValue = Number(lastValue);
        

        if (lastValue <= levelTresholdLighRed && lastValue > levelTresholdRed) {
            color = '#FF758D'; // Change the color if the value meets the threshold condition
            color_identifier = '#FF758D'; // Change the color if the value meets the threshold condition
        } else if (lastValue <= levelTresholdRed) {
            color = '#FF0000'; // Change the color if the value meets the threshold condition
            color_identifier = '#FF758D'; // Change the color if the value meets the threshold condition
        } 
        else {
            color = '#00fefc';
            color_identifier = '#00fefc'; 
        }

        // add markers and custom marger for datapoint below 19.5%
        var markerFillColor = '#00FEFC'; // Default marker color
        if (lastValue < 19.5) {
            markerFillColor = '#FF0000'; // Change the marker color for data points below 19.5%
        }


        

        var chart = charts[i];
        raw_identifier = newObject.data.Channels['ch_' + (i + 1)]["identifier"];
        identifier = raw_identifier;  // Default value

        if (raw_identifier === 'O') {
            identifier = 'O2';
        } else if (raw_identifier === 'CO'){
            identifier = 'CO2';
        }
        else if (raw_identifier === 'LN'){
            identifier = 'LN2';
        }else if (raw_identifier === 'H'){
            identifier = 'H2';
        }
         else if (raw_identifier === '*') {
            identifier = '?';
            color_identifier = 'rgba(255,255,255,0.6)';
        } 
        // else {
        //     identifier = 'Unknown';
        //     color_identifier = '#ffff00';
        // }
        chart.updateOptions({
            series: [{
                name: "Values1",
                data: newGraphDataY
            }],
            xaxis: {
                categories: newGraphDataX
            },
            colors: [color], // Set the color dynamically
            // annotations: {
            //     points: newGraphDataY.map(function (y, index) {
            //         var markerColor = y < 19.5 ? '#FF0000' : markerFillColor;
            //         return {
            //             x: newGraphDataX[index],
            //             y: y,
            //             marker: {
            //                 size: 4,
            //                 fillColor: markerColor,
            //                 strokeColor: '#FFFFFF',
            //                 strokeWidth: 2,
            //             },
            //         };
            //     }),
            //     position: 'front',
            // },
            title: {
                text: identifier,
                align: 'center',
                style: {
                    color: color_identifier // Set the color of the title text
                },
            },

        });


    }
    // console.log("socket.js: channels --->", channels);
    // console.log("socket.js: charts --->", charts);



//    // Update the AverageChart

    let averageData = [];
    // console.log("socket.js: avgData->", averageData);
    
    
    let AverageGraphDataY4;
    let AverageGraphDataY1;

    console.log("socket.js: averageData array ->", averageData);
     
    function updateAverageDataValue(){
        var averageValue = averageData[averageData.length - 1];
        var avarege_title = document.getElementById("average_data");
        var heart_beat_avg = document.getElementById('heart_beat_avg');
        var avg_label = document.getElementById('avg_label');

        if (typeof averageValue === 'undefined') {
            averageValue = 0;
            // console.log("socket.js: avg value from if ->", averageValue);
            document.getElementById("average_data").innerHTML = averageValue + "%";
            avg_label.classList.add('gray_color');
            avg_label.classList.remove('red_color');
            avg_label.classList.remove('tiffany_color');
            avarege_title.classList.add('gray_color');
            avarege_title.classList.remove('red_color');
            avarege_title.classList.remove('tiffany_color');
            heart_beat_avg.classList.add('gray_color');
            heart_beat_avg.classList.remove('red_color');
            heart_beat_avg.classList.remove('tiffany_color');         
        } else if (averageValue !== undefined && averageValue !== 0 && averageValue <= 19.5) {
            document.getElementById("average_data").innerHTML = averageValue + "%";
            avg_label.classList.remove('gray_color');
            avg_label.classList.remove('tiffany_color');
            avg_label.classList.add('red_color');
            avarege_title.classList.remove('gray_color');
            avarege_title.classList.remove('tiffany_color');
            avarege_title.classList.add('red_color');
            heart_beat_avg.classList.remove('gray_color');
            heart_beat_avg.classList.remove('tiffany_color');
            heart_beat_avg.classList.add('red_color');
        }
        else {
            // console.log("socket.js: avg value from else ->", averageValue);
            document.getElementById("average_data").innerHTML = averageValue + "%";
            avg_label.classList.remove('gray_color');
            avg_label.classList.remove('red_color');
            avg_label.classList.add('tiffany_color');
            avarege_title.classList.remove('gray_color');
            avarege_title.classList.remove('red_color');
            avarege_title.classList.add('tiffany_color');
            heart_beat_avg.classList.remove('gray_color');
            heart_beat_avg.classList.remove('red_color');
            heart_beat_avg.classList.add('tiffany_color');
        }
        
    }
    
    function updateGraph() {
        // console.log("socket.js: updateGrapg function triggered");

        if (channels[selectedOption1] && channels[selectedOption2]) {
            AverageGraphDataY4 = channels[selectedOption1].map(function (data) {
                // console.log("Channel selected Options1 ---> ", channels[selectedOption1]);
              return data[1] !== undefined ? Number(data[1]) : 0;
            });
            AverageGraphDataY1 = channels[selectedOption2].map(function (data) {
                // console.log("Channel selected Options2 ---> ", channels[selectedOption2]);
              return data[1] !== undefined ? Number(data[1]) : 0;
            });        
            AverageGraphDataX = channels[selectedOption1].map(function (data) {
              return new Date(data[0]).getTime(); // Convert date-time string to timestamp
            });

            if (AverageGraphDataY4 && AverageGraphDataY1 && AverageGraphDataY4.length === AverageGraphDataY1.length) {
                var average;
                for (var i = 0; i < AverageGraphDataY4.length; i++) {
                    average = ((AverageGraphDataY4[i] + AverageGraphDataY1[i]) / 2);
                    average = average.toFixed(2);
                    // console.log("socket.js: average before push to array->", average);
                    if (averageData.length >= 20) {
                        averageData.shift(); // Remove the first element from the array
                    }
                    averageData.push(average);
                }
                
            } else {
            // Handle the case when the arrays are undefined or have different lengths
            // Display an error message or perform alternative logic
            }

            var color = '#00FEFC'; // Default color for line 1
            var color2 = '#00FEFC'; // Default color for line 2
            var color3; // Default color for line 3
            var lastValue = channels[selectedOption1][channels[selectedOption1].length - 1][1];
            // console.log("socket.js:  last value sel option 1 -->", lastValue);
            var lastValue2 = channels[selectedOption2][channels[selectedOption2].length - 1][1];
            var lastValue3 = averageData[averageData.length - 1];

            // LINE 1 color determination
            if (lastValue <= levelTresholdLighRed) {
                if (lastValue > levelTresholdRed){
                    color = '#FF758D'; //Pinkish Change the color if the value meets the threshold condition
                } else {
                    color = '#FF0000'; //Red Change the color if the value meets the threshold condition
                }
            } else {
                color = '#00FEFC'; // cyan
            }

            // LINE 2 color determination
            if (lastValue2 <= levelTresholdLighRed) {
                if (lastValue2 > levelTresholdRed){
                    color2 = '#FF758D'; //Pinkish Change the color if the value meets the threshold condition
                } else {
                    color2 = '#FF0000'; //Red Change the color if the value meets the threshold condition
                }
            } else {
                color2 = '#00FEFC'; // cyan
            }

            // LINE 3 color determination
            if (lastValue3) {
                color3 = '#800080' // purple
            }

            // Update the chart options and data
            
            let idenfier_avg_graf;
            console.log("from updateAvg graph newObject Data Channels --> ", newObject['data']['Channels']);
            raw_identifier_option1 = newObject.data.Channels['ch_' + (selectedOption1 + 1)]["identifier"];
            raw_identifier_option2 = newObject.data.Channels['ch_' + (selectedOption2 + 1)]["identifier"];
            // console.log("idenfier sel 1 ---> ", raw_identifier_option1);
            // console.log("idenfier sel 2 ---> ", raw_identifier_option2);
            
            // Close the modal and alert user if they are display avg graph and channels has different gas or one channel become disabled
            function executeCodeOnModalPresent() {

                if (raw_identifier_option1 === raw_identifier_option2 && raw_identifier_option1 !== "*" && raw_identifier_option2 !== "*") {
                    idenfier_avg_graf = raw_identifier_option1;
                    console.log("idenfier avg_graph ---> ", idenfier_avg_graf);
                } else {
                    closeModal();
                    alert("You can only generate an avg graph with the same gas.");
                }

            }

            var modal = document.getElementById("dragmodal");
            var modalStyle = window.getComputedStyle(modal);

            if (modal && modalStyle.display !== "none") {
            // Execute the code if the modal is present and visible
            executeCodeOnModalPresent();
            }

            var Avechart = myAverageChart;
            if (AverageGraphDataY4 && AverageGraphDataY1 && averageData) {
                Avechart.updateOptions({
                    series: [
                        {
                            name: "Sensor " + (selectedOption1 + 1),
                            data: AverageGraphDataY4,
                            color: color // Set the color for line 2
                        },
                        {
                            name: "Sensor " + (selectedOption2 + 1),
                            data: AverageGraphDataY1,
                            color: color2 // Set the color for line 2
                        },
                        {
                            name: "Average",
                            data: averageData,
                            color: color3 // Set the color for line 2
                        }
                    ],
                    xaxis: {
                        categories: AverageGraphDataX
                    },
                    colors: [color, color2, color3], // Set the color dynamically
                    
                    // annotations: {
                    //     points: AverageGraphDataY4.map(function (y, index) {
                    //         var markerColor = y < 19.5 ? '#FF0000' : color;
                    //         // var markerSize = y >= 19.5 ? 4 : 0; // Set marker size to 0 when line is disabled
                    //         return {
                    //             x: AverageGraphDataX[index],
                    //             y: y,
                    //             marker: {
                    //                 // size: markerSize,
                    //                 size: 4,
                    //                 fillColor: markerColor,
                    //                 strokeColor: '#FFFFFF',
                    //                 strokeWidth: 2,
                    //             },
                    //         };
                    //     }).concat(AverageGraphDataY1.map(function (y, index) {
                    //         var markerColor = y < 19.5 ? '#FF0000' : color2;
                    //         // var markerSize = y >= 19.5 ? 4 : 0; // Set marker size to 0 when line is disabled
                    //         return {
                    //             x: AverageGraphDataX[index],
                    //             y: y,
                    //             marker: {
                    //                 size: 4,
                    //                 fillColor: markerColor,
                    //                 strokeColor: '#FFFFFF',
                    //                 strokeWidth: 2,
                    //             },
                    //         };
                    //     })).concat(averageData.map(function (y, index) {
                    //         var markerColor = y < 19.5 ? '#FF0000' : color3;
                    //         // var markerSize = y >= 19.5 ? 4 : 0; // Set marker size to 0 when line is disabled
                    //         return {
                    //             x: AverageGraphDataX[index],
                    //             y: y,
                    //             marker: {
                    //                 size: 4,
                    //                 fillColor: markerColor,
                    //                 strokeColor: '#FFFFFF',
                    //                 strokeWidth: 2,
                    //             },
                    //         };
                    //     })),
                    //     position: 'front',
                    // }
                });
            }

            
        } else {
        // Handle the case when the selected channels are not available
        // Display an error message or perform alternative logic
        }
    }

    // Add event listener to dropdown1
    sensorDropdown1.addEventListener('change', function() {
        selectedOption1 = Number(sensorDropdown1.options[sensorDropdown1.selectedIndex].getAttribute('id'));
        console.log("inside onmessage from sensorDrop1 -->", selectedOption1);
        optionsSelected = true;
        updateGraph();
        updateAverageDataValue();
        console.log("socket.js: selectedOption1:", selectedOption1);
        // console.log("socket.js: type selectedOption1:", typeof selectedOption1);
    });

    
    // Add event listener to dropdown11
    sensorDropdown11.addEventListener('change', function() {
        selectedOption2 = Number(sensorDropdown11.options[sensorDropdown11.selectedIndex].getAttribute('id'));
        console.log("inside onmessage from sensorDrop11 -->", selectedOption2);
        optionsSelected = true;
        updateGraph();
        updateAverageDataValue();
        console.log("socket.js: selectedOption2:", selectedOption2);
        // console.log("socket.js: type selectedOption2:", typeof selectedOption2);
    });


    if (selectedOption1 !== undefined && selectedOption2 !==undefined){
        // console.log("socket.js: options selected");
        optionsSelected = true;
        updateGraph(); 
        updateAverageDataValue();
    }
    
    
    // Get the current timestamp
    const currentTime = Date.now();


    // Iterate over the update elements and update their inner text
    for (let i = 0; i < channels.length; i++) {
        const elementId = `update${i + 1}`;
        // countDown(elementId);
    }

    // Clear the previous interval if it exists
    if (intervalRef) {
        clearInterval(intervalRef);
    }


    function updateTimeText(dateTime, currentTime) {
        const timestamp = new Date(dateTime).getTime(); // Convert the date and time string to a timestamp
        const secondsDiff = Math.floor((currentTime - timestamp) / 1000); // Calculate the difference in seconds
      
        if (secondsDiff >= 0) {
            const hoursDiff = Math.floor(secondsDiff / 3600); // Calculate the difference in hours
            const minutesDiff = Math.floor((secondsDiff % 3600) / 60); // Calculate the difference in minutes
            const remainingSeconds = secondsDiff % 60; // Calculate the remaining seconds
        
            let timeText = '';
      
            if (hoursDiff >= 1) {
                timeText = `Latest update: ${hoursDiff} hour(s) ${minutesDiff} min(s) ${remainingSeconds} secs ago`;
            }
            else if (minutesDiff >= 1) {
                timeText = `Latest update: ${minutesDiff} min(s) ${remainingSeconds} secs ago`;
            } 
            else {
                timeText = `Latest update: ${remainingSeconds} secs ago`;
            }
        
            return timeText;
        } 
        else {
            return 'Future update';
        }
    }
    
    intervalRef = setInterval(() => {
        const currentTime = Date.now();
        const avg_update_time = document.getElementById('update-avg');
        
        for (let i = 0; i < channels.length; i++) {
            const elementId = `update${i + 1}`;
            const element = document.querySelector(`#${elementId}`);
            
            if (element) {
                const dateTime = data.message.date_time; // Get the date and time string from data.message.date_time
                const timeText = updateTimeText(dateTime, currentTime); // Calculate and format the time text
    
                element.innerText = timeText; // Set the time text as the inner text of the element
            }
        }
        
        if (avg_update_time) {
            const dateTime = data.message.date_time; // Get the date and time string from data.message.date_time
            const timeText = updateTimeText(dateTime, currentTime); // Calculate and format the time text
    
            avg_update_time.innerText = timeText; // Set the time text as the inner text of the element
        }
    }, 1000);
    //Update every second
    

    // Update message level and other html selectors each time we received data from websocket        

    // for (var i = 0; i < charts.length; i++) {
    //     var channelElement = document.querySelector('#channel_' + (i + 1));
    //     var heartbeatElement = document.querySelector('#heart' + (i + 1));
    //     var sensorElement = document.querySelector('#sensor' + (i + 1));

    //     if ( newObject !== undefined){
    //         var levelValue = newObject.data.Channels["ch_" + (i + 1)].value;
    //         var channelIdentifier = newObject.data.Channels["ch_" + (i + 1)].identifier;
    //         // var levelValue = data.message['level_' + (i + 1)];
    //         // console.log("socket.js: line 953", newObject.data.Channels["ch_" + (i + 1)].value);
            
    //         if (levelValue !==undefined && channelIdentifier !== "*"){
    //             sensorElement.innerText = levelValue + "%";
    //         } else {
    //             sensorElement.innerText = 'Disabled';
    //         }

    //         if (channelIdentifier === "*"){
    //             // Code for when the condition is met
    //             channelElement.classList.remove('tiffany_color');
    //             sensorElement.classList.add('gray_color');
    //             sensorElement.classList.remove('tiffany_color');
    //             heartbeatElement.classList.remove('heart_beat');
    //         }

    //     } else {
    //         console.log("socket.js: Data not fetched yet --> NewObject not created!");
    //     }
        
    // }

   
    // let isAnySensorDefined = false;

    // for (var i = 0; i < charts.length; i++) {
    //     if ( newObject !== undefined){
    //         var levelV = newObject.data.Channels["ch_" + (i + 1)].value;
    //         var channelIdentifier = newObject.data.Channels["ch_" + (i + 1)].identifier;
    //         var channelElement = document.querySelector('#channel_' + (i + 1));
    //         var sensorElement = document.querySelector('#sensor' + (i + 1));
    //         var heartbeatElement = document.querySelector('#heart' + (i + 1));
    
    //         // Check if the condition is met for any sensor
    //         if (levelV !==undefined && channelIdentifier !== "*") {
    //             isAnySensorDefined = true;
    //             // Code for when the condition is met
    //             channelElement.classList.add('tiffany_color');
    //             sensorElement.classList.remove('gray_color');
    //             sensorElement.classList.add('tiffany_color');
    //             heartbeatElement.classList.add('heart_beat');
    //             // break;
    //         }
    //     } else {
    //         console.log("socket.js: Data not fetched yet --> NewObject not created!");
    //     }

    // }

    let isAnySensorDefined = false;
    
    for (var i = 0; i < charts.length; i++) {
        var channelElement = document.querySelector('#channel_' + (i + 1));
        var heartbeatElement = document.querySelector('#heart' + (i + 1));
        var sensorElement = document.querySelector('#sensor' + (i + 1));
    
        if (newObject !== undefined) {
            var levelValue = Number(newObject.data.Channels["ch_" + (i + 1)].value).toFixed(2);
            var channelIdentifier = newObject.data.Channels["ch_" + (i + 1)].identifier;
    
            if (levelValue !== undefined && levelValue > 19.5 && channelIdentifier !== "*") {
                sensorElement.innerText = levelValue + "%";
    
                channelElement.classList.add('tiffany_color');
                channelElement.classList.remove('red_color');
                sensorElement.classList.remove('gray_color');
                sensorElement.classList.remove('red_color');
                sensorElement.classList.add('tiffany_color');
                heartbeatElement.classList.remove('heart_beat_red');
                heartbeatElement.classList.add('heart_beat');
            } else if (levelValue !== undefined && levelValue !== 0 && levelValue <= 19.5 && channelIdentifier !== "*") {
                sensorElement.innerText = levelValue + "%";
                
                channelElement.classList.remove('tiffany_color');
                channelElement.classList.add('red_color');
                sensorElement.classList.remove('gray_color');
                sensorElement.classList.remove('tiffany_color');
                sensorElement.classList.add('red_color');
                heartbeatElement.classList.remove('heart_beat');
                heartbeatElement.classList.add('heart_beat_red');
            } 
            else {
                sensorElement.innerText = 'Disabled';
    
                if (channelIdentifier === "*") {
                    channelElement.classList.remove('tiffany_color');
                    channelElement.classList.remove('red_color');
                    sensorElement.classList.add('gray_color');
                    sensorElement.classList.remove('tiffany_color');
                    sensorElement.classList.remove('red_color');
                    heartbeatElement.classList.remove('heart_beat');
                    heartbeatElement.classList.remove('heart_beat_red');
                }
            }
        } else {
            console.log("socket.js: Data not fetched yet --> NewObject not created!");
        }
        
        // Check if the condition is met for any sensor
        if (newObject !== undefined) {
            var levelV = newObject.data.Channels["ch_" + (i + 1)].value;
            var channelIdentifier = newObject.data.Channels["ch_" + (i + 1)].identifier;
    
            if (levelV !== undefined && channelIdentifier !== "*") {
                isAnySensorDefined = true;
            }
        }
    }
    
    // You can use the "isAnySensorDefined" variable as needed outside the loop.
    

     // Show/hide modal based on the condition
    if (!isAnySensorDefined) {
        showModalAlert();
    } else {
        hideModalAlert();
    }

    // Show modal alert
    function showModalAlert() {
        // Only show the modal if it is not already visible
        if (!isModalVisible) {
        const modalElement = document.getElementById('modalAlert');
        modalElement.style.display = 'flex';
        isModalVisible = true;
        }
    }

    // Hide modal alert
    function hideModalAlert() {
        // Only hide the modal if it is currently visible
        if (isModalVisible) {
        const modalElement = document.getElementById('modalAlert');
        modalElement.style.display = 'none';
        isModalVisible = false;
        }
    }

}


