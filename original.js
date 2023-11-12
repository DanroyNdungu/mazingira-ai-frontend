$(document).ready(function () {
    $("#sendButton").click(function () {
        var userInput = $("#userInput").val();
        if (userInput) {
            if (!$(".error-alert").hasClass('hidden')) { 
                $(".error-alert").addClass('hidden');
                $("#userInput").addClass('border-green-300');
                $("#userInput").removeClass('border-red-400');
            } 

            // Display user message with user avatar
            appendMessage(userInput, "user-message", true);
            $("#userInput").val('');

            // Disable the input field and send button during generation
            $("#userInput, #sendButton").prop("disabled", true);

            // Show loading message
            $("#loading-message").removeClass("hidden");

            // Set a timeout for the request (e.g., 10 seconds)
            var requestTimeout = setTimeout(function () {
                // Display a timeout message to the user
                appendMessage("The request is taking too long. Please try again later.", "ai-message", false);
                
                // Enable the input field and send button
                $("#userInput, #sendButton").prop("disabled", false);

                // Hide loading message
                $("#loading-message").addClass("hidden");
                
                // Clear the input field
                $("#userInput").val('');
            }, 10000); // 10 seconds timeout (adjust as needed)

            // Make the API call (replace with your actual API call)
            query({"inputs": `[I]: ${userInput.toLowerCase()}`}).then((response) => {
                // Clear the timeout since the response arrived within the expected time
                clearTimeout(requestTimeout);

                // Display AI message with AI avatar
                appendMessage(response, "ai-message", false);

                // Enable the input field and send button after generation
                $("#userInput, #sendButton").prop("disabled", false);

                // Hide loading message
                $("#loading-message").addClass("hidden");
                
                // Clear the input field
                $("#userInput").val('');
            });
        }
        else {
            $(".error-alert").removeClass('hidden');
            $("#userInput").removeClass('border-green-300');
            $("#userInput").addClass('border-red-400');
        }
    });
});


const authToken = window.AUTH_TOKEN;
// Call the Hugging Face API here and get the response
async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/Danroy/mazingira-gpt",
        {
            headers: { Authorization: authToken},
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();

    // Extract the 'generated_text' field
    var text = result[0]['generated_text'];
    
    // Use a regular expression to find the '[O]: ' and everything that follows
    var match = text.match(/\[O\]: ([^\[]+)/);
    
    // Append the result to the 'result' div
    if (match) {
        var cleanedText = match[1].replace(/\\\"/g, '');
        return capitalizeSentences(cleanedText);
    }

    return 'Encountered and error.';
}

function capitalizeSentences(text) {
    return text.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function(c) {
        return c.toUpperCase();
    });
}


function appendMessage(text, className, isUserMessage) {
    var messageContainer = $("<div>").addClass("flex items-start mb-4");

    var messageText = $("<div>").addClass("message " + className).text(text);

    var avatar = $("<div>").addClass("w-12 h-12 m-4");

    if (isUserMessage) {
        messageContainer.addClass("justify-end"); // User message on the right
        avatar.text("U").addClass("border-green-900 text-center items-center justify-center"); // User avatar label with green border and centered "U"
    } else {
        messageContainer.addClass("justify-start");
        avatar.html('<img src="./media/avatar.png" alt="AI Avatar">'); // AI image avatar
    }

    if (isUserMessage) {
        messageContainer.append(messageText);
        messageContainer.append(avatar);
    } else {
        messageContainer.append(avatar);
        messageContainer.append(messageText);
    }

    $("#chat-container").append(messageContainer);
}

