/**
 * This file contains the JavaScript code for the content script of the extension.
 * It includes functions to update the extension and thin text settings, handle messages from the background script,
 * remove thin text elements, insert thin text at the caret position, and remove the active button.
 * The code also includes event listeners and helper functions.
 *
 * @file FILEPATH: ./code/extension/content.js
 */


// The current states of the Extension are stored in the global variables as shown below. This includes the current state of the Extension, the current state of the user input, the current state of the user selections, and other states that are required to run the Extension.
var enable_extension='on';
var enable_thintext='on';
var number_of_predictions=3;
var active_button_color='red';

// The key combination used to append prediction to the user input is stored in the global variable as shown below. This is the key combination that is used to append the prediction to the user input. To be changed whenever the key combination changes.
var keycode_for_thintext_append=39; // right arrow key


// The backend server link is stored in the global variable as shown below. This is the link to the backend server that is used to send and recieve messages from the backend server. To be changed whenever the server endpoint changes. This is used in 2 places in the code while sending request- either to get the predictions or to log the user choice.
SERVER_LINK="https://157.245.244.192:5000/"



/**
 * Updates the thin text based on the toggle state.
* 
* This handles the functioning of the ToggleThinText button on Extension Main Menu. It is used to enable or disable the ThinText feature of the Extension. It is used to change the state of the Extension and the state of the user input accordingly.
 * @param {string} toggle_thintext - The toggle state of the thin text ('on' or 'off').
 */
function updateThinText(toggle_thintext) {
    if(enable_extension=='on')
    {
        console.log('in updating function: ', toggle_thintext);
        if (toggle_thintext === 'on') {
            // chrome.storage.sync.set({ 'buttonState_thintext': toggle_thintext }, function () {
            //     console.log('Enable thintext final:', toggle_thintext);
            // }
        // );
        var x = document.getElementById("prediction-div");
        x.style.display = "block";
        console.log(x.style.display);
        }
        else if (toggle_thintext === 'off') {
            removeActiveButton();
            // chrome.storage.sync.set({ 'buttonState_thintext': toggle_thintext }, function () {
            //     console.log('Enable thintext final:', toggle_thintext);
            // });
            var x = document.getElementById("prediction-div");
            x.style.display = "none";
            console.log(x.style.display);
        }
    }else if(enable_extension==='off' && toggle_thintext === 'off'){
        removeActiveButton();
        var x = document.getElementById("prediction-div");
        x.style.display = "none";
        console.log(x.style.display);
    } 
}


/**
 * Updates the extension state and performs necessary actions based on the toggle value.
 *
 * This handles the functioning of the ToggleExtension button on Extension Main Menu. It is used to enable or disable the Extension. It is used to change the state of the Extension and the state of the user input accordingly.
 * @param {string} toggle_extension - The toggle value indicating the state of the extension ('on' or 'off').
 */
function updateExtensionOnOff(toggle_extension) {
    console.log('in updating function: ', toggle_extension);
    if (toggle_extension === 'off') {
        // chrome.storage.sync.set({ 'buttonState': toggle_extension }, function () {
        //     console.log('Enable_extension:', toggle_extension);
        // });
        // updateThinText('off');
        removeActiveButton();
        //  also make the prediction box disappear
        var x = document.getElementById("prediction-div");
        x.style.display = "none";
        const existingPredictionsContainer = document.querySelector('.predictions-container');
        if (existingPredictionsContainer) {
            existingPredictionsContainer.style.display = "none";
        }
    }
    else if (toggle_extension === 'on') {
        // chrome.storage.sync.set({ 'buttonState': toggle_extension }, function () {
        //     console.log('Enable_extension:', toggle_extension);
        // });
        // updateThinText(enable_thintext);
        var x = document.getElementById("prediction-div");
        x.style.display = "block";
        const existingPredictionsContainer = document.querySelector('.predictions-container');
        if (existingPredictionsContainer) {
            existingPredictionsContainer.style.display = "block";
        }
    }
    
}


/**
 * Updates the number of predictions.
 * 
 * This handles the functioning of the Number of Predictions button on Extension Main Menu. It is used to change the number of predictions that are displayed in the Extension. It is used to change the state of the Extension and the state of the user input accordingly.
 * @param {number} num - The new number of predictions.
 */
function update_num_predictions(num){
    if(num==='undefined'){
        number_of_predictions=3;
    }else{
        number_of_predictions=num;
    }
}

/**
 * Listens for messages from the background script and performs actions based on the received message.
 *
 * The communication between the `content.js` and `popup.js` is handled using the `chrome.runtime.onMessage.addListener` and `chrome.runtime.sendMessage` functions. The messages are sent and recieved between the `content.js` and `popup.js` to handle the user selections and other tasks.
 * @param {Object} request - The message object received from the background script.
 * @param {Object} sender - The sender object containing information about the sender of the message.
 * @param {Function} sendResponse - The function to send a response back to the background script.
 */
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



/**
 * Removes all elements with the class 'thintext' and the element with the id 'prediction-div'.
 * in fact removing the thin text appended in the last request
 */
function removeThintext() {
    const thintextElements = document.querySelectorAll('.thintext');
    thintextElements.forEach(element => {
        element.remove();
    });
    const thintextElements2 = document.getElementById('prediction-div');
    if (thintextElements2)
        thintextElements2.remove();
}

/**
 * Removes the active button and all elements with the class 'loader' from the document.
 * removes the loading animation from the previous request
 */
function removeActiveButton() {
    const temp= document.querySelectorAll('.loader');
    temp.forEach(element => {
        element.remove();
    });
    const activeButtonElement= document.getElementById('active-button');
    if(activeButtonElement) 
    {
        activeButtonElement.remove();
    }
}

/**
 * Inserts thin text at the caret position within an element.
 * 
 * There is a flag `isthintext` which is used to check if the text is a prediction or not. This determines if it is to be shown in light grey or normal text. `text` is the text to be inserted. `element` is the element where the text is to be inserted. `coordinates` and `caret` are used to determine the position where the text is to be inserted.
    Different webpage fields are handled differently here. For fields other than input and textarea, the following part is responsible. 
    ```js
    if (element.tagName.toLowerCase() !== 'input' && element.tagName.toLowerCase() !== 'textarea') 
    ```
    The else part in this function is responsible for handling the input and textarea fields.
 * @param {string} text - The thin text to be inserted.
 * @param {HTMLElement} element - The target element where the thin text will be inserted.
 * @param {boolean} isthintext - Indicates whether the thin text is a hint text.
 * @param {Object} coordinates - The coordinates of the caret position. Use function getCaretCoordinates for this 
 * @param {Object} caret - The caret object containing the top and left positions. Use function getCaretPosition2 for this
 * @returns {void}
 */
