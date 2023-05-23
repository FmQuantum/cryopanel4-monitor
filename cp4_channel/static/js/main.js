console.log("from main.js file hello!")

var graphWrappers = document.querySelectorAll('.graph-wrapper');
var charts = [];
var channels = [];
var levelTresholdLighRed = 19.5;
var levelTresholdRed = 18.9;

// Loop through each graph wrapper and initialize the chart
graphWrappers.forEach(function (wrapper, index) {
    var options = {
        series: [{
            name: "Values",
            data: []
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


// Define a variable to store the interval reference
let intervalRef;

// open connection with websocket
var socket = new WebSocket('ws://localhost:8000/ws/some_url/');
socket.onmessage = function (event) {

    var data = JSON.parse(event.data);
    console.log(data);

    for (var i = 0; i < charts.length; i++){
        channels[i].push([data.message.date_time, data.message['level_' + (i + 1)]]);
    }

    // channels[0].push([data.message.date_time, data.message.level_1]);
    // channels[1].push([data.message.date_time, data.message.level_2]);
    // channels[2].push([data.message.date_time, data.message.level_3]);
    // channels[3].push([data.message.date_time, data.message.level_4]);
    

    // Limit the number of elements in the channels array to 20
    for (var i = 0; i < channels.length; i++) {
        if (channels[i].length > 20) {
            channels[i].shift(); // Remove the first element
        }
    }


    for (var i = 0; i < charts.length; i++) {
        var newGraphDataY = channels[i].map(function (data) {
            return data[1] !== undefined ? data[1] : 0;
        });
        console.log("newGraphDataY --->", "channel:", i + 1, newGraphDataY);
        
        var newGraphDataX = channels[i].map(function (data) {
            return new Date(data[0]).getTime(); // Convert date-time string to timestamp
        });
        console.log("newGraphDataX --->","channel:", i + 1, newGraphDataX);

        var color = '#00FEFC'; // Default color
        var lastValue = channels[i][channels[i].length - 1][1];

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
                data: newGraphDataY
            }],
            xaxis: {
                categories: newGraphDataX
            },
            colors: [color], // Set the color dynamically
            annotations: {
                points: newGraphDataY.map(function (y, index) {
                    var markerColor = y < 19.5 ? '#FF0000' : markerFillColor;
                    return {
                        x: newGraphDataX[index],
                        y: y,
                        marker: {
                            size: 4,
                            fillColor: markerColor,
                            strokeColor: '#FFFFFF',
                            strokeWidth: 2,
                        },
                    };
                }),
                position: 'front',
            },

        });
    }
    console.log("channels --->", channels);
    console.log("charts --->", charts);


    // document.querySelector('#update1').innerText = data.message.date_time;
    // document.querySelector('#update2').innerText = data.message.date_time;
    // document.querySelector('#update3').innerText = data.message.date_time;
    // document.querySelector('#update4').innerText = data.message.date_time;
    
    // Get the current timestamp
    const currentTime = Date.now();

    // Iterate over the update elements and update their inner text
    for (let i = 1; i < channels.length; i++) {
        const elementId = `update${i}`;
        const element = document.querySelector(`#${elementId}`);
        if (element) {
        const dateTime = data.message.date_time; // Get the date and time string from data.message.date_time
        const timestamp = new Date(dateTime).getTime(); // Convert the date and time string to a timestamp
        const secondsDiff = Math.floor((currentTime - timestamp) / 1000); // Calculate the difference in seconds
        const timeText = (secondsDiff >= 0) ? `${secondsDiff} seconds ago` : 'Future update'; // Format the time text

        element.innerText = timeText; // Set the time text as the inner text of the element
        }
    }

    // Clear the previous interval if it exists
    if (intervalRef) {
        clearInterval(intervalRef);
    }

    // Update the time difference every second
    intervalRef = setInterval(() => {
        const currentTime = Date.now();
        for (let i = 1; i <= 4; i++) {
        const elementId = `update${i}`;
        const element = document.querySelector(`#${elementId}`);
        if (element) {
            const dateTime = data.message.date_time; // Get the date and time string from data.message.date_time
            const timestamp = new Date(dateTime).getTime(); // Convert the date and time string to a timestamp
            const secondsDiff = Math.floor((currentTime - timestamp) / 1000); // Calculate the difference in seconds
            const timeText = (secondsDiff >= 0) ? `Latest update: ${secondsDiff} sec ago` : 'Future update'; // Format the time text

            element.innerText = timeText; // Set the time text as the inner text of the element
        }
        }
    }, 1000); // Update every second

    // Update message level each time we received data from websocket

    // document.querySelector('#sensor1').innerText = data.message.level_1 || 'Disabled';
    // document.querySelector('#sensor2').innerText = data.message.level_2 || 'Disabled';
    // document.querySelector('#sensor3').innerText = data.message.level_3 || 'Disabled';
    // document.querySelector('#sensor4').innerText = data.message.level_4 || 'Disabled';

    for (var i = 0; i < charts.length; i++) {
        var sensorElement = document.querySelector('#sensor' + (i + 1));
        var levelValue = data.message['level_' + (i + 1)];
        sensorElement.innerText = (levelValue !== undefined) ? levelValue + '%' : 'Disabled';
    }

    // Remove animation class if data is not undefined and add reading_value class

    // if (data.message.level_1 !== undefined) {
    //     const channel_1 = document.querySelector('#channel_1');
    //     const sensor1 = document.querySelector('#sensor1');
    //     const heartbeat1 = document.querySelector('#heart1');
    //     channel_1.classList.add('color_name');
    //     sensor1.classList.remove('reading_undefined');
    //     heartbeat1.classList.remove('heartbeat_color');
    //     heartbeat1.classList.add('heart_beat'); 
    // // sensor1.classList.add('reading_value');
    // }
    // if (data.message.level_2 !== undefined) {
    //     const channel_2 = document.querySelector('#channel_2');
    //     const sensor2 = document.querySelector('#sensor2');
    //     const heartbeat2 = document.querySelector('#heart2');
    //     channel_2.classList.add('color_name');
    //     sensor2.classList.remove('reading_undefined');
    //     heartbeat2.classList.remove('heartbeat_color');
    //     heartbeat2.classList.add('heart_beat'); 
    //     // sensor2.classList.add('reading_value');
    // }
    // if (data.message.level_3 !== undefined) {
    //     const channel_3 = document.querySelector('#channel_3');
    //     const sensor3 = document.querySelector('#sensor3');
    //     const heartbeat3 = document.querySelector('#heart3');
    //     channel_3.classList.add('color_name');
    //     sensor3.classList.remove('reading_undefined');
    //     heartbeat3.classList.remove('heartbeat_color');
    //     heartbeat3.classList.add('heart_beat');
    //     // sensor3.classList.add('reading_value');
    // }
    // if (data.message.level_4 !== undefined) {
    //     const channel_4 = document.querySelector('#channel_4');
    //     const sensor4 = document.querySelector('#sensor4');
    //     const heartbeat4 = document.querySelector('#heart4');
    //     channel_4.classList.add('color_name');
    //     heartbeat4.classList.remove('heartbeat_color');
    //     heartbeat4.classList.add('heart_beat'); 
    //     sensor4.classList.remove('reading_undefined');
    //     // sensor4.classList.add('reading_value');
    // }

    for (var i = 0; i < charts.length; i++) {
        var channelElement = document.querySelector('#channel_' + (i + 1));
        var sensorElement = document.querySelector('#sensor' + (i + 1));
        var heartbeatElement = document.querySelector('#heart' + (i + 1));
    
    
        // if (data.message['level_' + (i + 1)] !== undefined) {
        //     channelElement.classList.add('tiffany_color');
        //     sensorElement.classList.remove('gray_color');
        //     sensorElement.classList.add('tiffany_color');
        //     // heartbeatElement.classList.remove('gray_color');
        //     heartbeatElement.classList.add('heart_beat');
        // }


        // Show modal alert
        function showModalAlert() {
            const modalElement = document.getElementById('modalAlert');
            modalElement.style.display = 'flex';
        }
        
        // Hide modal alert
        function hideModalAlert() {
            const modalElement = document.getElementById('modalAlert');
            modalElement.style.display = 'none';
        }

        // Check the condition and show/hide modal accordingly
        if (data.message['level_' + (i + 1)] === undefined) {
            showModalAlert();
        } else {
            // Code for when the condition is met
            channelElement.classList.add('tiffany_color');
            sensorElement.classList.remove('gray_color');
            sensorElement.classList.add('tiffany_color');
            heartbeatElement.classList.add('heart_beat');
        
            // Hide the modal alert if it is shown
            hideModalAlert();
        }

    }

}



// const durationInSeconds = 60;
// const secondDurations = 61;

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
            
            // if (sensorElement.innerHTML.trim() === 'Disabled') {

            //     setTimeout(() => {
            //         sensorElement.classList.remove('tiffany_color');
            //         sensorElement.classList.add('gray_color');
            //     }, 1000);
            // }
            
        });
    }

    

});




