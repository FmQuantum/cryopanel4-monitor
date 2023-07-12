// console.log("main.js: file hello!")

// logic for tooltip CustomName

function addTooltipCustomName(btn, tooltipText) {
    var tooltip = document.createElement('span');
    tooltip.className = 'tooltipCutomName';
    tooltip.textContent = tooltipText;
    tooltip.style.visibility = 'hidden'; // Set initial visibility to hidden
    btn.appendChild(tooltip);
    btn.tooltipElement = tooltip; // Store tooltip element as a property of the button
  
    btn.addEventListener('mouseover', function() {
      btn.tooltipElement.style.visibility = 'visible';
    });
  
    btn.addEventListener('mouseout', function() {
      btn.tooltipElement.style.visibility = 'hidden';
    });

    // btn.addEventListener('click', function() {
    // // Toggle the visibility of the tooltip element
    //     var tooltipVisibility = btn.tooltipElement.style.visibility;
    //     if (tooltipVisibility === 'visible') {
    //         btn.tooltipElement.style.visibility = 'hidden';
    //     } 
    //     else {
    //         btn.tooltipElement.style.visibility = 'visible';
    //     }
    // });

}

const sensor_name1 = document.getElementById('channel_1');
const sensor_name2 = document.getElementById('channel_2');
const sensor_name3 = document.getElementById('channel_3');
const sensor_name4 = document.getElementById('channel_4');

addTooltipCustomName(sensor_name1, 'Click "Sensor" to add a custom name');
addTooltipCustomName(sensor_name2, 'Click "Sensor" to add a custom name');
addTooltipCustomName(sensor_name3, 'Click "Sensor" to add a custom name');
addTooltipCustomName(sensor_name4, 'Click "Sensor" to add a custom name');


function toggleInputDisplay(btn) {
    var inputElement = btn.querySelector('.custom-name-input');
    if (inputElement.style.display === 'none') {
      inputElement.style.display = 'inline';
    } else {
      inputElement.style.display = 'none';
    }
}
  
var sensorDivs = document.querySelectorAll('.sensor_name');
    sensorDivs.forEach(function(div) {
    div.addEventListener('click', function() {
        toggleInputDisplay(this);
    });
});


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

// reset radiobutton
function resetRadioButtons() {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radioButton => {
      radioButton.checked = false;
    });
}

// reset options 
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
  


function validateOptions() {
    // console.log("main.js: function validation triggered");
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
    // console.log("main.js: clicked");
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

// function disableSelectedOptions(sourceDropdownId, targetDropdownId) {
//     var sourceDropdown = document.getElementById(sourceDropdownId);
//     var targetDropdown = document.getElementById(targetDropdownId);
//     var sourceOptions = sourceDropdown.options;
//     var targetOptions = targetDropdown.options;
    
//     var selectedValue = sourceDropdown.value;
    
//     for (var i = 0; i < sourceOptions.length; i++) {
//       if (sourceOptions[i].value !== '--' && sourceOptions[i].value === targetDropdown.value) {
//         sourceOptions[i].disabled = true;
//         console.log("main.js: true");
//       } else {
//         sourceOptions[i].disabled = false;
//         console.log("main.js: false");
//       }
//     }
    
//     for (var j = 0; j < targetOptions.length; j++) {
//       if (targetOptions[j].value !== '--' && targetOptions[j].value === selectedValue) {
//         targetOptions[j].disabled = true;
//       } else {
//         targetOptions[j].disabled = false;
//       }
//     }

// }

function disableSelectedOptions(dropdown1Id, dropdown2Id) {
    var dropdown1 = document.getElementById(dropdown1Id);
    var dropdown2 = document.getElementById(dropdown2Id);
    
   
    // Disable the selected option in dropdown2
    var selectedOptionValue = dropdown1.value;
    for (var i = 0; i < dropdown2.options.length; i++) {
      if (dropdown2.options[i].value === selectedOptionValue) {
        dropdown2.options[i].disabled = true;
        break;
      }
    }
  }



// change logo when hamburger menu is toggled
const staticUrl = '/static/';

function toggleMenu() {
    const navbar = document.querySelector('.top-navbar');
    const logoImage = document.getElementById('logo-quantum');
  
    if (navbar.classList.contains('active')) {
      // Menu is not active, switch to default logo
      logoImage.src = staticUrl + 'images/icon/quantum-logo.png';
      resetRadioButtons();
      resetDropdownOptions()
    } else {
      // Menu is active, switch to yellow logo
      logoImage.src = staticUrl + 'images/icon/quantum-yellow-logo.png';
    }
  
    navbar.classList.toggle('active');

}

// Inizialize Graphs
var graphWrappers = document.querySelectorAll('.graph-wrapper');
var charts = [];
var channels = [];
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
            text: '',
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
    // console.log("main.js: chart --->", chart);
    chart.render();

    // Assign a dynamic ID to the graph wrapper element
    wrapper.id = 'graph_' + (index + 1);

    charts.push(chart);
    channels.push([]);


    // HANDLE ---> Unexpected value NaN parsing cx attribute. Unexpected value NaN parsing x1 attribute. Unexpected value NaN parsing x2 attribute.

    // Check and handle cx attribute error
    if (typeof chart.w.config.chart.cx !== 'number' || isNaN(chart.w.config.chart.cx)) {
        chart.w.config.chart.cx = 0; // Set fallback value for cx
    }
  
    // Check and handle x1 and x2 attribute errors
    if (chart.w.config.annotations && Array.isArray(chart.w.config.annotations.xaxis) && chart.w.config.annotations.xaxis.length > 0) {
        var xaxis = chart.w.config.annotations.xaxis[0];
        if (typeof xaxis.x1 !== 'number' || isNaN(xaxis.x1)) {
        xaxis.x1 = 0; // Set fallback value for x1
        }
        if (typeof xaxis.x2 !== 'number' || isNaN(xaxis.x2)) {
        xaxis.x2 = 100; // Set fallback value for x2
        }
    }

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

//// Inizialize Average Graph
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
            text: '',
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
        console.error('main.js: The modal has been removed because data has been retrived:', error);
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