function insert_thintext_at_caret(text, element, isthintext, coordinates, caret) {
    if(enable_extension==='off'){
    return;
    }
    if(enable_thintext=='off')
    {
        return;
    }
    var val = element.value,
        endIndex, range;
    text = '   ' + text + ' ';
    if (element.tagName.toLowerCase() !== 'input' && element.tagName.toLowerCase() !== 'textarea') {
        if (caret.top < 0 && caret.left < 0)
            return;
        if (!isthintext) {
            const paragraphele = element.querySelectorAll("p");
            var lastparagraphele;
            if (paragraphele) {
                lastparagraphele = paragraphele[paragraphele.length - 1];
            }
            var spanElement;
            if (lastparagraphele) {
                spanElement = lastparagraphele.querySelector("span");
            }
            if (spanElement) {
                console.log("yes, i am here yayay");
                console.log(spanElement);
                spanElement.childNodes[0].data = spanElement.childNodes[0].data + " " + text;
                element.focus();
                const range = document.createRange();
                range.setStart(spanElement.childNodes[0], spanElement.childNodes[0].length); // Set the range's start to the end of the text node
                range.collapse(true); // Collapse the range to the end
                // Set the selection to the end of the span
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                return;
            }
            const newSpan = document.createElement('span');

            if (isthintext == 1)
                newSpan.className = 'thintext';

            newSpan.textContent = text;


            const childDivs = element.querySelectorAll('div');

            // If there are child div elements, select the last one 
            if (childDivs.length > 0) {
                const lastDiv = childDivs[childDivs.length - 1];
                const newp = lastDiv.querySelector("p");
                if (newp) {
                    newp.appendChild(newSpan);
                }
                else {
                    var brTags = lastDiv.getElementsByTagName("br");
                    // for (var i = 0; i < brTags.length; i++) {
                    if (brTags.length > 0 && (brTags[brTags.length - 1].parentNode.lastChild === brTags[brTags.length - 1])) {
                        brTags[brTags.length - 1].parentNode.removeChild(brTags[brTags.length - 1]);
                    }
                    lastDiv.appendChild(newSpan);
                }
                // lastDiv.appendChild(newSpan);
            } else {
                // If there are no child div elements, append childElement directly to parentDiv
                const newp = element.querySelector("p");
                if (newp) {
                    const childps = element.querySelectorAll('p');
                    const lastp = childps[childps.length - 1];
                    lastp.appendChild(newSpan);
                }
                else {
                    var brTags = element.getElementsByTagName("br");
                    // for (var i = 0; i < brTags.length; i++) {
                    if (brTags.length > 0 && (brTags[brTags.length - 1].parentNode.lastChild === brTags[brTags.length - 1])) {
                        brTags[brTags.length - 1].parentNode.removeChild(brTags[brTags.length - 1]);
                    }
                    element.appendChild(newSpan);
                }
            }

            if (isthintext === 0) {
                // Set caret position to the end of the newly appended text
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStart(newSpan, newSpan.childNodes.length);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                element.focus()
            }
        } else {
            if (coordinates && coordinates.top < 0 && coordinates.left < 0)
                return;
            removeThintext();
            let divElement = document.createElement('div');
            document.body.appendChild(divElement);
            divElement.id = 'prediction-div';
            divElement.textContent = text;

            // Get font size of the input element
            const inputFontSize = window.getComputedStyle(element).fontSize;
            divElement.style.fontSize = inputFontSize; // Set font size of prediction div

            const inputRect = element.getBoundingClientRect();
            divElement.style.left = inputRect.x + caret.left + 'px';
            divElement.style.top = inputRect.y + caret.top + -5 + 'px';
            divElement.style.display = 'block';

            element.focus();

            // Move caret to the end of the input field or textarea
            if (typeof element.selectionStart === 'number') {
                element.selectionStart = element.selectionEnd = element.value.length;
            } else if (typeof element.createTextRange !== 'undefined') {
                element.focus();
                var range = element.createTextRange();
                range.collapse(false);
                range.select();
            }
        }


    }
    else {
        removeThintext();
        let divElement = document.createElement('div');
        document.body.appendChild(divElement);
        divElement.id = 'prediction-div';
        console.log("prediction to be appended: ", text);
        divElement.textContent = text;

        // Get font size of the input element
        const inputFontSize = window.getComputedStyle(element).fontSize;
        divElement.style.fontSize = inputFontSize; // Set font size of prediction div

        const inputRect = element.getBoundingClientRect();
        divElement.style.left = inputRect.x + coordinates.left + 'px';
        divElement.style.top = inputRect.y + coordinates.top + -5 + 'px';
        divElement.style.display = 'block';

        element.focus();

        // Move caret to the end of the input field or textarea
        if (typeof element.selectionStart === 'number') {
            element.selectionStart = element.selectionEnd = element.value.length;
        } else if (typeof element.createTextRange !== 'undefined') {
            element.focus();
            var range = element.createTextRange();
            range.collapse(false);
            range.select();
        }

    }


}


/**
 * Toggles the active button element based on the isActive parameter.
 * If isActive is false, the loading animation is turned on by displaying the active button element and setting its color to green.
 * If isActive is true, the loading animation is turned off by hiding the active button element and setting its color to red.
 * Here colour is of no particular use, just shows the current state, colour can be used if showing the wait/ready through red or green dot. But for loader purpose, it has no such colour significance.
 * @param {boolean} isActive - Indicates whether the loading animation should be turned on or off.
 */
function toggleLoader(isActive)
{    
    const activeButtonElement = document.getElementsByClassName('loader')[0];
    if(activeButtonElement)
    {
        console.log("Active Button Found for toggling");
        if (isActive)
        {
            console.log("Loading animation On");
            // activeButtonElement.style.backgroundColor = 'green';
            active_button_color='green';
            activeButtonElement.style.display='block';
            // activeButtonElement.style.boxShadow = '0 0 5px rgba(0, 255, 0, 0.5)'; // Green luminous border
            
        }
        else{
            console.log("Loading Off");
            // activeButtonElement.style.backgroundColor = 'red';
            activeButtonElement.style.display='none';
            active_button_color='red';
            // activeButtonElement.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.5)'; // Red luminous border
            
        }
    }
        
}


/**
 * Inserts a loader at the caret position in the specified element.
 * @param {HTMLElement} element - The element where the active button will be inserted.
 * @param {Object} coordinates - The coordinates of the caret position. Use function getCaretCoordinates for getting this.
 * @param {Object} caret - The caret position. Use function getCaretPosition2 for getting this.
 */
