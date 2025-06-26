//  Dont know if this is getting used or not 


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
function removeAppendedText(sent_text, predictions) {
  for (let i = 0; i < predictions.length; i++) {
    // if (predictions[i].startsWith(sent_text)) {
      const words = predictions[i].split(/\s+/); // Split the string into words
      predictions[i] = words[words.length - 1]; // Take the last word
    // }
  }
  return predictions;
}
function isWhiteSpace(inputStr){
  // check if string comprises only of whitespace characters
  if (inputStr.trim().length == 0)
  return true;
  return false;
}
function parse_pred(string) {
  // Regular expression to match English characters and newline characters
  const englishAndNewlineRegex = /[a-zA-Z\n]/g;
  
  // Remove English content and newline characters from the string
  string = string.replace(englishAndNewlineRegex, '');
  
  // Trim any leading or trailing whitespace
  string = string.trim();
  
  return string;
}


var return_ans;
async function get_model_output(input) {
  const NGROK_LINK = "https://6bb0-152-58-197-245.ngrok-free.app";
//   const payload = { text: 'పుట్టిన రోజు ' };
  const payload = { text: input  };
  const headers = { 'Content-Type': 'application/json' };

  var ans;
  try {
    const rawResponse =  fetch(NGROK_LINK, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    }).then(response => response.text())
    .then(data => {
        console.log(typeof data); 
        console.log(data); 
        // return data;
        ans=data;
        return_ans=data;
      });
      return ans;
  } catch (error) {
  //   if (typeof error !== 'undefined') {
  //     console.error("Error:", error);
  // } else {
  //     console.error("An error occurred but the error object is undefined.");
  // }
  
    // console.error("Error:", error);
    throw error; // Re-throw the error to handle it outside this function if needed
  }
}


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log("background", request.message, sender);

  if (request.message === "inputChanged") {
    console.log("input changed", request.data);
    // Check if the input text is in Telugu script
    
    if (isTeluguScript(request.data) && !isWhiteSpace(request.data)) {
      console.log("Input text is in Telugu script");
      try {
        var response1 =get_model_output(request.data);
        console.log("type of response1: ",typeof response1)
        console.log("response1: ",response1['data'])
        var response = JSON.parse(return_ans);
        // console.log(string(response));
        // console.log(JSON.stringify(response));
        console.log(response.data1);
        console.log(response.data2);
        console.log(response.data3);
        // console.log(typeof response);
        var predictions = [parse_pred(response.data1), parse_pred(response.data2), parse_pred(response.data3)];
        var predictions2=removeAppendedText(request.data,predictions);
        sendResponse({ message1: predictions2[0], message2:predictions2[1], message3: predictions2[3] });
        } 
        catch (error) {
        //   if (typeof error !== 'undefined') {
        //     console.error("Error:", error);
        // } else {
        //     console.error("An error occurred but the error object is undefined.");
        // }
        
        // console.error("Error:", error);
        sendResponse({ error: "some error occured" }); // Send error message as response
      }
    } else {
      console.log("Input text is not in Telugu script");
      sendResponse({ error:"Input text is not in Telugu script or is just whitespace chars" });

    }   
  }
  return true;
});
