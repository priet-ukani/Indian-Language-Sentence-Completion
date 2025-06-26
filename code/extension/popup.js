/**
 * This script is executed when the Extension Main Menu is opened.
 * It is responsible for handling the user interactions with the Extension Main Menu.
 * 
 */

// This function is responsible for sending a message to the content script to toggle buttons.
function send_response(state,type){
  // Sending on/off state of Enable Extension Button to the content script
  if(type=='toggle_enable'){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'performAction_enable', data: state }, (response) => {
        // Handle the response from the content script (optional)
        if (response && response.success) {
          console.log('New state fo Enable Extension:', state);
        } 
      });
    }
  });
}

// Sending on/off state of ThinText Extension Button to the content script
if(type=='toggle_thintext'){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'performAction_thintext', data: state }, (response) => {
        if (response && response.success) {
          console.log('New state fo ThinText Extension:', state);
        } 
      });
    }
  });
}

// Sending the number of predictions to the content script
if(type=='send_number_of_predictions'){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'send_number_of_predictions', data: state }, (response) => {
        if (response && response.success) {
          console.log('Number of Predictions:', state);
        } 
      });
    }
  });
}

// Sending the test data to the content script
if(type=='test'){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'test', data: state }, (response) => {
        if (response && response.success) {
          console.log('Test:', state);
        } 
      });
    }
  });
}
}


// Get the toggle button and set the initial state based on the stored settings and add an event listener to handle the change event 
document.addEventListener('DOMContentLoaded', function() {
 
const toggle1 = document.getElementById('toggle_enable');

// Retrieve settings for the current tab's URL
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentUrl = tabs[0].url;
    chrome.storage.sync.get(currentUrl, function(data) {
        var buttonState = data[currentUrl];
        if (buttonState === undefined || buttonState === null) {
            buttonState = true;
        }
        toggle1.checked = buttonState;
        console.log('Enable_buttonState for URL', currentUrl + ':', buttonState);
        updateMessage(buttonState);
    });
});

// Event listener for toggle1 change event
toggle1.addEventListener('change', function() {
    var buttonState = toggle1.checked;

    // Save settings for the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentUrl = tabs[0].url;
        var data = {};
        data[currentUrl] = buttonState;
        chrome.storage.sync.set(data, function() {
            console.log('Enable_buttonState for URL', currentUrl + ':', buttonState);
            updateMessage(buttonState);
            send_response('change method', 'test');
        });
    });
});

// Function to update UI message
function updateMessage(buttonState) {
    var message = buttonState ? 'on' : 'off';
    send_response(message, 'toggle_enable');
}
});

// Get the toggle button and add an event listener to handle the change event
document.addEventListener('DOMContentLoaded', function() {

  const toggle2 = document.getElementById('toggle_thintext');
  // Retrieve the button state from storage and set the initial state of the toggle button
  chrome.storage.sync.get('buttonState_thintext', function(data) {
        var buttonState = data.buttonState_thintext;
        if(buttonState==undefined || buttonState==null){
          buttonState = true;
        }
        toggle2.checked = buttonState;
        console.log('Thintext_buttonState', buttonState);
          updateMessage2(buttonState);
      });

      // Event listener for toggle2 change event
      toggle2.addEventListener('change', function() {
        var buttonState = toggle2.checked;
        chrome.storage.sync.set({ 'buttonState_thintext': buttonState }, function() {
          updateMessage2(buttonState);
          console.log('ThinText_buttonState', buttonState);
        });
      });

      // Function to update UI message
      function updateMessage2(buttonState) {
          var message = buttonState ? 'on' : 'off';
          send_response(message,'toggle_thintext');
        }

}) 

// Get the number of predictions and add an event listener to handle the change event
document.addEventListener('DOMContentLoaded', function() {
  const option_value = document.getElementById('num_predictions');
  // Retrieve the number of predictions from storage and set the initial value of the dropdown
  chrome.storage.sync.get('option_value', function(data) {
    var option_value1 = data.option_value;
    if(option_value1==undefined || option_value1==null){
      option_value1 = 3;
    }
    option_value.value = option_value1;
    console.log('option_value', option_value1);
    updateMessage3(option_value1);
  });

  // Event listener for option_value change event
  option_value.addEventListener('change', function() {
    var option_value1 = option_value.value;
    chrome.storage.sync.set({ 'option_value': option_value1 }, function() {
      updateMessage3(option_value1);
      console.log('option_value', option_value1);
    });
  });

  // Function to update UI message
  function updateMessage3(option_value1) {
    var message = option_value1;
    // messageDiv.innerHTML = message;
    send_response(message,'send_number_of_predictions');
    console.log('message', message);
  }
})



// Commented Code of Initial Version

//   document.addEventListener('DOMContentLoaded', function() {
//     const toggle1 = document.getElementById('toggle_enable');

//     chrome.storage.sync.get('buttonState', function(data) {
//         var buttonState = data.buttonState ;
//         if(buttonState==undefined || buttonState==null){
//             buttonState = true;
//         }
//         toggle1.checked = buttonState;
//         console.log('Enable_buttonState', buttonState);
//         updateMessage(buttonState);
//         send_response('chrome method ','test');
//     });

//     toggle1.addEventListener('change', function() {
//         var buttonState = toggle1.checked;
//         chrome.storage.sync.set({ 'buttonState': buttonState }, function() {
//             updateMessage(buttonState);
//             console.log('Enable_buttonState', buttonState);
//             send_response('change method','test');
//         });

//     });

//     function updateMessage(buttonState) {
//         var message = buttonState ? 'on' : 'off';
//         send_response(message,'toggle_enable');
//     }
// });
// var a=0;