function insert_loader_at_caret(element, coordinates, caret) {
    if (enable_extension === 'off') {
        return;
    }
    if (enable_thintext == 'off') {
        return;
    }
    removeActiveButton();
    console.log("Into inserting loader");

    
    var val = element.value,
        endIndex, range;
    if (element.tagName.toLowerCase() !== 'input' && element.tagName.toLowerCase() !== 'textarea') {
        if (caret.top < 0 && caret.left < 0)
            return;
            if (coordinates && coordinates.top < 0 && coordinates.left < 0)
                return;
            let divElement = document.createElement('div');
            document.body.appendChild(divElement);
            divElement.id = 'active-button';
            divElement.className= 'loader';
            // Set dot size and shape
            // divElement.style.width = '1px';
            // divElement.style.height = '1px';
            // divElement.style.borderRadius = '50%';
            // divElement.style.transform = 'scale(0.4)'; // Adjust scale factor as needed
            // divElement.style.backgroundColor = active_button_color; 

            if(active_button_color=='green')
            {
                divElement.style.display='block';
            }
            else{
                divElement.style.display='none';
            }

            const inputRect = element.getBoundingClientRect();
            divElement.style.left = inputRect.x + caret.left + 'px';
            divElement.style.top = inputRect.y + caret.top + 'px';
            // divElement.style.top = inputRect.y + caret.top + -5 + 'px';

            element.focus();
    } else {
        let divElement = document.createElement('div');
        document.body.appendChild(divElement);
        divElement.id = 'active-button';
        divElement.className= 'loader';

        console.log("ACTIVE button ", "test");

        if(active_button_color=='green')
        {
            divElement.style.display='block';
        }
        else{
            divElement.style.display='none';
        }
        // Position the dot
        const inputRect = element.getBoundingClientRect();
        divElement.style.left = (inputRect.x + coordinates.left) + 'px';
        // divElement.style.top = (inputRect.y + coordinates.top - 10) + 'px';
        divElement.style.top = (inputRect.y + coordinates.top) + 'px';

        divElement.style.position = 'absolute'; // Ensure proper positioning

        divElement.addEventListener('mouseenter', function() {
            console.log("Tooltip on mouse enter");
            const tooltip = document.createElement('div');
            tooltip.className='tooltip';
            if(divElement.style.backgroundColor =='red')
            {
                tooltip.textContent = 'Wait for Server'; 
            }
            else{
                tooltip.textContent = 'Keep writing'; 
            }
            tooltip.style.position = 'absolute';
            tooltip.style.top = (parseInt(divElement.style.top) - 30) + 'px'; // Adjust top position as needed
            tooltip.style.left = (parseInt(divElement.style.left) ) + 'px'; // Adjust left position as needed
            tooltip.style.padding = '5px';
            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            tooltip.style.color = 'white';
            tooltip.style.borderRadius = '5px';
            document.body.appendChild(tooltip);
        });

        // Function to hide tooltip on mouse leave
        divElement.addEventListener('mouseleave', function() {
            const tooltips = document.querySelectorAll('.tooltip');
            tooltips.forEach(element => {
                element.remove();
            });
        });


        element.focus();
    }
}



/**
 * This function is used to detect the caret position in the input field. It determines if the caret is at the end of the text content or not. This is used to determine if prediction needs to be generated or not. `element` is the element where the caret position is to be detected. 
The following function is used for `input` and `textarea` fields.
    ```js
    function detectCaretPosition(element)
    ```
    The following function is used for other fields.
    ```js
    function detectCaretPosition2(element)
    ```

 */

/**
 * Detects the caret position within an input element.
 * This function is used to detect the caret position in the input field. It determines if the caret is at the end of the text content or not. This is used to determine if prediction needs to be generated or not. `element` is the element where the caret position is to be detected. 
The following function is used for `input` and `textarea` fields.
 * @param {HTMLInputElement} element - The input element to detect the caret position in.
 * @returns {number} - Returns 1 if the caret is at the end of the content, 0 otherwise.
 */
function detectCaretPosition(element) {
    var caretPosition = element.selectionStart;

    // Check if the caret is at the end of the content
    if (caretPosition === element.value.length) {
        console.log("Caret is at the end of the content");
        return 1;
        // Do something when caret is at the end
    }
    else {
        console.log("Caret is in between texts");
        return 0;
        // Do something when caret is in between
    }
}

/**
 * Detects the caret position within an element.
 * This function is used to detect the caret position in the input field. It determines if the caret is at the end of the text content or not. This is used to determine if prediction needs to be generated or not. `element` is the element where the caret position is to be detected. 
The following function is used for other fields than input and textarea.
 * @param {Element} element - The element to detect the caret position in.
 * @returns {number} - Returns 1 if the caret is at the end of the content, 0 otherwise.
 */
function detectCaretPosition2(element) {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var startOffset = range.startOffset;
        var endOffset = range.endOffset;
        var length = range.endContainer.textContent.length;

        // Check if the caret is at the end of the content
        if (startOffset === length && startOffset === endOffset) {
            console.log("Caret is at the end of the content");
            return 1;
            // Do something when caret is at the end
        } else {
            console.log("Caret is in between texts");
            return 0;
            // Do something when caret is in between
        }
    }
}

/**
 * Checks if the caret is within the target div or its last child div.
 * 
 *  This function is used to check if the caret is within the target div or its last child div. It uses the `window.getSelection()` API to get the current selection range and then checks if the caret node is within the target div or its last child div. This is used to determine if the prediction needs to be generated or not.
 * @param {HTMLElement} targetDiv - The target div element to check against.
 * @returns {boolean} - Returns true if the caret is within the target div or its last child div, false otherwise.
 */
function isCaretInTargetDivOrLastChild(targetDiv) {
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const caretNode = range.startContainer;

        // Check if caret is within the target div or its descendant divs
        if (targetDiv.contains(caretNode)) {
            // Check if caret is within a child div of the target div
            if (targetDiv.hasChildNodes() && (targetDiv.lastChild && targetDiv.lastChild.nodeType === Node.ELEMENT_NODE && targetDiv.lastChild.tagName.toLowerCase() === 'div')) {

                targetDiv.childNodes.forEach(child => {
                    console.log("child is: ", child);
                });

                // Check if the caret is within the last child div of the target div
                const lastChildDiv = targetDiv.lastElementChild;
                if (lastChildDiv && lastChildDiv.contains(caretNode)) {
                    console.log("yes the last element contains the caret");
                    return true;
                }
                else {
                    console.log("the last element doesn't contain the caret");
                    return false;
                }
            } else {
                // Caret is within the target div but not within a child div
                console.log("the caret is within the parent div only");
                return true;
            }
        }
    }

    return false; // Caret is not within the target div or any of its descendant divs
}

/**
 * Checks if a given input string contains only Telugu script characters.
 *
 * This function is used to detect if the text is in Telugu or not. It uses the regular expression to detect if the text is in Telugu or not. This is used to determine if the prediction needs to be generated or not.
 * @param {string} inputStr - The input string to be checked.
 * @returns {boolean} - Returns true if all characters in the input string are Telugu script characters, otherwise returns false.
 */
