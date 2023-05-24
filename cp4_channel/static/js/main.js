console.log("from main.js file hello!")


// DRAGGABLE MODAL
// Get the modal element

// Make the modal draggable
dragElement(document.getElementById("dragmodal"));

function dragElement(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  element.querySelector('.drag-modal-content').onmousedown = dragMouseDown;

  function dragMouseDown(e) {
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

// Show/hide the modal
function showDragModal() {
  document.getElementById("dragmodal").style.display = "block";
  const navbar = document.querySelector('.top-navbar');
  navbar.classList.remove('active');
}

function hideDragModal() {
  document.getElementById("dragmodal").style.display = "none";
}

// Close the modal when the close button is clicked
document.getElementsByClassName("drag-close")[0].addEventListener("click", hideDragModal);




// function removeDragModal() {
//   const draggableModal = document.getElementById('dragmodal');
//   draggableModal.style.display = 'none';
// }

//toggle rows graph generator
function toggleRows() {
    var dropdown = document.getElementById("graph_dropdown");
    var selectedValue = dropdown.value;
  
    // Hide all rows initially
    var rows = document.getElementsByClassName("row_sensors");
    var btn = document.getElementById("generate_btn")
    btn.style.display = "none";
    for (var i = 0; i < rows.length; i++) {
      rows[i].style.display = "none";
    }
  
    // Show the selected number of rows
    for (var j = 1; j <= selectedValue; j++) {
      var row = document.getElementById("row_" + j);
      row.style.display = "block";
      btn.style.display = "block";
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
      } else {
        sourceOptions[i].disabled = false;
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

    // Update the channels array with the received data
for (var i = 0; i < channels.length; i++) {
    channels[i].push([data.message.date_time, data.message['level_' + (i + 1)]]);
    if (channels[i].length > 20) {
        channels[i].shift(); // Remove the first element
    }
}

    for (var i = 0; i < charts.length; i++){
        channels[i].push([data.message.date_time, data.message['level_' + (i + 1)]]);
    }

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

    // Iterate over the update elements and update their inner text
    for (let i = 0; i < channels.length; i++) {
        const elementId = `update${i + 1}`;
        updateInnerHTML(elementId);
    }

    // Clear the previous interval if it exists
    if (intervalRef) {
        clearInterval(intervalRef);
    }

    // Update the time difference every second

    intervalRef = setInterval(() => {
        const currentTime = Date.now();
        for (let i = 0; i < channels.length; i++) {
        const elementId = `update${i + 1}`;
        const element = document.querySelector(`#${elementId}`);
        if (element) {
            const dateTime = data.message.date_time; // Get the date and time string from data.message.date_time
            const timestamp = new Date(dateTime).getTime(); // Convert the date and time string to a timestamp
            const secondsDiff = Math.floor((currentTime - timestamp) / 1000); // Calculate the difference in seconds
            const timeText = (secondsDiff >= 0) ? `Latest update: ${secondsDiff} sec ago` : 'Future update'; // Format the time text

            element.innerText = timeText; // Set the time text as the inner text of the element
        }
        }
    }, 1000);

    //Update every second
    

    // Update message level and other html selectors each time we received data from websocket

    for (var i = 0; i < charts.length; i++) {
        var sensorElement = document.querySelector('#sensor' + (i + 1));
        var channelElement = document.querySelector('#channel_' + (i + 1));
        var heartbeatElement = document.querySelector('#heart' + (i + 1));
        var levelValue = data.message['level_' + (i + 1)];
        sensorElement.innerText = (levelValue !== undefined) ? levelValue + '%' : 'Disabled';
        if (levelValue === undefined){
            // Code for when the condition is met
            channelElement.classList.remove('tiffany_color');
            sensorElement.classList.add('gray_color');
            sensorElement.classList.remove('tiffany_color');
            heartbeatElement.classList.remove('heart_beat');
        }
    }

   

   

    let isAnySensorDefined = false;

    for (var i = 0; i < charts.length; i++) {
        var channelElement = document.querySelector('#channel_' + (i + 1));
        var sensorElement = document.querySelector('#sensor' + (i + 1));
        var heartbeatElement = document.querySelector('#heart' + (i + 1));

        // Check if the condition is met for any sensor
        if (data.message['level_' + (i + 1)] !== undefined) {
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




