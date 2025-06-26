# Indian Language Completion Extension


## Table of Contents
- [Files/Directory Structure](##Files/Directory-Structure)
- [Files Description](##Files-Description)
- [Code Overview](###Code-Overview)
    - [Content Script](####Content-Script)


### Files/Directory Structure
- `images/` : Contains the static image files of the Extension Icon.
- `public/` : Contains the static images for Extension Menu.
- `manifest.json` : Contains the metadata of the Extension.
- `background.js` : Contains the background script of the Extension.
- `content.js` : Contains the content script of the Extension.
- `popup.html` : Contains the HTML code for the Extension Popup. This is the main file that is displayed when the Extension Icon is clicked.
- `popup.js` : Contains the JavaScript code for the Extension Popup.
- `index.css` : Contains the CSS code for the Extension Popup.
- `global.css` : Contains the global CSS code for the Extension.

### Files Description
- `manifest.json` : This file is used to define the metadata of the Extension. It contains the name, version, description, permissions, and other details of the Extension. It also contains the javascript files that are used in the Extension to run the `background.js`, `content.js`, and `popup.js`. It also contains the static files and images that are used in the Extension.
- `background.js` : This file is used to run the background script of the Extension. It is used to run the background tasks of the Extension like listening to the events, sending messages to the content script, and other tasks that are required to run in the background. (Currently not used in the Extension, the tasks are performed in the content script itself for now, but it can be used in the future for background tasks by establishing a connection between the `background.js` and `content.js`).
- `content.js` : This file is used to run the content script of the Extension. It is used to run the tasks that are required to run on the webpage. It is used to inject the HTML code, CSS code, and JavaScript code on the webpage. It is used to listen to the events on the webpage and perform the tasks accordingly. It is used to send and recieve messages from the backend server/API. It also sends and recieves messages from the `popup.js` to handle the user selections. 
- `popup.html` : This file is used to display the popup of the Extension. It is the main file that is displayed when the Extension Icon is clicked. It contains the HTML code for the popup. It contains the input fields, buttons, and other elements that are required to display the popup. It also contains the CSS and JavaScript code that is required to style the popup and perform the tasks on the popup.
- `popup.js` : This file is used to run the JavaScript code for the popup. It is used to perform the tasks that are required to run on the popup. It is used to listen to the events on the popup and perform the tasks accordingly. It is used to send and recieve messages from the `content.js` to handle the user selections. 

### Code Overview
#### Content Script
- **Global Variables** - The current states of the Extension are stored in the global variables as shown below. This includes the current state of the Extension, the current state of the user input, the current state of the user selections, and other states that are required to run the Extension.
    ```js
    var enable_extension='on';
    var enable_thintext='on';
    var number_of_predictions=3;
    var active_button_color='red';
    ```
- **Key for Appending**- The key combination used to append prediction to the user input is stored in the global variable as shown below. This is the key combination that is used to append the prediction to the user input. To be changed whenever the key combination changes.
    ```js
    var keycode_for_thintext_append=39; // Default Right Arrow Key is used
    ```
- **Backend Server Link**- The backend server link is stored in the global variable as shown below. This is the link to the backend server that is used to send and recieve messages from the backend server. To be changed whenever the server endpoint changes.
    ```js
    SERVER_LINK='';
    ```
- **updateThinText**- This handles the functioning of the ToggleThinText button on Extension Main Menu. It is used to enable or disable the ThinText feature of the Extension. It is used to change the state of the Extension and the state of the user input accordingly.
    ```js
    function updateThinText(toggle_thintext)
    ```
- **updateExtensionOnOff**- This handles the functioning of the ToggleExtension button on Extension Main Menu. It is used to enable or disable the Extension. It is used to change the state of the Extension and the state of the user input accordingly.
    ```js
    function updateExtensionOnOff(toggle_extension)
    ```
- **update_num_predictions**- This handles the functioning of the Number of Predictions button on Extension Main Menu. It is used to change the number of predictions that are displayed in the Extension. It is used to change the state of the Extension and the state of the user input accordingly.
    ```js
    function update_num_predictions(num)
    ```
- **Commuinication with `popup.js`**- The communication between the `content.js` and `popup.js` is handled using the `chrome.runtime.onMessage.addListener` and `chrome.runtime.sendMessage` functions. The messages are sent and recieved between the `content.js` and `popup.js` to handle the user selections and other tasks.
    ```js
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'performAction_enable') {
      console.log('Performing action for Enable Extension:', request.data);
      enable_extension=request.data;
      console.log('enable_extension:', enable_extension);
      updateExtensionOnOff(enable_extension);
   
      sendResponse({ success: true });
    }else if (request.action === 'performAction_thintext') {
        console.log('Performing action for Thin Text:', request.data);
        enable_thintext=request.data;
        console.log('enable_thintext:', enable_thintext);
        updateThinText(enable_thintext);

        sendResponse({ success: true });
      }else if (request.action === 'send_number_of_predictions') {
        console.log('Number of Predictions:', request.data);
        // number_of_predictions=request.data;
        update_num_predictions(request.data);
        sendResponse({ success: true });
      }
  });   
    ```
- **Remove Thin Text**- This function is used to remove the Thin Text predictions from the webpage. It is used to remove the Thin Text predictions that are displayed on the webpage.
    ```js
    function removeThinText()
    ```
- **Remove Active Button**- This function is used to remove the active button from the webpage. It is used to remove the active button that is displayed on the webpage.
    ```js
    function removeActiveButton()
    ```
- **Inserting Thin Text**- This function is used to insert the Thin Text predictions on the webpage.
    ```js
    function insert_thintext_at_caret(text, element, isthintext, coordinates, caret) 
    ```
    There is a flag `isthintext` which is used to check if the text is a prediction or not. This determines if it is to be shown in light grey or normal text. `text` is the text to be inserted. `element` is the element where the text is to be inserted. `coordinates` and `caret` are used to determine the position where the text is to be inserted.
    Different webpage fields are handled differently here. For fields other than input and textarea, the following part is responsible. 
    ```js
    if (element.tagName.toLowerCase() !== 'input' && element.tagName.toLowerCase() !== 'textarea') 
    ```
    The else part in this function is responsible for handling the input and textarea fields.
  
- **Toggle Loader**- This function is used to toggle the loader(that is shown while request is in progress) which is displayed on the webpage.  `isActive` is a boolean variable which is used to determine if the loader is to be shown or hidden. True means show the loader and false means hide the loader.
    ```js
    function toggleLoader(isActive)
    ```
- **Inserting Loader**- This function is used to insert the loader on the webpage while the request is in progress. `element` is the element where the loader is to be inserted. `coordinates` and `caret` are used to determine the position where the loader is to be inserted.
    ```js
    function insert_loader_at_caret(element, coordinates, caret)
    ```

- **Checking if Cursor is at end of text**- This function is used to detect the caret position in the input field. It determines if the caret is at the end of the text content or not. This is used to determine if prediction needs to be generated or not. `element` is the element where the caret position is to be detected. 
The following function is used for `input` and `textarea` fields.
    ```js
    function detectCaretPosition(element)
    ```
    The following function is used for other fields.
    ```js
    function detectCaretPosition2(element)
    ```


- **isCaretInTargetDivOrLastChild** - This function is used to check if the caret is within the target div or its last child div. It uses the `window.getSelection()` API to get the current selection range and then checks if the caret node is within the target div or its last child div. This is used to determine if the prediction needs to be generated or not.
    ```js
    function isCaretInTargetDivOrLastChild(targetDiv)
    ```

- **Detecting Telugu Text**- This function is used to detect if the text is in Telugu or not. It uses the regular expression to detect if the text is in Telugu or not. This is used to determine if the prediction needs to be generated or not.
    ```js
    function isTeluguText(text)
    ```

- **Parse Prediction**- This function is used to parse the prediction that is recieved from the backend server. It is used to parse the prediction and display it on the webpage. It removes the useless english text from the prediction and displays only the Telugu text. It also handles the case where the prediction is not in Telugu and displays the prediction accordingly. Some text like 'xxunk' which is frequently given by the model is removed.
    ```js
    function parse_pred(string)
    ```

- **Removing Original Input text from prediction**- The ML Model returns the input text along with the prediction appended to it, but we only want the prediction to be displayed. This function is used to remove the original input text from the prediction. `sent_text` is the original input text and `predictions` is the array of predictions that is recieved from the backend server. The function returns the prediction without the original input text.
    ```js
    function removeAppendedText(sent_text, predictions)
    ```

- **Predictions from Backend**- This function is used to get the predictions from the backend server. It sends the user input to the backend server and recieves the predictions from the backend server. It also handles the case where the prediction is not recieved from the backend server and displays the prediction accordingly. It also handles the case where the prediction is recieved from the backend server and displays the prediction accordingly. `input` is the user input that is to be sent to the backend server. This function waits for the response from the backend server and then displays the prediction on the webpage. Async function is used to handle the asynchronous nature of the request. Inside this function, a request is sent with `Flag = 1`, this indicates the post request has been made to fetch predictions.
    ```js
    async function get_model_output(input)
    ```
    A API request is sent with the following contents. `text` is the input text, `num` is the number of predictions to be fetched and `flag` is the flag to indicate the type of request.
    ```js
    const payload = { text: input,num: number_of_predictions,flag:'1' };
    ```


- **Logging User Choice**- This function is used to log the user choice that is selected by the user. It sends the user choice to the backend server to log the user choice. It also handles the case where the user choice is not sent to the backend server and displays the user choice accordingly. `input` is the user choice that is to be sent to the backend server. This function waits for the response from the backend server and then logs the user choice. Async function is used to handle the asynchronous nature of the request. Inside this function, a request is sent with `Flag = 2`, this indicates the post request has been made to log the user choice.
    ```js
    async function log_user_choice(input_text, prediction)
    ```
    A API request is sent with the following contents. `text` is the input text, `prediction` is the user choice and `flag` is the flag to indicate the type of request. 
    ```js
    const payload = { text: input_text, prediction: prediction, flag: '2'};
    ```

- **Getting Caret Coordinates**- This function is used to get the caret coordinates in the input field and textarea field. `element` is the element where the caret coordinates are to be detected and `position` is the position where the caret coordinates are to be detected. This function returns the caret coordinates of the input field or textarea field. 
    ```js
    function getCaretCoordinates(element, position, options) 
    ```
    Another function is used for other fields.
    ```js
    function getCaretPosition2(element)
    ```

- **Main Function**- This is the main function that handles the order of execution of the functions. It fetches the user input, checks if the user input is in Telugu, checks if the caret is at the end of the text, gets the caret coordinates, sends the user input to the backend server, recieves the predictions from the backend server, parses the predictions, removes the original input text from the predictions, and displays the predictions on the webpage. This function is called whenever the user input is changed or the caret position is changed. It is used to generate the predictions and display them on the webpage. It also handles the thin text feature of the Extension and displays the thin text accordingly. It listens for multiple events like keyup, keydown, click, and other events to fetch user input and to display generated predictions. 
    ```js
    function MainFunc()
    ```

- **Display Predictions**- This function is used to display the predictions on the webpage as a prediction box near the caret in target field. It also handles the appending of predictions on clicking the prediction being displayed in prediction box. `predictions` is the array of predictions that is to be displayed on the webpage. `target` is the target field where the predictions are to be displayed. `caretPos` is the caret position where the predictions are to be displayed. `coordinates` is the coordinates where the predictions are to be displayed. `input_txt` is the user input text that has generated the predictions which is used for logging the user selections whenever a prediction is selected. 
    ```js
    function displayPredictions(predictions, target, caretPos, coordinates,input_txt)
    ```

- **CSS Styles**- The code also includes CSS styles for the predictions container and prediction elements, which are added to the HTML document using a `<style>` element.
    ```js
    const cssStyles = `...`;
    ```
#### Popup Script

- **Send Response** - This function is used to send button's state stored in browser storage to Content Script using `chrome.tabs.query` method.
    ```js
    function send_response(state,type)
    ```
- **Updating EnableExtensionButton** - The following code loads everytime whenever Main menu is opened due to `DOMContentLoaded` event. Inside event listner function first button DOM is fetched using `document.getElementById('toggle_enable')` i.e by using ID. Then chrome local storage is accessed and button state is extracted.
    ```js
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
    ```
    URL of webpage is extracted and extension setting is stored by using URL as key.Then another event listner is added to detect change in button state by user input and set respective setting.
    ```js
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
    ```
    `function updateMessage(buttonState)` Calls `send_response(message, 'toggle_enable')` to send response to content script for changing extension settings.
    ```js
    function updateMessage(buttonState) {
    var message = buttonState ? 'on' : 'off';
    send_response(message, 'toggle_enable');
    }
    ```
    







## Architecture

## Code Documentation