function isTeluguScript(inputStr) {
    // Telugu script Unicode range
    const teluguRange = [0x0C00, 0x0C7F];

    // Check if all characters in the input string are Telugu script characters
    for (let i = 0; i < inputStr.length; i++) {
        const char = inputStr.charAt(i);

        // Ignore punctuation and special characters
        if (char.match(/[a-zA-Z]/)) {
            const charCode = char.charCodeAt(0);
            if (charCode < teluguRange[0] || charCode > teluguRange[1]) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Checks if a string comprises only of whitespace characters.
 *
 * @param {string} inputStr - The input string to check.
 * @returns {boolean} Returns true if the string comprises only of whitespace characters, otherwise returns false.
 */
function isWhiteSpace(inputStr) {
    // check if string comprises only of whitespace characters
    if (inputStr.trim().length == 0)
        return true;
    return false;
}


/**
 * Removes English content and newline characters from the given string.
 * 
 * This function is used to parse the prediction that is recieved from the backend server. It is used to parse the prediction and display it on the webpage. It removes the useless english text from the prediction and displays only the Telugu text. It also handles the case where the prediction is not in Telugu and displays the prediction accordingly. Some text like 'xxunk' which is frequently given by the model is removed.
 * @param {string} string - The input string to be parsed.
 * @returns {string} The parsed string with English content and newline characters removed.
 */
function parse_pred(string) {
    // Regular expression to match English characters and newline characters
    const englishAndNewlineRegex = /[a-zA-Z\n]/g;

    // Remove English content and newline characters from the string
    string = string.replace(englishAndNewlineRegex, '');

    // Trim any leading or trailing whitespace
    string = string.trim();

    return string;
}


/**
 * Removes the appended text from the predictions array.
 *
 * The ML Model returns the input text along with the prediction appended to it, but we only want the prediction to be displayed. This function is used to remove the original input text from the prediction. `sent_text` is the original input text and `predictions` is the array of predictions that is recieved from the backend server. The function returns the prediction without the original input text.
 * @param {string} sent_text - The original text that was appended to the predictions.
 * @param {string[]} predictions - The array of predictions.
 * @returns {string[]} - The updated array of predictions with the appended text removed.
 */
function removeAppendedText(sent_text, predictions) {
    for (let i = 0; i < predictions.length; i++) {
        // if (predictions[i].startsWith(sent_text)) {
        const words = predictions[i].split(/\s+/); // Split the string into words
        predictions[i] = words[words.length - 1]; // Take the last word
        // }
    }
    return predictions;
}

// A global variable to store the request response from the model
var return_ans;


/**
 * Retrieves the model output based on the provided input.
 * 
 * This function is used to get the predictions from the backend server. It sends the user input to the backend server and recieves the predictions from the backend server. It also handles the case where the prediction is not recieved from the backend server and displays the prediction accordingly. It also handles the case where the prediction is recieved from the backend server and displays the prediction accordingly. `input` is the user input that is to be sent to the backend server. This function waits for the response from the backend server and then displays the prediction on the webpage. Async function is used to handle the asynchronous nature of the request. Inside this function, a request is sent with `Flag = 1`, this indicates the post request has been made to fetch predictions.
  ```js
    async function get_model_output(input)
    ```
    A API request is sent with the following contents. `text` is the input text, `num` is the number of predictions to be fetched and `flag` is the flag to indicate the type of request.
    ```js
    const payload = { text: input,num: number_of_predictions,flag:'1' };
    ```
 * @param {string} input - The input for the model.
 * @returns {Promise<Object>} - The model output response.
 */
async function get_model_output(input) {
    // var response= { data1: "ఆంగ్లఅక్షరమాలలో", data2: "ఆంమాలలో", data3: "none" };
    // return_ans=response;
    // return response;
    if (enable_extension === 'on') {
        // insert active button here 
        toggleLoader(true);
        const NGROK_LINK = SERVER_LINK;
        //   const payload = { text: 'పుట్టిన రోజు ' };
        const payload = { text: input,num: number_of_predictions,flag:'1' };
        const headers = { 'Content-Type': 'application/json' };
        
        
        // this makes it wait but gives synchronous output
        const rawResponse = await fetch(NGROK_LINK, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
        });
        const response = await rawResponse.json();
        console.log("hello this is the response",response)
        return_ans = response;

        console.log("Got response now loading should stop");
        toggleLoader(false);
        return response;
    }
    else {
        return_ans = { data1: "NONE", data2: "NONE", data3: "NONE" };
        return return_ans;
    }    
}


/**
 * Logs the user's choice and sends it to the server.
 * 
 * This function is used to log the user choice that is selected by the user. It sends the user choice to the backend server to log the user choice. It also handles the case where the user choice is not sent to the backend server and displays the user choice accordingly. `input` is the user choice that is to be sent to the backend server. This function waits for the response from the backend server and then logs the user choice. Async function is used to handle the asynchronous nature of the request. Inside this function, a request is sent with `Flag = 2`, this indicates the post request has been made to log the user choice.
    ```js
    async function log_user_choice(input_text, prediction)
    ```
    A API request is sent with the following contents. `text` is the input text, `prediction` is the user choice and `flag` is the flag to indicate the type of request. 
    ```js
    const payload = { text: input_text, prediction: prediction, flag: '2'};
    ```
 * @param {string} input_text - The input text provided by the user.
 * @param {string} prediction - The prediction chosen by the user.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
async function log_user_choice(input_text, prediction) {
    console.log("User chose the prediction: ", prediction);
    const NGROK_LINK = SERVER_LINK;
    const payload = { text: input_text, prediction: prediction, flag: '2'};
    const headers = { 'Content-Type': 'application/json' };

    try {
        const response = await fetch(NGROK_LINK, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


(function CoordinateGenerator() {

    // The properties that we copy into a mirrored div.
    // Note that some browsers, such as Firefox,
    // do not concatenate properties, i.e. padding-top, bottom etc. -> padding,
    // so we have to do every single property specifically.
    var properties = [
        'direction',  // RTL support
        'boxSizing',
        'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
        'height',
        'overflowX',
        'overflowY',  // copy the scrollbar for IE

        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'borderStyle',

        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',

        // https://developer.mozilla.org/en-US/docs/Web/CSS/font
        'fontStyle',
        'fontVariant',
        'fontWeight',
        'fontStretch',
        'fontSize',
        'fontSizeAdjust',
        'lineHeight',
        'fontFamily',

        'textAlign',
        'textTransform',
        'textIndent',
        'textDecoration',  // might not make a difference, but better be safe

        'letterSpacing',
        'wordSpacing',

        'tabSize',
        'MozTabSize'

    ];

    var isBrowser = (typeof window !== 'undefined');
    var isFirefox = (isBrowser && window.mozInnerScreenX != null);

    /**
     * Retrieves the coordinates of the caret (cursor) position within an input or textarea element.
     * 
     * This function is used to get the caret coordinates in the input field and textarea field. `element` is the element where the caret coordinates are to be detected and `position` is the position where the caret coordinates are to be detected. This function returns the caret coordinates of the input field or textarea field. 
    ```js
    function getCaretCoordinates(element, position, options) 
    ```
    Another function is used for other fields.
    ```js
    function getCaretPosition2(element)
    ```
     * @param {HTMLElement} element - The input or textarea element.
     * @param {number} position - The caret position within the element's value.
     * @param {Object} [options] - Additional options for debugging.
     * @param {boolean} [options.debug=false] - Set to true to enable debugging mode.
     * 
     * @returns {Object} - The coordinates of the caret position.
     * @property {number} top - The top position of the caret.
     * @property {number} left - The left position of the caret.
     * 
     * @throws {Error} - Throws an error if the function is not called in a browser.
     */
    function getCaretCoordinates(element, position, options) {
        if (element.tagName.toLowerCase() !== 'input' && element.tagName.toLowerCase() !== 'textarea')
            return;
        if (!isBrowser) {
            throw new Error('textarea-caret-position#getCaretCoordinates should only be called in a browser');
        }

        var debug = options && options.debug || false;
        if (debug) {
            var el = document.querySelector('#input-textarea-caret-position-mirror-div');
            if (el) { el.parentNode.removeChild(el); }
        }

        // mirrored div
        var div = document.createElement('div');
        div.id = 'input-textarea-caret-position-mirror-div';
        document.body.appendChild(div);

        var style = div.style;
        var computed = window.getComputedStyle ? getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9
        // console.log('style: ',style);
        // default textarea styles
        style.whiteSpace = 'pre-wrap';
        if (element.nodeName !== 'INPUT')
            style.overflowWrap = 'break-word';  // only for textarea-s

        // position off-screen
        style.position = 'absolute';  // required to return coordinates properly
        if (!debug)
            style.visibility = 'hidden';  // not 'display: none' because we want rendering

        // transfer the element's properties to the div
        properties.forEach(function (prop) {
            style[prop] = computed[prop];
        });

        if (isFirefox) {
            // Firefox lies about the overflow property for textareas: https://bugzilla.mozilla.org/show_bug.cgi?id=984275
            if (element.scrollHeight > parseInt(computed.height))
                style.overflowY = 'scroll';
        } else { 
            style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'
        }
        
        div.textContent = element.value.substring(0, position);
        // the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
        if (element.nodeName === 'INPUT')
            div.textContent = div.textContent.replace(/\s/g, '\u00a0');

        var span = document.createElement('span');
        // Wrapping must be replicated *exactly*, including when a long word gets
        // onto the next line, with whitespace at the end of the line before (#7).
        // The  *only* reliable way to do that is to copy the *entire* rest of the
        // textarea's content into the <span> created at the caret position.
        // for inputs, just '.' would be enough, but why bother?
        span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
        div.appendChild(span);

        var coordinates = {
            top: span.offsetTop + parseInt(computed['borderTopWidth']),
            left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
        };

        if (debug) {
            span.style.backgroundColor = '#aaa';
        } else {
            document.body.removeChild(div);
        }

        return coordinates;
    }

    if (typeof module != 'undefined' && typeof module.exports != 'undefined') {
        module.exports = getCaretCoordinates;
    } else if (isBrowser) {
        window.getCaretCoordinates = getCaretCoordinates;
    }

}());


