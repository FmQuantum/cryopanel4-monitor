console.log("from main.js file hello!")

let secondsDiff;

// Countdown timer logic
var countdownElement = document.getElementById('countdown-timer');
var countdown = 60; // Starting countdown value

function startCountdown(value) {
    countdownElement.textContent = countdown - value;

    var countdownInterval = setInterval(function() {
        countdown--;
        countdownElement.textContent = countdown;

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown-div').style.display = 'none';
        }
    }, 1000);
}

// Call the startCountdown function when needed
// startCountdown();

var dataFromViews = "{{ data }}";
console.log(dataFromViews);

function validateOptions() {
    console.log("function validation triggered");
    var sensorDropdown1 = document.getElementById("sensor_dropdown_1");
    var sensorDropdown2 = document.getElementById("sensor_dropdown_11");

    var selectedSensor1 = sensorDropdown1.value;
    var selectedSensor2 = sensorDropdown2.value;

    var generateBtn = document.getElementById("generate_btn");

    if (selectedSensor1 !== "--" && selectedSensor2 !== "--" && selectedSensor1 !== selectedSensor2) {
        generateBtn.disabled = false;
    } else {
        generateBtn.disabled = true;
    }
}

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


document.addEventListener("DOMContentLoaded", function() {
    // Your JavaScript code here
    // Make the modal draggable
    const modal = document.getElementById("dragmodal");
    const modalContent = modal.querySelector(".drag-modal-content");
    const closeButton = modal.querySelector(".drag-close");

    dragElement(modal);

    function dragElement(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        modalContent.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target === closeButton) {
            return; // Skip dragging if clicking on the close button
            }
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

});

function closeModal() {
    console.log("clicked");
    modal.style.display = "none";
    resetSensorValues();

}

// Show/hide the modal
function showDragModal() {
    // document.getElementById('countdown-div').style.display = 'block';
    var dropdown = document.getElementById("graph_dropdown");
    document.getElementById("dragmodal").style.display = "block";
    const logoImage = document.getElementById('logo-quantum');
    const navbar = document.querySelector('.top-navbar');
    navbar.classList.remove('active');
    logoImage.src = staticUrl + 'images/icon/quantum-logo.png';
    dropdown.value = "--";
    toggleRows();
    // startCountdown();
    
}

function hideDragModal() {
  document.getElementById("dragmodal").style.display = "none";
}

// Close the modal when the close button is clicked
document.getElementsByClassName("drag-close")[0].addEventListener("click", hideDragModal);


//toggle rows graph generator
function toggleRows() {
    var dropdown = document.getElementById("graph_dropdown");
    var sensorDropdown1 = document.getElementById("sensor_dropdown_1");
    var sensorDropdown2 = document.getElementById("sensor_dropdown_11");
    var selectedValue = dropdown.value;

    var btn = document.getElementById("generate_btn");

    if (dropdown.value === "--"){
        sensorDropdown1.value = "--";
        sensorDropdown2.value = "--";
    }

    // Hide all rows initially
    var rows = document.getElementsByClassName("row_sensors");
    btn.style.display = "none";
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.display = "none";
    }

    if (selectedValue !== "--") {
        // Show the selected number of rows
        for (var j = 1; j <= selectedValue; j++) {
            var row = document.getElementById("row_" + j);
            row.style.display = "block";
        }

        btn.style.display = "block";
        if (sensorDropdown1.value === "--" && sensorDropdown2.value === "--") {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
       
    } else {
        
        btn.disabled = true;
    }       
}

