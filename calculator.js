/*
Samuel Hinkhouse
4/08/17
Last Update: 4/11/17 - Added comments and changed letiable names to accurate describe what their function is, got rid of duplicate code
Calculator
*/
$(document).ready(function() {
    let lastButtonPressed = "";
    let answer = "";
    let current = "";
    let history = "";
    let decimal = true;
    let reset = "";
    const debug = true;
    // rounds answer if it has decimals
    function round(val) {
        val = val.toString().split("");
        if (val.indexOf(".") !== -1) {
            let valTest = val.slice(val.indexOf(".") + 1, val.length);
            val = val.slice(0, val.indexOf(".") + 1);
            let i = 0;
            while (valTest[i] < 1) {
                i++;
            }
            valTest = valTest.join("").slice(0, i + 2);
            if (valTest[valTest.length - 1] === "0") {
                valTest = valTest.slice(0, -1);
            }
            return val.join("") + valTest;
        } else {
            return val.join("");
        }
    }

    $("button").click(function() {
        //Finds the value of the button they entered
        lastButtonPressed = $(this).attr("value");

        //Debug if true
        if (debug) {
            console.log("current:" + current);
            console.log("answer:" + answer);
            console.log("history:" + history);
            console.log("lastButtonPressed:" + lastButtonPressed);
        }
        //Resets the history after problem is solved
        if (reset) {
            if (
                lastButtonPressed === "/" ||
                lastButtonPressed === "*" ||
                lastButtonPressed === "-" ||
                lastButtonPressed === "+"
            ) {
                history = answer;
            } else {
                answer = "";
            }
        }
        reset = false;

        // Clear everything if ac or ce is clicked
        if (
            lastButtonPressed === "ac" ||
            (lastButtonPressed === "ce" && current === "noChange")
        ) {
            answer = "";
            current = "";
            lastButtonPressed = "";
            history = "";
            $("#history").html("0");
            $("#answer").html("0");
            decimal = true;
        } else if (lastButtonPressed === "ce") {
            $("#history").html(history.slice(0, -current.length));
            history = history.slice(0, -current.length);
            answer = answer.slice(0, -current.length);
            current = answer;
            if (history.length === 0 || history === " ") {
                $("#history").html("0");
            }
            $("#answer").html("0");
            lastButtonPressed = "";
            decimal = true;
        }

        // Don't allow two or more decimals to be entered
        if (lastButtonPressed === "." || lastButtonPressed === "0.") {
            if (!decimal) {
                lastButtonPressed = "";
            }
        }

        // Prevents improper use of first digit
        if (
            (answer.length === 0 &&
                isNaN(lastButtonPressed) &&
                lastButtonPressed !== ".") ||
            (answer.length === 0 && lastButtonPressed === "0")
        ) {
            //lastButtonPressed = '';
            //answer = '';
        }

        // Checks for extra operators
        if (current !== "noChange") {
            if (
                (current === "" &&
                    isNaN(lastButtonPressed) &&
                    lastButtonPressed !== ".") ||
                (isNaN(current) &&
                    isNaN(lastButtonPressed) &&
                    lastButtonPressed !== ".")
            ) {
                lastButtonPressed = "";
            }
        }

        // Combining digits together
        while (
            Number(lastButtonPressed) ||
            lastButtonPressed === "0" ||
            current === "."
        ) {
            if (
                isNaN(current) &&
                lastButtonPressed === "0" &&
                current !== "."
            ) {
                lastButtonPressed = "";
            } else if (
                isNaN(current) &&
                Number(lastButtonPressed) &&
                current !== "."
            ) {
                current = "";
            }
            if (lastButtonPressed === ".") {
                decimal = false;
            }
            if (current === "0." && isNaN(lastButtonPressed)) {
                lastButtonPressed = "";
            } else {
                if (current[current.length - 1] === ".") {
                    current = current.concat(lastButtonPressed);
                } else {
                    current += lastButtonPressed;
                }
                answer += lastButtonPressed;
                $("#answer").html(current);
                history += lastButtonPressed;
                $("#history").html(history);
                lastButtonPressed = "";
            }
        }
        function addOperation(operation) {
            if (operation === "=") {
                if (current[current.length - 1] === ".") {
                    lastButtonPressed = "";
                } else {
                    current = eval(answer).toString();
                    $("#answer").html(round(eval(answer)));
                    answer = round(eval(answer));
                    history += lastButtonPressed + answer;
                    $("#history").html(history);
                    history = answer;
                    lastButtonPressed = "";
                    reset = true;
                    decimal = true;
                }
                current = "noChange";
            } else if (operation === ".") {
                if (current === "" || isNaN(current[current.length - 1])) {
                    current = "0.";
                    answer += lastButtonPressed;
                    $("#answer").html("0.");
                    history += current;
                    $("#history").html(history);
                } else {
                    current = current.concat(".");
                    answer = answer.concat(".");
                    history = answer;
                    $("#history").html(answer);
                    $("#answer").html(current);
                }
                lastButtonPressed = "";
                decimal = false;
            } else {
                current = operation;
                answer += current;
                history += current;
                $("#history").html(history);
                $("#answer").html(operation);
                lastButtonPressed = "";
                decimal = true;
            }
        }
        // Switch for Operations
        switch (lastButtonPressed) {
            case ".":
            case "=":
            case "+":
            case "-":
            case "/":
            case "*":
                addOperation(lastButtonPressed);
                break;
        }
        lastButtonPressed = "";

        //If the reset button is clicked, then the history gets cleared
        if (reset) {
            history = "";
        }

        // This if statement checks to see if the text in #lastButtonPressed is too long or the #history text is too long for the entry box
        if (
            $("#lastButtonPressed")
                .children()
                .text().length > 11 ||
            $("#history").text().length > 25
        ) {
            $("#answer").html("0");
            $("#history").html("Too Many Digits");
            current = "";
            answer = "";
            history = "";
            decimal = true;
        }
    });
});