(
    /**
     * This is the main function that handles the order of execution of the functions. It fetches the user input, checks if the user input is in Telugu, checks if the caret is at the end of the text, gets the caret coordinates, sends the user input to the backend server, recieves the predictions from the backend server, parses the predictions, removes the original input text from the predictions, and displays the predictions on the webpage. This function is called whenever the user input is changed or the caret position is changed. It is used to generate the predictions and display them on the webpage. It also handles the thin text feature of the Extension and displays the thin text accordingly. 
    */    
    function MainFunc() {
    const predictions = ["prediction1", "prediction2", "prediction3"];
    // document.querySelectorAll('input[type="text"], input[type="search"], textarea').forEach(function (input) {
    //     input.addEventListener("keydown", function () {
    //         console.log("Caret position: " + this.selectionStart);
    //     });
    // });
    document.addEventListener("click", function (event) {
        if (event.target.className !== "predictions-container") {
            removeThintext();
            const existingPredictionsContainer = document.querySelector('.predictions-container');
            if (existingPredictionsContainer) {
                existingPredictionsContainer.remove();
            }
        }
    });
    
    let predictionAppended = false;
    document.addEventListener("input", async function (event) {
        document.removeEventListener("keyup",handleKeyUp);
        removeThintext();
        const existingPredictionsContainer = document.querySelector('.predictions-container');
        if (existingPredictionsContainer) {
            // removeThintext();
            existingPredictionsContainer.remove();
        }
        const target = event.target;
        // insert_thintext_at_caret(predictions2[0], cursor_position(), target, 1, coordinates, caretPos);
        
        console.log("TARGET 0: ", target);
        console.log("total offset width: ", target.offsetWidth);
        var caretPos = getCaretPosition2(target);
        // insert_loader_at_caret(target, getCaretCoordinates(target,target.selectionStart), getCaretPosition2(target ));
        console.log("Caret position from left:", caretPos.left, "px");
        console.log("Caret position from top:", caretPos.top, "px");
        // const cursorPosition = getCursorPosition(target);
        // console.log('Cursor position from left:', cursorPosition.left);
        // console.log('Cursor position from top:', cursorPosition.top);
        var coordinates = getCaretCoordinates(target, target.selectionStart);
        // insert_loader_at_caret("useless text not important for now", cursor_position(), target, 1, getCaretCoordinates(target, target.selectionStart), getCaretPosition2(event.target));
        if (isCaretInTargetDivOrLastChild(target)) {
            console.log('Caret is in the target div or its last spawned child div.');
        } else {
            console.log('Caret is not in the target div or its last spawned child div.');
        }
        if (coordinates)
            console.log('the caret positions: ', coordinates.left + ", " + coordinates.top);
        if ((target.isContentEditable || target.tagName.toLowerCase() === "input" || target.tagName.toLowerCase() === "textarea")
            && (!target.type || target.type.toLowerCase() !== "password")) {
            var inputText = target.isContentEditable ? target.textContent : target.value;
            if (target.isContentEditable)
                console.log("Input text captured 0: ", target.textContent);
            else
                console.log("Input text captured 1: ", target.value);
            if (inputText.includes('.')) {
                const sentences = inputText.trim().split('.');
                // Get the last sentence
                inputText = sentences[sentences.length - 1];
            }

            if (((target.tagName.toLowerCase() === "input" || target.tagName.toLowerCase() === "textarea") && detectCaretPosition(target)) || ((target.tagName.toLowerCase() !== "input" && target.tagName.toLowerCase() !== "textarea") && isCaretInTargetDivOrLastChild(target) && detectCaretPosition2(target))) {
              
// FOR DEBUGGING COMMENT
              
                var response;

                if (isTeluguScript(inputText) && !isWhiteSpace(inputText)) {
                    console.log("Input text is in Telugu script");
                    insert_loader_at_caret(target, coordinates, caretPos);
                    let response1 = await get_model_output(inputText);
                    console.log("type of response1: ", typeof response1)
                    console.log("response1: ", response1['data'])
                    response = return_ans;
                    console.log(response.data1);
                    console.log(response.data2);
                    console.log(response.data3);
                    var predictions = [parse_pred(response.data1), parse_pred(response.data2), parse_pred(response.data3)];
                    var predictions2 = removeAppendedText(inputText, predictions);

// UPTO HERE


                displayPredictions(predictions2, target, caretPos, coordinates,inputText);
                if (((target.tagName.toLowerCase() === "input" || target.tagName.toLowerCase() === "textarea") && coordinates.left + 150 <= target.offsetWidth) || ((target.tagName.toLowerCase() !== "input" && target.tagName.toLowerCase() !== "textarea") && caretPos.left + 150 <= target.offsetWidth)) {
                    insert_thintext_at_caret(predictions2[0], target, 1, coordinates, caretPos);
                    // Define a new event listener for Shift keydown
                    function shiftKeyHandler(event) {
                        target.removeEventListener('keydown', shiftKeyHandler);
                        if (event.keyCode === keycode_for_thintext_append) {
                            event.preventDefault();
                            // Insert thin text when Shift key is pressed
                            // Call your function to insert thin text here
                            console.log('here i am 10');
                            removeThintext();
                            const existingPredictionsContainer = document.querySelector('.predictions-container');
                            if (existingPredictionsContainer) {
                                existingPredictionsContainer.remove();
                            }
                            if (target.tagName.toLowerCase() !== 'input' && target.tagName.toLowerCase() !== 'textarea') {
                                if (predictions2[0]) {
                                    insert_thintext_at_caret(predictions2[0], target, 0, coordinates, caretPos);
                                }
                            }
                            else {
                                target.value += ' ' + predictions2[0];
                                target.focus();
                            }
                            log_user_choice(inputText, predictions2[0]);
                        }
                    }

                    // Attach the new event listener for Shift keydown

                    target.addEventListener('keydown', shiftKeyHandler);
                    // }
                }
                // }});
// THIS TOO     
            }
// UPTO HERE
            }
        }
        else {
            var inputText = target.value;
            console.log("textinput1 ", inputText)
            if (inputText.includes('.')) {
                const sentences = inputText.trim().split('.');
                // Get the last sentence
                inputText = sentences[sentences.length - 1];
            }

            if (((target.tagName.toLowerCase() === "input" || target.tagName.toLowerCase() === "textarea") && detectCaretPosition(target)) || ((target.tagName.toLowerCase() !== "input" && target.tagName.toLowerCase() !== "textarea") && isCaretInTargetDivOrLastChild(target) && detectCaretPosition2(target))) {
                var response;

                if (isTeluguScript(inputText) && !isWhiteSpace(inputText)) {
                    console.log("Input text is in Telugu script");
                    insert_loader_at_caret(target, coordinates, caretPos);
                    let response1 = await get_model_output(inputText);
                    console.log("type of response1: ", typeof response1)
                    console.log("response1: ", response1['data'])
                    response = return_ans;
                    console.log(response.data1);
                    console.log(response.data2);
                    console.log(response.data3);
                    var predictions = [parse_pred(response.data1), parse_pred(response.data2), parse_pred(response.data3)];
                    var predictions2 = removeAppendedText(inputText, predictions);
                displayPredictions(predictions2, target, caretPos, coordinates,inputText);
                if (((target.tagName.toLowerCase() === "input" || target.tagName.toLowerCase() === "textarea") && coordinates.left + 150 <= target.offsetWidth) || ((target.tagName.toLowerCase() !== "input" && target.tagName.toLowerCase() !== "textarea") && caretPos.left + 150 <= target.offsetWidth)) {
                    insert_thintext_at_caret(predictions2[0], target, 1, coordinates, caretPos);
                    // Define a new event listener for Shift keydown
                    function shiftKeyHandler(event) {
                        if (event.keyCode === keycode_for_thintext_append) {
                            event.preventDefault();
                            // Insert thin text when Shift key is pressed
                            // Call your function to insert thin text here
                            console.log('here i am 10');
                            removeThintext();
                            const existingPredictionsContainer = document.querySelector('.predictions-container');
                            if (existingPredictionsContainer) {
                                // removeThintext();
                                existingPredictionsContainer.remove();
                            }
                            if (predictions2[0]) {
                                insert_thintext_at_caret(predictions2[0], target, 0, coordinates, caretPos);
                            }
                            log_user_choice(inputText, predictions2[0]);
                        }
                        target.removeEventListener('keydown', shiftKeyHandler);
                    }

                    // Attach the new event listener for Shift keydown
                    target.addEventListener('keydown', shiftKeyHandler);
                    // }
                }
                // }
                // });
            }
            }
        }
    });

    async function handleKeyUp(event) {
        let predictionAppended = false;
        // removeThintext();
        const target = event.target;
        // target.addEventListener('focusout', function () {
        //     removeThintext();
        //     const existingPredictionsContainer = document.querySelector('.predictions-container');
        //     if (existingPredictionsContainer) {
        //         // removeThintext();
        //         existingPredictionsContainer.remove();
        //     }

        // });
        console.log("target is: ", target);
        var caretPos = getCaretPosition2(target);
        console.log("Caret position from left:", caretPos.left, "px");
        console.log("Caret position from top:", caretPos.top, "px");
        var coordinates = getCaretCoordinates(target, target.selectionStart);
        if (coordinates)
            console.log('the caret positions: ', coordinates.left + ", " + coordinates.top);
        if (target.isContentEditable) {
            console.log("text input2: ", target.textContent);
            var inputText = target.textContent;
            if (inputText.includes('.')) {
                const sentences = inputText.trim().split('.');
                // Get the last sentence
                inputText = sentences[sentences.length - 1];
            }

            if (((target.tagName.toLowerCase() === "input" || target.tagName.toLowerCase() === "textarea") && detectCaretPosition(target)) || ((target.tagName.toLowerCase() !== "input" && target.tagName.toLowerCase() !== "textarea") && isCaretInTargetDivOrLastChild(target) && detectCaretPosition2(target))) {
                var response;

                if (isTeluguScript(inputText) && !isWhiteSpace(inputText)) {
                    console.log("Input text is in Telugu script");
                    insert_loader_at_caret(target, coordinates, caretPos);
                    let response1 = await get_model_output(inputText);
                    console.log("type of response1: ", typeof response1)
                    console.log("response1: ", response1['data'])
                    response = return_ans;
                    console.log(response.data1);
                    console.log(response.data2);
                    console.log(response.data3);
                    var predictions = [parse_pred(response.data1), parse_pred(response.data2), parse_pred(response.data3)];
                    var predictions2 = removeAppendedText(inputText, predictions);
                displayPredictions(predictions, target, caretPos, coordinates, inputText);
                if (((target.tagName.toLowerCase() === "input" || target.tagName.toLowerCase() === "textarea") && coordinates.left + 150 <= target.offsetWidth) || ((target.tagName.toLowerCase() !== "input" && target.tagName.toLowerCase() !== "textarea") && caretPos.left + 150 <= target.offsetWidth)) {
                    insert_thintext_at_caret(predictions[0], target, 1, coordinates, caretPos);
                    // Define a new event listener for Shift keydown
                    function shiftKeyHandler(event) {
                        if (event.keyCode === keycode_for_thintext_append) {
                            event.preventDefault();
                            console.log("here in whatsapp arrow down");
                            // Insert thin text when Shift key is pressed
                            // Call your function to insert thin text here
                            console.log('here i am 10');
                            removeThintext();
                            const existingPredictionsContainer = document.querySelector('.predictions-container');
                            if (existingPredictionsContainer) {
                                // removeThintext();
                                existingPredictionsContainer.remove();
                            }
                            if (target.tagName.toLowerCase() !== 'input' && target.tagName.toLowerCase() !== 'textarea') {
                                if (predictions[0]) {
                                    insert_thintext_at_caret(predictions[0], target, 0, coordinates, caretPos);
                                }
                            }
                            else {
                                target.value += ' ' + predictions[0];
                                target.focus();
                            }
                            log_user_choice(inputText, predictions[0]);
                        }
                        target.removeEventListener('keydown', shiftKeyHandler);
                    }


                    target.addEventListener('keydown', shiftKeyHandler);


                }
            }
            }
        }
    }
 document.addEventListener("keyup", handleKeyUp);


})();