function disableSelectedOptions(sourceDropdownId, targetDropdownId) {
    var sourceDropdown = document.getElementById(sourceDropdownId);
    var targetDropdown = document.getElementById(targetDropdownId);
    var sourceOptions = sourceDropdown.options;
    var targetOptions = targetDropdown.options;
    
    var selectedValue = sourceDropdown.value;
    
    for (var i = 0; i < sourceOptions.length; i++) {
      if (sourceOptions[i].value !== '--' && sourceOptions[i].value === targetDropdown.value) {
        sourceOptions[i].disabled = true;
        console.log("true");
      } else {
        sourceOptions[i].disabled = false;
        console.log("false");
      }
    }
    
    for (var j = 0; j < targetOptions.length; j++) {
      if (targetOptions[j].value !== '--' && targetOptions[j].value === selectedValue) {
        targetOptions[j].disabled = true;
      } else {
        targetOptions[j].disabled = false;
      }
    }

}

// change logo when hamburger menu is toggled
const staticUrl = '/static/';

function toggleMenu() {
    const navbar = document.querySelector('.top-navbar');
    const logoImage = document.getElementById('logo-quantum');
  
    if (navbar.classList.contains('active')) {
      // Menu is active, switch to default logo
      logoImage.src = staticUrl + 'images/icon/quantum-logo.png';
    } else {
      // Menu is not active, switch to yellow logo
      logoImage.src = staticUrl + 'images/icon/quantum-yellow-logo.png';
    }
  
    navbar.classList.toggle('active');
    disableSelectedOptions(sourceDropdownId, targetDropdownId)
}


var graphWrappers = document.querySelectorAll('.graph-wrapper');
var charts = [];
var channels = [];
var levelTresholdLighRed = 19.5;
var levelTresholdRed = 18.9;
var isModalVisible = false; // Flag to track modal visibility


