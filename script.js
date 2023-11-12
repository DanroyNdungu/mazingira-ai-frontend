const authToken = window.AUTH_TOKEN;

query({"inputs": `Start model`}).then((response) => {
    $(".splash-screen").fadeOut("slow");
            });
$(document).ready(function () {
    // Event handler for the send button
    $("#sendButton").click(function (event) {
        event.preventDefault(); // Prevent form submission

        var userInput = $("#userInput").val();
        if (userInput) {
            hideErrorAlert();

            // Display user message
            appendMessage(userInput, "user-message", true);
            $("#userInput").val('');

            // Disable input and button during message processing
            $("#userInput, #sendButton").prop("disabled", true);
            $("#loading-message").removeClass("hidden");

            // Simulate API call with a timeout (modify this part for your actual API call)
            var requestTimeout = setTimeout(function () {
                // Display a timeout message to the user
                var timeoutMessage = "The request is taking too long. Please try again later.";
                appendMessage(timeoutMessage, "timeout-message", false);

                // Add buttons for regeneration
                var regenerateButtons = $("<div>").addClass("flex justify-center mt-2");
                var yesButton = $("<button>").text("Yes").addClass("bg-green-500 text-white px-4 py-2 rounded mr-4 hover:bg-green-600");
                var noButton = $("<button>").text("No").addClass("bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600");
                regenerateButtons.append(yesButton, noButton);
                $("#chat-container").append(regenerateButtons);

                yesButton.click(function () {
                    // Disable input and button during message processing
                    $("#userInput, #sendButton").prop("disabled", true);
                    $("#loading-message").removeClass("hidden");
                    // Regenerate the response using the query method
                    query({ "inputs": `[I]: ${userInput.toLowerCase()}` }).then((response) => {
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
                });

                noButton.click(function () {
                    // Clear the input field
                    $("#userInput").val('');
                });
                
                // Enable the input field and send button
                $("#userInput, #sendButton").prop("disabled", false);

                // Hide loading message
                $("#loading-message").addClass("hidden");
                
                // Clear the input field
                $("#userInput").val('');
            }, 10000); // 10 seconds timeout (adjust as needed)

            // Make the API call (replace with your actual API call)
            query({ "inputs": `[I]: ${userInput.toLowerCase()}` }).then((response) => {
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

        } else {
            showErrorAlert();
        }
    });
});
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


function showErrorAlert() {
    $("#inputError").removeClass('hidden');
    $("#userInput").removeClass('border-green-300').addClass('border-red-400');
}

function hideErrorAlert() {
    $("#inputError").addClass('hidden');
    $("#userInput").addClass('border-green-300').removeClass('border-red-400');
}

function appendMessage(text, className, isUserMessage) {
    if (className == 'timeout-message') {
        var messageDiv = $("<div>").addClass(className);
        messageDiv.text(text);
        $("#chat-container").append(messageDiv);
        // Scroll to the bottom of the chat container
        $("#chat-container").scrollTop($("#chat-container")[0].scrollHeight);
    }
    else {
        var messageDiv = $("<div>").addClass("rounded-lg p-3 shadow my-2 max-w-xl " + (isUserMessage ? "ml-auto bg-white" : "mr-auto bg-blue-100"));
        messageDiv.text(text);
        $("#chat-container").append(messageDiv);
        // Scroll to the bottom of the chat container
        $("#chat-container").scrollTop($("#chat-container")[0].scrollHeight);
    }
}