/**
 * Retrieves the caret position within a given element.
 * @param {HTMLElement} element - The element to get the caret position from.
 * @returns {Object} An object containing the left and top offset of the caret position relative to the element.
 */
function getCaretPosition2(element) {
    var caretPos = 0,
        sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == element) {
                caretPos = getCaretCharacterOffsetWithin(range.startContainer, range.startOffset);
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == element) {
            var tempEl = document.createElement("span");
            element.insertBefore(tempEl, element.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }

    var rect = range.getBoundingClientRect();
    var elementRect = element.getBoundingClientRect();
    return {
        left: rect.left - elementRect.left,
        top: rect.top - elementRect.top
    };
}

/**
 * Returns the character offset within a given element at a specified offset.
 *
 * This is a helper function to get the character offset within a given element at a specified offset. It is used to get the character offset within the element.
  ```js
    function getCaretCharacterOffsetWithin(element, offset) 
    ```
 * @param {Node} element - The element within which to calculate the character offset.
 * @param {number} offset - The offset at which to calculate the character offset.
 * @returns {number} - The character offset within the element.
 */
function getCaretCharacterOffsetWithin(element, offset) {
    var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, function (node) {
        var nodeLength = node.length || 0;
        if (offset < nodeLength) {
            return NodeFilter.FILTER_ACCEPT;
        }
        offset -= nodeLength;
        return NodeFilter.FILTER_SKIP;
    });

    var charCount = 0;
    while (treeWalker.nextNode()) {
        charCount += treeWalker.currentNode.length || 0;
        if (charCount >= offset) {
            return charCount;
        }
    }

    return charCount;
}