// Loop through each graph wrapper and initialize the chart
graphWrappers.forEach(function (wrapper, index) {
    var options = {
        series: [{
            name: "Values",
            data: [0]
        }],
        chart: {
            foreColor: '#ffffff',
            height: 350,
            type: 'area',
            zoom: {
                enabled: false
            },
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            toolbar: {
                show: false,
            }
        },
        grid: {
            show: false,
        },
        colors: ['#00FEFC'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        title: {
            text: 'O2',
            align: 'center'
        },
        xaxis: {
            type: 'datetime',
            flotaing: false,
            labels: {
                formatter: function (value, timestamp) {
                    // return new Date(timestamp) // The formatter function overrides format property
                    const date = new Date(timestamp);
                    const formattedDate = date.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                    return formattedDate;
                },
                show: true,
                trim: true,
            },
            
            stroke: {},
            categories: [],
        },
        yaxis: {
            min: 0,
            max: 24,
        },
    };

    var chart = new ApexCharts(wrapper, options);
    // console.log("chart --->", chart);
    chart.render();

    // Assign a dynamic ID to the graph wrapper element
    wrapper.id = 'graph_' + (index + 1);

    charts.push(chart);
    channels.push([]);

});


var dropdown1 = document.getElementById('sensor_dropdown_1');
var dropdown11 = document.getElementById('sensor_dropdown_11');
// var dropdown2 = document.getElementById('sensor_dropdown_2');
// var dropdown22 = document.getElementById('sensor_dropdown_22');
// var dropdown3 = document.getElementById('sensor_dropdown_3');
// var dropdown33 = document.getElementById('sensor_dropdown_33');
var selectedOption1;
var selectedOption2;
var AverageGraphDataY4;
var AverageGraphDataY1;
var AverageGraphDataX;
var optionsSelected = false;

// Average Graph
const ctx = document.getElementById('averagechart');

    var averageOptions = { 
        series: [{
            name: "Values1",
            data: [],
            color: ['#00FEFC']
        },{
            name: "Values2",
            data: [],
            color: ['#00FEFC']
        },{
            name: "Average",
            data: [],
            color: ['#00FEFC']
        }],
        chart: {
            foreColor: '#ffffff',
            height: 280,
            // width: 425,
            type: 'area',
            zoom: {
                enabled: false
            },
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            toolbar: {
                show: false,
            }
        },
        grid: {
            show: false,
        },
        // colors: ['#00FEFC'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        title: {
            text: 'O2',
            align: 'center'
        },
        xaxis: {
            type: 'datetime',
            flotaing: false,
            labels: {
                formatter: function (value, timestamp) {
                    // return new Date(timestamp) // The formatter function overrides format property
                    const date = new Date(timestamp);
                    const formattedDate = date.toLocaleString('en-GB', {
                        // day: '2-digit',
                        // month: '2-digit',
                        // year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                    return formattedDate;
                },
                show: true,
                trim: true,
            },
            stroke: {},
            categories: [],
        },
        yaxis: {
            min: 0,
            max: 24,
        },
        
    }

var myAverageChart = new ApexCharts(ctx, averageOptions);
myAverageChart.render();





// Define a variable to store the interval reference
let intervalRef;

// open connection with websocket
var socket = new WebSocket('ws://localhost:8000/ws/some_url/');
socket.onmessage = function (event) {

    var data = JSON.parse(event.data);
    var parsedObject;
    var channelsObj;
    console.log("raw msg -->", data, "type -->", typeof data);
    var messageObject = data.message;
    console.log("messageObject --->", messageObject);

    var jsonString = messageObject.data.replace(/^[^{\[]+/, ''); // Remove leading non-JSON characters
    console.log("jsonString --->", jsonString, typeof jsonString);
    
    if (jsonString.trim() === '') {
        console.log('Raw message is empty.');
    } else {
        var parsedObject = JSON.parse(jsonString);
        var msgObj = {
            data: {
                meta: parsedObject.meta,
                headers: parsedObject.headers,
                data: parsedObject.data,
                date_time: messageObject.date_time
            }
        };
        console.log("msgObj --->", msgObj);
    }


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
        var newObject = {
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
        
        console.log("newObject -->", newObject);
        }
    
    var value;
    var roundedValue;
    // startCountdown(secondsDiff);
    for (var i = 0; i < channels.length; i++) {
        if (newObject !== undefined) {
                console.log("channels from new raw msg", data.message.data);
                console.log("channels length -->", channels.length);
                console.log("i in channels -->", i);
                console.log("Channels in new obj --->", newObject.data.Channels)
                value = newObject.data.Channels['ch_' + (i + 1)]["value"];
                console.log("value ->", value, "type ->", typeof value);
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
    console.log("Channels initialized with default value '0' and date-time from consumer.py -->",  channels);

    
    var color;
    var lastValue;
    for (var i = 0; i < charts.length; i++) {
        var newGraphDataY = channels[i].map(function (data) {
            // dataStr = data[1].toFixed(2);
            dataStr = data[1];

            console.log("dataStr ->", dataStr);
            // return data[1] !== undefined ? data[1] : 0;
            return dataStr
        });
        console.log("newGraphDataY --->", "channel:", i + 1, newGraphDataY, "type ->", typeof newGraphDataY);
        
        var newGraphDataX = channels[i].map(function (data) {
            return new Date(data[0]).getTime(); // Convert date-time string to timestamp
        });
        console.log("newGraphDataX --->","channel:", i + 1, newGraphDataX);

        color = '#00FEFC'; // Default color
        if ( channels[i][(channels[i].length - 1)] !==undefined){
            lastValue = channels[i][channels[i].length - 1][1];
            console.log("lastValue for each channels array -->", lastValue);
        }
        lastValue = Number(lastValue);
        

        if (lastValue <= levelTresholdLighRed && lastValue > levelTresholdRed) {
            color = '#FF758D'; // Change the color if the value meets the threshold condition
        } else if (lastValue <= levelTresholdRed) {
            color = '#FF0000'; // Change the color if the value meets the threshold condition
        } 
        else {
            color = '#00fefc'
        }

        // add markers and custom marger for datapoint below 19.5%
        var markerFillColor = '#00FEFC'; // Default marker color
        if (lastValue < 19.5) {
            markerFillColor = '#FF0000'; // Change the marker color for data points below 19.5%
        }


        

        var chart = charts[i];
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

        });


    }
    console.log("channels --->", channels);
    console.log("charts --->", charts);



//    // Update the AverageChart

    var averageData = [];
    console.log("avgData->", averageData);
    
    
    var AverageGraphDataY4;
    var AverageGraphDataY1;

    console.log("averageData array ->", averageData);
     
    function updateAverageDataValue(){
        var averageValue = averageData[averageData.length - 1];

        if (typeof averageValue === 'undefined') {
            averageValue = 0;
            console.log("avg value from if ->", averageValue);
            document.getElementById("average_data").innerHTML = averageValue + "%";
        } else {
            console.log("avg value from else ->", averageValue);
            document.getElementById("average_data").innerHTML = averageValue + "%";
        }
        
    }
    
    function updateGraph() {
        // console.log("updateGrapg function triggered");

        if (channels[selectedOption1] && channels[selectedOption2]) {
            AverageGraphDataY4 = channels[selectedOption1].map(function (data) {
              return data[1] !== undefined ? Number(data[1]) : 0;
            });
            AverageGraphDataY1 = channels[selectedOption2].map(function (data) {
              return data[1] !== undefined ? Number(data[1]) : 0;
            });        
            AverageGraphDataX = channels[selectedOption1].map(function (data) {
              return new Date(data[0]).getTime(); // Convert date-time string to timestamp
            });

            if (AverageGraphDataY4 && AverageGraphDataY1 && AverageGraphDataY4.length === AverageGraphDataY1.length) {
                var average;
                for (var i = 0; i < AverageGraphDataY4.length; i++) {
                    average = ((AverageGraphDataY4[i] + AverageGraphDataY1[i]) / 2);
                    console.log("average before push to array->", average);
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
    dropdown1.addEventListener('change', function() {
        selectedOption1 = Number(dropdown1.options[dropdown1.selectedIndex].getAttribute('id'));
        optionsSelected = true;
        updateGraph();
        updateAverageDataValue();
        console.log("selectedOption1:", selectedOption1);
        console.log("type selectedOption1:", typeof selectedOption1);
    });

    
    // Add event listener to dropdown11
    dropdown11.addEventListener('change', function() {
        selectedOption2 = Number(dropdown11.options[dropdown11.selectedIndex].getAttribute('id'));
        optionsSelected = true;
        updateGraph();
        updateAverageDataValue();
        console.log("selectedOption2:", selectedOption2);
        console.log("type selectedOption2:", typeof selectedOption2);
    });


    if (selectedOption1 !== undefined && selectedOption2 !==undefined){
        console.log("options selected");
        optionsSelected = true;
        updateGraph(); 
        updateAverageDataValue();
    }
    
    
    // Get the current timestamp
    const currentTime = Date.now();


    // Function to check and update the innerHTML of the element

    function updateInnerHTML(elementId) {
        const element = document.querySelector(`#${elementId}`);
        if (element && element.innerHTML === '') {
            const dateTime = data.message.date_time; // Get the date and time string from data.message.date_time
            const timestamp = new Date(dateTime).getTime(); // Convert the date and time string to a timestamp
            const secondsDiff = Math.floor((currentTime - timestamp) / 1000); // Calculate the difference in seconds
            const timeText = (secondsDiff >= 0) ? `Latest update: ${secondsDiff} sec ago` : 'Future update'; // Format the time text

            element.innerText = timeText; // Set the time text as the inner text of the element
        }
    }

    const update_time_avg = 'update-avg';
    updateInnerHTML(update_time_avg);

    // Iterate over the update elements and update their inner text
    for (let i = 0; i < channels.length; i++) {
        const elementId = `update${i + 1}`;
        updateInnerHTML(elementId);
    }

    // Clear the previous interval if it exists
    if (intervalRef) {
        clearInterval(intervalRef);
    }


    function updateTimeText(dateTime, currentTime) {
        const timestamp = new Date(dateTime).getTime(); // Convert the date and time string to a timestamp
        secondsDiff = Math.floor((currentTime - timestamp) / 1000); // Calculate the difference in seconds
        return (secondsDiff >= 0) ? `Latest update: ${secondsDiff} sec ago` : 'Future update'; // Format the time text
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

    for (var i = 0; i < charts.length; i++) {
        var channelElement = document.querySelector('#channel_' + (i + 1));
        var heartbeatElement = document.querySelector('#heart' + (i + 1));
        var sensorElement = document.querySelector('#sensor' + (i + 1));

        var levelValue = newObject.data.Channels["ch_" + (i + 1)].value;
        var channelIdentifier = newObject.data.Channels["ch_" + (i + 1)].identifier;
        
        // var levelValue = data.message['level_' + (i + 1)];
        // console.log("line 953", newObject.data.Channels["ch_" + (i + 1)].value);
        
        if (levelValue !==undefined && channelIdentifier !== "*"){
            sensorElement.innerText = levelValue + "%";
        } else {
            sensorElement.innerText = 'Disabled';
        }

        if (channelIdentifier === "*"){
            // Code for when the condition is met
            channelElement.classList.remove('tiffany_color');
            sensorElement.classList.add('gray_color');
            sensorElement.classList.remove('tiffany_color');
            heartbeatElement.classList.remove('heart_beat');
        }
    }

   
    let isAnySensorDefined = false;

    for (var i = 0; i < charts.length; i++) {
        var levelV = newObject.data.Channels["ch_" + (i + 1)].value;
        var channelIdentifier = newObject.data.Channels["ch_" + (i + 1)].identifier;
        var channelElement = document.querySelector('#channel_' + (i + 1));
        var sensorElement = document.querySelector('#sensor' + (i + 1));
        var heartbeatElement = document.querySelector('#heart' + (i + 1));

        // Check if the condition is met for any sensor
        if (levelV !==undefined && channelIdentifier !== "*") {
            isAnySensorDefined = true;
            // Code for when the condition is met
            channelElement.classList.add('tiffany_color');
            sensorElement.classList.remove('gray_color');
            sensorElement.classList.add('tiffany_color');
            heartbeatElement.classList.add('heart_beat');
            // break;
        }

    }

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


const animationKeyframes = `
    @keyframes blink {
        0% {
            opacity: 1;
        }
        20% {
            opacity: 0;
        }
        60% {
            opacity: 0.75;
        }
        100% {
            opacity: 1;
        }
    }
`;

document.addEventListener('DOMContentLoaded', function() {
    

    try {
        // Get the modal element
        const modal = document.querySelector('.modal');
      
        // Get the countdown element
        const countdownElement = document.getElementById('countdown');
      
        // Set the initial countdown value
        let countdownValue = 60;
      
        // Function to update the countdown
        function updateCountdown() {
          countdownElement.textContent = countdownValue;
          countdownValue--;
      
          if (countdownValue < 0) {
            // Hide the modal when countdown reaches 0
            modal.style.display = 'none';
          } else {
            // Call the function again after 1 second
            setTimeout(updateCountdown, 1000);
          }
        }
      
        // Call the function to start the countdown
        updateCountdown();
      } catch (error) {
        // Handle the error as an exception
        console.error('The modal has been removed because data has been retrived:', error);
      }

    

    const durationInSeconds = 2.5;
    const removeAfterSeconds = 60;
    const animationKeyframes = `
        @keyframes blink {
            0% {
                opacity: 1;
            }
            20% {
                opacity: 0;
            }
            60% {
                opacity: 0.75;
            }
            100% {
                opacity: 1;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = animationKeyframes;
    document.head.appendChild(styleSheet);

    const sensorElements = document.querySelectorAll('.latest_reading');
    if (sensorElements) {
        sensorElements.forEach((sensorElement) => {
            sensorElement.classList.add('gray_color');
            sensorElement.style.animation = `blink ${durationInSeconds}s infinite`;

            setTimeout(() => {
                sensorElement.style.animation = '';
            }, removeAfterSeconds * 1000);
            
        });
    }
});