/**
 * Displays predictions in a container based on the input parameters.
 * 
 * This function is used to display the predictions on the webpage as a prediction box near the caret in target field. It also handles the appending of predictions on clicking the prediction being displayed in prediction box. `predictions` is the array of predictions that is to be displayed on the webpage. `target` is the target field where the predictions are to be displayed. `caretPos` is the caret position where the predictions are to be displayed. `coordinates` is the coordinates where the predictions are to be displayed. `input_txt` is the user input text that has generated the predictions which is used for logging the user selections whenever a prediction is selected. 
    ```js
    function displayPredictions(predictions, target, caretPos, coordinates,input_txt)
    ```
 * @param {Array} predictions - The array of predictions to be displayed.
 * @param {HTMLElement} target - The target element where the predictions will be positioned relative to.
 * @param {Object} caretPos - The caret position object containing `top` and `left` properties.
 * @param {Object} coordinates - The coordinates object containing `top` and `left` properties.
 * @param {string} input_txt - The input text value.
 */
function displayPredictions(predictions, target, caretPos, coordinates,input_txt) {
    const existingPredictionsContainer = document.querySelector('.predictions-container');
    if (existingPredictionsContainer) {
        // removeThintext();
        existingPredictionsContainer.remove();
    }
    if (enable_extension=='off')return;
    // Function to dynamically position the predictions container
    function positionPredictionsContainer(predictionsContainer) {
        // const caretPos = getCaretPosition(target);
        console.log("caretPosition for debugging:", caretPos);
        const inputRect = target.getBoundingClientRect();
        console.log("inputRect: ", inputRect);
        // const containerWidth = predictionsContainer.offsetWidth;
        // const containerHeight = predictionsContainer.offsetHeight;
        const containerWidth = 200;
        const containerHeight = 200;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const scrollLeft = window.scrollX;
        const scrollTop = window.scrollY;
        console.log("scrollLeft: ", scrollLeft, " scrollTop:", scrollTop);
        // Calculate the initial position below the caret
        var topPos;
        var leftPos;
        if (target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea') {
            console.log("coordinates.top: ", coordinates.top, " coordinates left:", coordinates.left);
            if (coordinates.top < 0 && coordinates.left < 0)
                return;
            topPos = inputRect.y + coordinates.top + 15;
            leftPos = inputRect.x + coordinates.left;
        }
        else {
            console.log("caret.top:", caretPos.top, " caret.left:", caretPos.left);
            if (caretPos.top < 0 && caretPos.left < 0)
                return;
            topPos = inputRect.y + caretPos.top + 15;
            leftPos = inputRect.x + caretPos.left;
        }
        // if(caretPos.offset<=89){
        // leftPos = caretPos.left + scrollLeft+(5*caretPos.offset);
        // topPos = caretPos.top https://5cbe-218-185-248-66.ngrok-free.app/", screenWidth, " leftPos:", leftPos, " containerwidth:", containerWidth);
        if (leftPos + containerWidth > screenWidth) {
            leftPos = screenWidth - containerWidth;
        }

        // Check if the container exceeds the screen height below caret and adjust position accordingly
        // console.log("screenHeight:", screenHeight, " topPos:", topPos, " containerHeight:", containerHeight);
        if (topPos + containerHeight > screenHeight) {
            console.log("yes it is going outside limit");
            topPos = topPos - 15 - containerHeight;
        }

        // Set the position of the predictions container relative to the input field
        predictionsContainer.style.position = 'fixed';
        predictionsContainer.style.top = topPos + 'px';
        predictionsContainer.style.left = leftPos + 'px';
        predictionsContainer.style.zIndex = '9999';
    }


    // Create a container div for the predictions
    const predictionsContainer = document.createElement('div');
    predictionsContainer.className = 'predictions-container';

    // Loop through predictions and add them to the container
    predictions.forEach(prediction => {
        console.log("predictions are bro: ", prediction);
        // Create a prediction element
        if(prediction===null || prediction===undefined || prediction===''){
            return;
        }
        const predictionElement = document.createElement('div');
        predictionElement.textContent = prediction;
        predictionElement.className = 'prediction';
        predictionElement.addEventListener('mouseover', function () {
            console.log("here in hover function");
            removeThintext();
            if(enable_extension=='on')
            {
                if(enable_thintext=='on')
                {
                    insert_thintext_at_caret(prediction, target, 1, coordinates, caretPos);
                }
    
            }
        });
        // predictionElement.addEventListener('mouseover',function(){
        //     console.log("here in hover after function");
        //     removeThintext();
        //     insert_thintext_at_caret(predictions[0],caretPos,target,1,coordinates,caretPos);
        // });

        // Add event listener to append prediction to input field on click
        predictionElement.addEventListener('click', function () {
            removeThintext();

            console.log('clicked and the target is: ', target);
            log_user_choice(input_txt, prediction);
            if (target.tagName.toLowerCase() !== 'input' && target.tagName.toLowerCase() !== 'textarea') {
                removeThintext();
                console.log('I am here into the append func');
                const paragraphele = target.querySelectorAll("p");
                var lastparagraphele;
                if (paragraphele) {
                    lastparagraphele = paragraphele[paragraphele.length - 1];
                }
                var spanElement;

                if (lastparagraphele) {
                    console.log(lastparagraphele, "is last pra");
                    spanElement = lastparagraphele.querySelector("span");
                }
                if (spanElement) {
                    console.log("yes, i am here yayay");
                    console.log(spanElement);
                    spanElement.childNodes[0].data = spanElement.childNodes[0].data + " " + prediction;
                    predictionsContainer.remove();
                    target.focus();
                    const range = document.createRange();
                    range.setStart(spanElement.childNodes[0], spanElement.childNodes[0].length); // Set the range's start to the end of the text node
                    range.collapse(true); // Collapse the range to the end
                    // Set the selection to the end of the span
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                else {
                    const newSpan = document.createElement('span');
                    newSpan.className = 'insert_prediction_from_pred_box';
                    newSpan.textContent = ' ' + prediction;
                    console.log("newspan:", newSpan);
                    // target.appendChild(newSpan);

                    const childDivs = target.querySelectorAll('div');

                    // If there are child div elements, select the last one 
                    if (childDivs.length > 0) {
                        const lastDiv = childDivs[childDivs.length - 1];
                        const newp = lastDiv.querySelector("p");
                        if (newp) {
                            newp.appendChild(newSpan);
                        }
                        else {
                            var brTags = lastDiv.getElementsByTagName("br");
                            if (brTags.length > 0 && (brTags[brTags.length - 1].parentNode.lastChild === brTags[brTags.length - 1])) {
                                brTags[brTags.length - 1].parentNode.removeChild(brTags[brTags.length - 1]);
                            }
                            lastDiv.appendChild(newSpan);
                        }
                    } else {
                        // If there are no child div elements, append childElement directly to parentDiv
                        // target.appendChild(newSpan);
                        const newp = target.querySelector("p");
                        if (newp) {
                            const childps = target.querySelectorAll('p');
                            const lastp = childps[childps.length - 1];
                            lastp.appendChild(newSpan);
                            // newp.appendChild(newSpan);
                        }
                        else {
                            var brTags = target.getElementsByTagName("br");
                            // for (var i = 0; i < brTags.length; i++) {
                            if (brTags.length > 0 && (brTags[brTags.length - 1].parentNode.lastChild === brTags[brTags.length - 1])) {
                                brTags[brTags.length - 1].parentNode.removeChild(brTags[brTags.length - 1]);
                            }
                            // }
                            target.appendChild(newSpan);
                        }
                    }

                    predictionsContainer.remove();
                    target.focus();
                    const range = document.createRange();
                    range.selectNodeContents(target);
                    range.collapse(false); // Collapse range to the end
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                // insert_thintext_at_caret(prediction, cursor_position(), target, 0);
                // }
            } else if (target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea') {
                console.log("i am going to append the clicked prediction");
                target.value += ' ' + prediction;
                if (predictionsContainer)
                    predictionsContainer.remove();
                target.focus();

                // let divElement = document.createElement('div');
                // document.body.appendChild(divElement);
                // // document.appendChild(divElement);
                // // Optionally, set attributes or styles for the div
                // divElement.id = 'prediction-div';
                // console.log("prediction to be appended: ",prediction);
                // divElement.textContent = prediction;
                // const inputRect = target.getBoundingClientRect();
                // // divElement = document.getElementById('prediction-div');
                // divElement.style.left = inputRect.x + coordinates.left + 'px';
                // divElement.style.top = inputRect.y + coordinates.top + 'px';
                // divElement.style.display = 'block';
                // predictionsContainer.remove();
                // target.focus();
            }

            // Append prediction to the input field value
            //    target.value += ' ' + prediction + ' ';

            // Remove predictions container from the DOM
            //    predictionsContainer.remove();
            //    target.focus();

            // const newSpan = document.createElement('span');
            // newSpan.className = 'insert_prediction';
            // newSpan.textContent = prediction + ' ';
            // target.appendChild(newSpan);
            // predictionsContainer.remove();
            // target.focus();
        });

        // Append prediction element to predictions container
        predictionsContainer.appendChild(predictionElement);
    });

    // Position predictions container initially
    positionPredictionsContainer(predictionsContainer);

    // Append predictions container to the body of the webpage
    document.body.appendChild(predictionsContainer);
    predictionsContainer.addEventListener('mouseleave', function () {
        console.log("hover after function");
        removeThintext();
        if(enable_extension=='on')
        {
            if(enable_thintext=='on')
            {

                insert_thintext_at_caret(predictions[0], target, 1, coordinates, caretPos);
            }

        }
    });
    // Add event listener to reposition predictions container when scrolling or resizing
    window.addEventListener('scroll', function () {
        positionPredictionsContainer(predictionsContainer);
    });

    window.addEventListener('resize', function () {
        positionPredictionsContainer(predictionsContainer);
    });

    // Add event listener to remove predictions container when a key is pressed
    document.body.addEventListener('keydown', function () {
        removeThintext();
        predictionsContainer.remove();
    });

}


// CSS styles for the predictions container and prediction elements This gets added to the HTML
const cssStyles = `
    .predictions-container {
        background-color: #DEF1FA; /* Transparent light blue background */
        border: 2px solid rgba(0, 191, 255, 0.9); /* Semi-transparent light blue border */
        color: #13396a;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        padding: 5px;
        position: absolute;
        z-index: 9999;
    }

    .prediction {
        padding: 8px 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .prediction:hover {
        background-color: #f5f5f5; /* Light grey on hover */
    }

    .thintext {
        color: #999; /* Light grey color */
        /* font-size : 120px; */
    }

    #prediction-div {
        position: absolute;
        color: #999; /* Thin shade of grey */
        padding: 5px;
        /* font-size: 12px; */
        z-index: 10000;
        font-weight: 300; /* Set font weight to thin */
        background-color: transparent; /* No background color */
    }
     #active-button {
        position: absolute;
        color: #999; /* Thin shade of grey */
        padding: 5px;
        z-index: 10000;
        opacity: 0.90;
        font-weight: 300; /* Set font weight to thin */
        background-color: transparent; /* No background color */
    }
    
    
    .loader {
        border: 0.01px solid rgba(0, 0, 0, .1);
        border-left-color: transparent;
        width: 0.01%;
        border-radius: 50%;
        height: 0.01%;
        animation: spin89345 0.6s linear infinite;
      }
            
      @keyframes spin89345 {
        0% {
          transform: rotate(0deg);
        }
      
        100% {
          transform: rotate(360deg);
        }
      }
`;


// Create a <style> element and append CSS styles
const styleElement = document.createElement('style');
styleElement.innerHTML = cssStyles;
document.head.appendChild(styleElement);

