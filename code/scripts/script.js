/* Program: script.js
 * Programmer: Leonard Michel
 * Start Date: 11.08.2021
 * Last Change:
 * End Date: /
 * License: /
 * Version: 0.0.0.0
*/

/**** INITIALIZATION ****/

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;

let texteditor = document.getElementById("texteditor");
let textoutput = document.getElementById("textoutput");
let messagebox = document.getElementById("messagebox");
let errorlistInsert = document.getElementById("errorinsert");
let runcode = document.getElementById("runcode");

// Wait for the document to be completely loaded before attaching any event listeners to the HTML elements. */
window.addEventListener("load", function()
{
	console.log("Page has been fully loaded.\n");
	if (runcode)
	{
		runcode.addEventListener("click", function()
		{
			console.log("Run program.\n");
			interpreter.reset();
			interpreter.load(texteditor.value);
			interpreter.isExecuting = true;
		}, false);
	}

	// This lets the user add a 4 letter wide tab inside the text editor. The tab size is controlled within the style.css file. Standard is 8 letters wide.
	if (texteditor)
	{
		texteditor.addEventListener("keydown", function (e)
		{
			if (e.key == "Tab")
			{
				e.preventDefault();
				let start = this.selectionStart;
				let end = this.selectionEnd;

				this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

				//this.selectionStart = this.selectionEnd = start + 1;
				this.selectionEnd = start + 1;
			}
		});
	}
});

/* Audio Object Definitions */
let audioButtonPressed = new Audio("audio/audioButtonPressed.mp3");
let audioButtonPressedIsReady = false;
audioButtonPressed.addEventListener("canplaythrough", function () { audioButtonPressedIsReady = true; });

/* Mouse Input */
let mouseX = 0;
let mouseY = 0;
let mouseLeftPressed = false,
    mouseRightPressed = false;

let mouseLeftPressedBefore = false,
    mouseRightPressedBefore = false;

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);

function mouseMoveHandler(e)
{
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function mouseDownHandler(e)
{
    if (e.button == 0) { mouseLeftPressed = true; };
    if (e.button == 2) { mouseRightPressed = true; };
}

function mouseUpHandler(e)
{
    if (e.button == 0) { mouseLeftPressed = false; };
    if (e.button == 2) { mouseRightPressed = false; };
}

/* Key Presses */
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let wPressed = false,
    aPressed = false,
    sPressed = false,
    dPressed = false,
    jPressed = false,
    kPressed = false,
    lPressed = false;

let wPressedBefore = false,
    aPressedBefore = false,
    sPressedBefore = false,
    dPressedBefore = false,
    jPressedBefore = false,
    kPressedBefore = false,
    lPressedBefore = false;

function keyDownHandler(e)
{
    if (e.code == "KeyW") { wPressed = true; }
    if (e.code == "KeyA") { aPressed = true; }
    if (e.code == "KeyS") { sPressed = true; }
    if (e.code == "KeyD") { dPressed = true; }

    if (e.code == "KeyJ") { jPressed = true; }
    if (e.code == "KeyK") { kPressed = true; }
    if (e.code == "KeyL") { lPressed = true; }
}

function keyUpHandler(e)
{
    if (e.code == "KeyW") { wPressed = false; }
    if (e.code == "KeyA") { aPressed = false; }
    if (e.code == "KeyS") { sPressed = false; }
    if (e.code == "KeyD") { dPressed = false; }

    if (e.code == "KeyJ") { jPressed = false; }
    if (e.code == "KeyK") { kPressed = false; }
    if (e.code == "KeyL") { lPressed = false; }
}

/* Class Definitions */
class Button
{
	constructor()
	{
        this.x = 0;
        this.y = 0;
        this.width = 150;
        this.height = 50;
        // Colors
        this.colEdgeNeutral = "#888888";
        this.colFaceNeutral = "#00000044";
        this.colEdgeHover = "#bbbbbb";
        this.colFaceHover = "#00000088";
        this.colEdgePressed = "#ffffff";
        this.colFacePressed = "#000000bb";
        this.colTextFill = "#000000";
        this.colTextShadow = "#ffffff";
        // Color assignment
        this.edgeColor = this.colEdgeNeutral;
        this.faceColor = this.colFaceNeutral;

        this.text = "Button";
        this.isPressed = false;
        this.isVisible = true;
		this.playSound = true;
        // How often can the user click the button.
        this.clickSpeed = 50;
        this.clickTick = Date.now();
	}

    update()
    {
        this.collisionDetection();
		this.draw();
		this.playAudio();
    }

    collisionDetection()
    {
        // Only let the user click the button if the wait time has been passed
        if (tp1 - this.clickTick >= this.clickSpeed)
        {
            // If mouse is within button bounds.
            if (mouseX >= this.x && mouseX < this.x + this.width && mouseY >= this.y && mouseY < this.y + this.height)
            {
                // If mouse clicked on button
                if (mouseLeftPressed)
                {
                    if (mouseLeftPressedBefore == false)
                    {
                        this.edgeColor = this.colEdgePressed;
                        this.faceColor = this.colFacePressed;

                        this.isPressed = true;
                        mouseLeftPressedBefore = true;
                    }
                }
                // If mouse is hovering on button
                if (!mouseLeftPressed)
                {
                    this.edgeColor = this.colEdgeHover;
                    this.faceColor = this.colFaceHover;

                    this.isPressed = false;
                    mouseLeftPressedBefore = false;
                }
            }
            // If mouse is out of button bounds.
            else
            {
                this.edgeColor = this.colEdgeNeutral;
                this.faceColor = this.colFaceNeutral;

                this.isPressed = false;
            }

            this.clickTick = Date.now();
        }
    }

    draw()
    {
		if (this.isVisible)
		{
			// Draw fill
			ctx.fillStyle = this.faceColor;
			ctx.fillRect(this.x, this.y, this.width, this.height);

			// Draw border
			ctx.strokeStyle = this.edgeColor;
			ctx.strokeRect(this.x, this.y, this.width, this.height);

			// Draw text
			let textPosX = this.x + (this.width / 2),
				textPosY = this.y + (this.height / 1.5),
				textSize = this.height/1.5;

			ctx.textAlign = "center";
			ctx.font = this.height / 2 + "px sans-serif";

			// Text shadow
			ctx.fillStyle = this.colTextShadow;
			ctx.fillText(this.text, textPosX + textSize/128, textPosY + textSize/128);

			// Actual text
			ctx.fillStyle = this.colTextFill;
			ctx.fillText(this.text, textPosX, textPosY);
		}

    }

	playAudio()
	{
		if (this.playSound)
		{
			if (this.isPressed)
			{
				if (audioButtonPressedIsReady) { audioButtonPressed.play(); };
			}
		}
	}
}

class LeoInterpreter
{
	constructor()
	{
		this.dev = true;
		this.isExecuting = false;
		// The memory that holds all instructions
		this.memory = new Array(256).fill(0);
		// How many lines of code are there after loading is finished.
		this.memoryNumLines = 0;
		// Memory that holds all user-defined variables.
		// User-defined variable names and their values
		this.UVV = new Map();
		// User-defined variable names and their type, such as "INT" or later "STRING" and "FLOAT"
		this.UVT = new Map();
		// User-defined functions and their start address.
		this.UFV = new Map();
		// The name stack. This gets the name of the function that will get executed by a GOTO statement pushed onto it.
		this.S = new Array();
		// The address stack. Whenever the PC encounter the GOTO's a function, the current PC will be pushed onto this stack.
		this.A = new Array();
		//this.UV = [];
		this.PC = 0;
		this.programStartAddress = 0;
		this.programEndAddress = 0;
		// The output string of the interpreter.
		this.console = new String();
		// This shows any syntax errors. Like in Visual Studio
		this.messagebox = new String();
		this.messageTypeColor = new Map();
		// Define the colors associated with each type of message. From neutral to severe.
		this.messageTypeColor.set("info", "#222222"); // dark grey
		this.messageTypeColor.set("warning", "#fff480"); // yellow
		this.messageTypeColor.set("error", "#ff5029"); // red

		// Show column names
		this.addMessage("Type", "Line", "Description");
		// INSTRUCTION -> KEYWORD VARIABLE|VALUE VARIABLE|VALUE|NONE
		// KEYWORD -> ADD | SUB | MUL | DIV | INT | SET | PRINT | CLS | GOTO | FUNC
		// VARIABLE -> NAME + VALUE + TYPE
		// NAME -> 
		//console.log(this.test);
		//this.instruction.set(/(i)[add]\s*\w*\,\s*/, "ADD");
	}

	execute(cycles)
	{
		while (cycles > 0)
		{
			// Only tokenize and parse if it contains something
			if (this.memory[this.PC] != null && this.memory[this.PC] != 0)
			{
				if (this.dev)
				{
					console.log("Executing line " + (this.PC+1) + ".\n");
				}

				//let line = this.tokenize(this.memory[this.PC]);
				let instruction = this.tokenize(this.memory[this.PC]);

				let token = instruction[0];
				console.log(token);

				switch(token.toUpperCase())
				{
					case "ADD":
						{
							// Int must only contain digits from 0-9
							let rInt = /^[0-9]+$/;
							// Float may contain one of three where d is any number of digits and . the decimal point.
							// d.d OR .d OR d    So one could assign numbers like these to a float.
							// 3.1415 .5 5 50.45
							let rFloat = /([0-9]+\.{1}[0-9]+|\.{1}[0-9]+|[0-9]+)/;
							// Name must start with any letter a-z upper or lower case or an under score and may also have digit anywhere except at the beginning.
							// Name may have a-z, A-Z, 0-9 and _. The first letter may not be _
							let rName = /^[a-z|A-z|\_]+[a-z|A-Z|0-9|\_]*$/;///[a-z*|A-Z*|\_*]\d*/;

							// A user-defined variable. e.g. x
							let a = instruction[1].toString();
							// A user-defined variable or a literal. e.g. 5 or $Hello
							let b = instruction[2].toString();
							// a is a user-defined variable
							if (this.UVV.has(a))
							{
								/* b is a user-defined variable */
								if (this.UVV.has(b))
								{
									// Set a to value of a+b only if their types match.
									if (this.UVT.get(a) == this.UVT.get(b))
									{
										if (this.UVT.get(a) == "INT")
										{
											this.UVV.set(a, parseInt(this.UVV.get(a)) + parseInt(this.UVV.get(b)));
										}
										else if (this.UVT.get(a) == "FLOAT")
										{
											this.UVV.set(a, parseFloat(this.UVV.get(a)) + parseFloat(this.UVV.get(b)));
										}
										else if (this.UVT.get(a) == "STRING")
										{
											this.UVV.set(a, this.UVV.get(a).toString() + this.UVV.get(b).toString());
										}
									}
									// Their types don't match so try automatic/implicit conversion.
									else
									{
										// a is of type INT.
										if (this.UVT.get(a) == "INT")
										{
											// b is of type FLOAT.
											if (this.UVT.get(b) == "FLOAT")
											{
												// Set a to value of b floored.
												this.UVV.set(a, this.UVV.get(a) + Math.floor(parseFloat(this.UVV.get(b))));
											}
											// Automatic conversion from "STRING" to INT or FLOAT is not allowed. Like in C++. See more types in the GitHub Wiki.
										}
										// a is of type FLOAT
										else if (this.UVT.get(a) == "FLOAT")
										{
											// b is of type INT
											if (this.UVT.get(b) == "INT")
											{
												// Unsure if value should be stored with decimal point and 0.
												// So if b is 3 a should become 3.0 instead of 3 to signal to the user that it is a float.
												// Set a to value of a+b.
												this.UVV.set(a, this.UVV.get(a) + this.UVV.get(b));
											}
										}
										// a is of type STRING.
										else if (this.UVT.get(a) == "STRING")
										{
											// Set a to value of a+b.
											this.UVV.set(a, this.UVV.get(a) + this.UVV.get(b).toString());
										}
										/* Implicit conversion failed. */
										else
										{
											if (this.dev) { console.warn("Addition of " + b + " to " + a + " failed.\n") };
										}
									}
								}
								/* b is a literal */
								else
								{
									// a is of type INT.
									if (this.UVT.get(a) == "INT")
									{
										// b is of type INT.
										if (rInt.test(b))
										{
											// Set a to value of a + b.
											this.UVV.set(a, parseInt(this.UVV.get(a)) + parseInt(b));
										}
										// b is of type FLOAT.
										else if (rFloat.test(b))
										{
											// Set a to value of a + b floored.
											this.UVV.set(a, parseInt(this.UVV.get(a)) + Math.floor(parseFloat(b)));
										}
										// Automatic conversion from "STRING" to INT or FLOAT is not allowed. Like in C++. See more types in the GitHub Wiki.
									}
									// a is of type FLOAT
									else if (this.UVT.get(a) == "FLOAT")
									{
										// b is of type INT
										if (rInt.test(b))
										{
											// Unsure if value should be stored with decimal point and 0.
											// So if b is 3 a should become 3.0 instead of 3 to signal to the user that it is a float.
											// Set a to value of a+b.
											this.UVV.set(a, parseInt(this.UVV.get(a)) + parseInt(b));
										}
										// b is of type FLOAT.
										else if (rFloat.test(b))
										{
											// Set a to value of a + b floored.
											this.UVV.set(a, parseInt(this.UVV.get(a)) + parseFloat(b));
										}
									}
									// a is of type STRING.
									else if (this.UVT.get(a) == "STRING")
									{
										// Set a to value of a+b.
										this.UVV.set(a, this.UVV.get(a) + b.toString());
									}
									/* Implicit conversion failed. */
									else
									{
										if (this.dev) { console.warn("Addition of " + b + " to " + a + " failed.\n") };
									}
								}
							}
							/* a is not a user-defined variable */
							else
							{
								if (this.dev) { console.warn("Variable " + a + " doesn't exist.\n") };
							}
							this.movePC(1);
						}
						break;
					case "SUB":
						{
							// Int must only contain digits from 0-9
							let rInt = /^[0-9]+$/;
							// Float may contain one of three where d is any number of digits and . the decimal point.
							// d.d OR .d OR d    So one could assign numbers like these to a float.
							// 3.1415 .5 5 50.45
							let rFloat = /([0-9]+\.{1}[0-9]+|\.{1}[0-9]+|[0-9]+)/;
							// Name must start with any letter a-z upper or lower case or an under score and may also have digit anywhere except at the beginning.
							// Name may have a-z, A-Z, 0-9 and _. The first letter may not be _
							let rName = /^[a-z|A-z|\_]+[a-z|A-Z|0-9|\_]*$/;///[a-z*|A-Z*|\_*]\d*/;

							// A user-defined variable. e.g. x
							let a = instruction[1].toString();
							// A user-defined variable or a literal. e.g. 5 or $Hello
							let b = instruction[2].toString();
							// a is a user-defined variable
							console.log("sub instrction.\n");
							if (this.UVV.has(a))
							{
								/* b is a user-defined variable */
								if (this.UVV.has(b))
								{
									// Set a to value of a-b only if their types match.
									if (this.UVT.get(a) == this.UVT.get(b))
									{
										if (this.UVT.get(a) == "INT")
										{
											this.UVV.set(a, parseInt(this.UVV.get(a)) - parseInt(this.UVV.get(b)));
										}
										else if (this.UVT.get(a) == "FLOAT")
										{
											this.UVV.set(a, parseFloat(this.UVV.get(a)) - parseFloat(this.UVV.get(b)));
										}
										else if (this.UVT.get(a) == "STRING")
										{
											this.UVV.set(a, this.UVV.get(a).toString() - this.UVV.get(b).toString());
										}
									}
									// Their types don't match so try automatic/implicit conversion.
									else
									{
										// a is of type INT.
										if (this.UVT.get(a) == "INT")
										{
											// b is of type FLOAT.
											if (this.UVT.get(b) == "FLOAT")
											{
												// Set a to value of a - b floored.
												this.UVV.set(a, this.UVV.get(a) - Math.floor(parseFloat(this.UVV.get(b))));
											}
											// Automatic conversion from "STRING" to INT or FLOAT is not allowed. Like in C++. See more types in the GitHub Wiki.
										}
										// a is of type FLOAT
										else if (this.UVT.get(a) == "FLOAT")
										{
											// b is of type INT
											if (this.UVT.get(b) == "INT")
											{
												// Set a to value of a+b.
												this.UVV.set(a, this.UVV.get(a) - this.UVV.get(b));
											}
										}
										// a is of type STRING.
										else if (this.UVT.get(a) == "STRING")
										{
											if (this.dev)
											{
												console.log("Unable to subtract " + b + " from " + a + ".\n");
												console.log(a + " is not of type STRING.\n");
											};
										}
										/* Implicit conversion failed. */
										else
										{
											if (this.dev) { console.warn("Subtraction of " + b + " from " + a + " failed.\n") };
										}
									}
								}
								/* b is a literal */
								else
								{
									// a is of type INT.
									if (this.UVT.get(a) == "INT")
									{
										// b is of type INT.
										if (rInt.test(b))
										{
											// Set a to value of a + b.
											this.UVV.set(a, parseInt(this.UVV.get(a)) - parseInt(b));
										}
										// b is of type FLOAT.
										else if (rFloat.test(b))
										{
											// Set a to value of a + b floored.
											this.UVV.set(a, parseInt(this.UVV.get(a)) - Math.floor(parseFloat(b)));
										}
										// Automatic conversion from "STRING" to INT or FLOAT is not allowed. Like in C++. See more types in the GitHub Wiki.
									}
									// a is of type FLOAT
									else if (this.UVT.get(a) == "FLOAT")
									{
										// b is of type INT
										if (rInt.test(b))
										{
											// Unsure if value should be stored with decimal point and 0.
											// So if b is 3 a should become 3.0 instead of 3 to signal to the user that it is a float.
											// Set a to value of a+b.
											this.UVV.set(a, parseInt(this.UVV.get(a)) - parseInt(b));
										}
										// b is of type FLOAT.
										else if (rFloat.test(b))
										{
											// Set a to value of a + b floored.
											this.UVV.set(a, parseInt(this.UVV.get(a)) - parseFloat(b));
										}
									}
									// a is of type STRING.
									else if (this.UVT.get(a) == "STRING")
									{
										// Set a to value of a+b.
										this.UVV.set(a, this.UVV.get(a) - b.toString());
									}
									/* Implicit conversion failed. */
									else
									{
										if (this.dev) { console.warn("Subtraction of " + b + " from " + a + " failed.\n") };
									}
								}
							}
							/* a is not a user-defined variable */
							else
							{
								if (this.dev) { console.warn("Variable " + a + " doesn't exist.\n") };
							}
							this.movePC(1);
						}
						break;
					case "MUL":
						{
							// Int must only contain digits from 0-9
							let rInt = /^[0-9]+$/;
							// Float may contain one of three where d is any number of digits and . the decimal point.
							// d.d OR .d OR d    So one could assign numbers like these to a float.
							// 3.1415 .5 5 50.45
							let rFloat = /([0-9]+\.{1}[0-9]+|\.{1}[0-9]+|[0-9]+)/;
							// Name must start with any letter a-z upper or lower case or an under score and may also have digit anywhere except at the beginning.
							// Name may have a-z, A-Z, 0-9 and _. The first letter may not be _
							let rName = /^[a-z|A-z|\_]+[a-z|A-Z|0-9|\_]*$/;///[a-z*|A-Z*|\_*]\d*/;

							// A user-defined variable. e.g. x
							let a = instruction[1].toString();
							// A user-defined variable or a literal. e.g. 5 or $Hello
							let b = instruction[2].toString();
							// a is a user-defined variable
							if (this.UVV.has(a))
							{
								/* b is a user-defined variable */
								if (this.UVV.has(b))
								{
									/*
									if (this.UVT.get(b) == "INT" || this.UVT.get(b) == "FLOAT")
									{
										this.UVV.set(a, parseInt(this.UVV.get(a)) + parseInt(this.UVV.get(b)));
									}
									*/
									// Set a to value of a*b only if their types match.
									if (this.UVT.get(a) == this.UVT.get(b))
									{
										if (this.UVT.get(a) == "INT")
										{
											this.UVV.set(a, parseInt(this.UVV.get(a)) * parseInt(this.UVV.get(b)));
										}
										else if (this.UVT.get(a) == "FLOAT")
										{
											this.UVV.set(a, parseFloat(this.UVV.get(a)) * parseFloat(this.UVV.get(b)));
										}
										else if (this.UVT.get(a) == "STRING")
										{
											if (this.dev)
											{
												console.log("Cannot multiply " + a + " by " + b + ".\n");
												console.log(a + " and " + b + " are of type STRING.\n");
											}
										}
									}
									// Their types don't match so try automatic/implicit conversion.
									else
									{
										// a is of type INT.
										if (this.UVT.get(a) == "INT")
										{
											// b is of type FLOAT.
											if (this.UVT.get(b) == "FLOAT")
											{
												this.UVV.set(a, Math.floor(parseInt(this.UVV.get(a)) * parseFloat(this.UVV.get(b))));
											}
										}
										// a is of type FLOAT
										else if (this.UVT.get(a) == "FLOAT")
										{
											// b is of type INT
											if (this.UVT.get(b) == "INT")
											{
												this.UVV.set(a, Math.floor(parseFloat(this.UVV.get(a)) * parseInt(this.UVV.get(b))));
											}
										}
										// a is of type STRING.
										else if (this.UVT.get(a) == "STRING")
										{
											if (this.dev)
											{
												console.log("Cannot multiply " + a + " by " + b + ".\n");
												console.log(a + " is of type STRING.\n");
											}
										}
										/* Implicit conversion failed. */
										else
										{
											if (this.dev) { console.warn("Multiplication of " + a + " by " + b + " failed.\n") };
										}
									}
								}
								/* b is a literal */
								else
								{
									// a is of type INT.
									if (this.UVT.get(a) == "INT")
									{
										// b is of type INT.
										if (rInt.test(b))
										{
											// Set a to value of a + b.
											this.UVV.set(a, parseInt(this.UVV.get(a)) * parseInt(b));
										}
										// b is of type FLOAT.
										else if (rFloat.test(b))
										{
											// Set a to value of a + b floored.
											this.UVV.set(a, Math.floor(parseInt(this.UVV.get(a)) * parseFloat(b)));
										}
									}
									// a is of type FLOAT
									else if (this.UVT.get(a) == "FLOAT")
									{
										// b is of type INT
										if (rInt.test(b))
										{
											this.UVV.set(a, parseFloat(this.UVV.get(a)) * parseInt(b));
										}
										// b is of type FLOAT.
										else if (rFloat.test(b))
										{
											this.UVV.set(a, parseFloat(this.UVV.get(a)) * parseFloat(b));
										}
									}
									// a is of type STRING.
									else if (this.UVT.get(a) == "STRING")
									{
										if (this.dev)
										{
											console.log("Cannot multiply " + a + " by " + b + ".\n");
											console.log(a + " is of type STRING.\n");
										}
									}
									/* Implicit conversion failed. */
									else
									{
										if (this.dev) { console.warn("Multiplication of " + a + " by " + b + " failed.\n") };
									}
								}
							}
							/* a is not a user-defined variable */
							else
							{
								if (this.dev) { console.warn("Variable " + a + " doesn't exist.\n") };
							}
							this.movePC(1);
						}
						break;
					case "DIV":
						{
							// Int must only contain digits from 0-9
							let rInt = /^[0-9]+$/;
							// Float may contain one of three where d is any number of digits and . the decimal point.
							// d.d OR .d OR d    So one could assign numbers like these to a float.
							// 3.1415 .5 5 50.45
							let rFloat = /([0-9]+\.{1}[0-9]+|\.{1}[0-9]+|[0-9]+)/;
							// Name must start with any letter a-z upper or lower case or an under score and may also have digit anywhere except at the beginning.
							// Name may have a-z, A-Z, 0-9 and _. The first letter may not be _
							let rName = /^[a-z|A-z|\_]+[a-z|A-Z|0-9|\_]*$/;///[a-z*|A-Z*|\_*]\d*/;

							// A user-defined variable. e.g. x
							let a = instruction[1].toString();
							// A user-defined variable or a literal. e.g. 5 or $Hello
							let b = instruction[2].toString();
							// a is a user-defined variable
							if (this.UVV.has(a))
							{
								/* b is a user-defined variable */
								if (this.UVV.has(b))
								{
									/*
									if (this.UVT.get(b) == "INT" || this.UVT.get(b) == "FLOAT")
									{
										this.UVV.set(a, parseInt(this.UVV.get(a)) + parseInt(this.UVV.get(b)));
									}
									*/
									// Set a to value of a*b only if their types match.
									if (this.UVT.get(a) == this.UVT.get(b))
									{
										if (this.UVT.get(a) == "INT")
										{
											this.UVV.set(a, parseInt(this.UVV.get(a)) / parseInt(this.UVV.get(b)));
										}
										else if (this.UVT.get(a) == "FLOAT")
										{
											this.UVV.set(a, parseFloat(this.UVV.get(a)) / parseFloat(this.UVV.get(b)));
										}
										else if (this.UVT.get(a) == "STRING")
										{
											if (this.dev)
											{
												console.log("Cannot divide " + a + " by " + b + ".\n");
												console.log(a + " and " + b + " are of type STRING.\n");
											}
										}
									}
									// Their types don't match so try automatic/implicit conversion.
									else
									{
										// a is of type INT.
										if (this.UVT.get(a) == "INT")
										{
											// b is of type FLOAT.
											if (this.UVT.get(b) == "FLOAT")
											{
												this.UVV.set(a, Math.floor(parseInt(this.UVV.get(a)) / parseFloat(this.UVV.get(b))));
											}
										}
										// a is of type FLOAT
										else if (this.UVT.get(a) == "FLOAT")
										{
											// b is of type INT
											if (this.UVT.get(b) == "INT")
											{
												this.UVV.set(a, Math.floor(parseFloat(this.UVV.get(a)) / parseInt(this.UVV.get(b))));
											}
										}
										// a is of type STRING.
										else if (this.UVT.get(a) == "STRING")
										{
											if (this.dev)
											{
												console.log("Cannot divide " + a + " by " + b + ".\n");
												console.log(a + " is of type STRING.\n");
											}
										}
										/* Implicit conversion failed. */
										else
										{
											if (this.dev) { console.warn("Division of " + a + " by " + b + " failed.\n") };
										}
									}
								}
								/* b is a literal */
								else
								{
									// a is of type INT.
									if (this.UVT.get(a) == "INT")
									{
										// b is of type INT.
										if (rInt.test(b))
										{
											// Set a to value of a + b.
											this.UVV.set(a, parseInt(this.UVV.get(a)) / parseInt(b));
										}
										// b is of type FLOAT.
										else if (rFloat.test(b))
										{
											// Set a to value of a + b floored.
											this.UVV.set(a, Math.floor(parseInt(this.UVV.get(a)) / parseFloat(b)));
										}
									}
									// a is of type FLOAT
									else if (this.UVT.get(a) == "FLOAT")
									{
										// b is of type INT
										if (rInt.test(b))
										{
											this.UVV.set(a, parseFloat(this.UVV.get(a)) / parseInt(b));
										}
										// b is of type FLOAT.
										else if (rFloat.test(b))
										{
											this.UVV.set(a, parseFloat(this.UVV.get(a)) / parseFloat(b));
										}
									}
									// a is of type STRING.
									else if (this.UVT.get(a) == "STRING")
									{
										if (this.dev)
										{
											console.log("Cannot divide " + a + " by " + b + ".\n");
											console.log(a + " is of type STRING.\n");
										}
									}
									/* Implicit conversion failed. */
									else
									{
										if (this.dev) { console.warn("Division of " + a + " by " + b + " failed.\n") };
									}
								}
							}
							/* a is not a user-defined variable */
							else
							{
								if (this.dev) { console.warn("Variable " + a + " doesn't exist.\n") };
							}
							this.movePC(1);
						}
						break;
					case "INT":
						{
							// Int must only contain digits from 0-9
							let rInt = /^[0-9]+$/;
							// Name must start with any letter a-z upper or lower case or an under score and may also have digit anywhere except at the beginning.
							// Name may have a-z, A-Z, 0-9 and _. The first letter may not be _
							let rName = /^[a-z|A-z|\_]+[a-z|A-Z|0-9|\_]*$/;///[a-z*|A-Z*|\_*]\d*/;

							// A user-defined variable. e.g. x
							let a = instruction[1].toString();
							// A user-defined variable or a literal. e.g. 5 or $Hello
							let b = instruction[2].toString();

							// If supplied variable name only has alphanumeric characters and supplied value is only a digit (as opposed to letters)
							if (rName.test(a))
							{
								// Only create variable with that name if it hasn't been created before
								if (this.UVV.has(a) != true)
								{
									if (rInt.test(b))
									{
										// Store int name and value in map
										this.UVV.set(a, b);
										// Store int name with associated type in map
										this.UVT.set(a, "INT");
									}
									else
									{
										if (this.dev) {console.warn("Supplied variable value " + b + " is invalid.\n")};
									}
								}
								// Variable with that name already exists
								else
								{
									if (this.dev) {console.warn("Variable " + a + " already exists.\n")};
								}
							}
							// Variable name is invalid
							else
							{
								if (this.dev) {console.warn("Supplied variable name " + a + " is invalid.\n")};
							}
							this.movePC(1);
						}
						break;
					case "FLOAT":
						{
							// Int must only contain digits from 0-9
							let rInt = /^[0-9]+$/;
							// Float may contain one of three where d is any number of digits and . the decimal point.
							// d.d OR .d OR d    So one could assign numbers like these to a float.
							// 3.1415 .5 5 50.45
							let rFloat = /([0-9]+\.{1}[0-9]+|\.{1}[0-9]+|[0-9]+)/;
							// Name must start with any letter a-z upper or lower case or an under score and may also have digit anywhere except at the beginning.
							// Name may have a-z, A-Z, 0-9 and _. The first letter may not be _
							let rName = /^[a-z|A-z|\_]+[a-z|A-Z|0-9|\_]*$/;///[a-z*|A-Z*|\_*]\d*/;

							// A user-defined variable. e.g. x
							let a = instruction[1].toString();
							// A user-defined variable or a literal. e.g. 5 or $Hello
							let b = instruction[2].toString();

							// If supplied variable name only has alphanumeric characters
							if (rName.test(a))
							{
								// Only create variable with that name if it hasn't been created before
								if (this.UVV.has(a) != true)
								{
									// Check if supplied value is a float
									if (rFloat.test(b))
									{
										// Store float name and value in map
										this.UVV.set(a, b);
										// Store float name with associated type in map
										this.UVT.set(a, "FLOAT");
									}
									else
									{
										if (this.dev) {console.warn("Supplied variable value " + b + " is invalid.\n")};
									}
								}
								// Variable with that name already exists
								else
								{
									if (this.dev) {console.warn("Variable " + a + " already exists.\n")};
								}
							}
							// Variable name is invalid
							else
							{
								if (this.dev) {console.warn("Supplied variable name " + a + " is invalid.\n")};
							}
							this.movePC(1);
						}
						break;
					case "SET":
						{
							// Int must only contain digits from 0-9
							let rInt = /^[0-9]+$/;
							// Float may contain one of three where d is any number of digits and . the decimal point.
							// d.d OR .d OR d    So one could assign numbers like these to a float.
							// 3.1415 .5 5 50.45
							let rFloat = /([0-9]+\.{1}[0-9]+|\.{1}[0-9]+|[0-9]+)/;
							// Name must start with any letter a-z upper or lower case or an under score and may also have digit anywhere except at the beginning.
							// Name may have a-z, A-Z, 0-9 and _. The first letter may not be _
							let rName = /^[a-z|A-z|\_]+[a-z|A-Z|0-9|\_]*$/;///[a-z*|A-Z*|\_*]\d*/;

							// A user-defined variable. e.g. x
							let a = instruction[1].toString();
							// A user-defined variable or a literal. e.g. 5 or $Hello
							let b = instruction[2].toString();
							// a is a user-defined variable
							if (this.UVV.has(a))
							{
								/* b is a user-defined variable */
								if (this.UVV.has(b))
								{
									// Set a to value of b only if their types match.
									if (this.UVT.get(a) == this.UVT.get(b))
									{
										this.UVV.set(a, this.UVV.get(b))
									}
									// Their types don't match so try automatic/implicit conversion.
									else
									{
										// a is of type INT.
										if (this.UVT.get(a) == "INT")
										{
											// b is of type FLOAT.
											if (this.UVT.get(b) == "FLOAT")
											{
												// Set a to value of b floored.
												this.UVV.set(a, Math.floor(parseFloat(this.UVV.get(b))));
											}
											// Automatic conversion from "STRING" to INT or FLOAT is not allowed. Like in C++. See more types in the GitHub Wiki.
										}
										// a is of type FLOAT
										else if (this.UVT.get(a) == "FLOAT")
										{
											// b is of type INT
											if (this.UVT.get(b) == "INT")
											{
												// Unsure if value should be stored with decimal point and 0.
												// So if b is 3 a should become 3.0 instead of 3 to signal to the user that it is a float.
												// Set a to value of b.
												this.UVV.set(a, this.UVV.get(b));
											}
										}
										// a is of type STRING.
										else if (this.UVT.get(a) == "STRING")
										{
											// Set a to value of b.
											this.UVV.set(a, this.UVV.get(b).toString());
										}
										/* Implicit conversion failed. */
										else
										{
											if (this.dev) { console.warn("Implicit conversion from " + b + " to " + a + " failed.\n") };
										}
									}
								}
								/* b is a literal */
								else
								{
									// a is of type INT.
									if (this.UVT.get(a) == "INT")
									{
										// b is of type FLOAT.
										if (rFloat.test(b))
										{
											// Set a to value of b floored.
											this.UVV.set(a, Math.floor(parseFloat(b)));
										}
										// Automatic conversion from "STRING" to INT or FLOAT is not allowed. Like in C++. See more types in the GitHub Wiki.
									}
									// a is of type FLOAT
									else if (this.UVT.get(a) == "FLOAT")
									{
										// b is of type INT
										if (rInt.test(b))
										{
											// Unsure if value should be stored with decimal point and 0.
											// So if b is 3 a should become 3.0 instead of 3 to signal to the user that it is a float.
											// Set a to value of b.
											this.UVV.set(a, b);
										}
									}
									// a is of type STRING.
									else if (this.UVT.get(a) == "STRING")
									{
										// Set a to value of b.
										this.UVV.set(a, b.toString());
									}
									/* Implicit conversion failed. */
									else
									{
										if (this.dev) { console.warn("Implicit conversion from " + b + " to " + a + " failed.\n") };
									}
								}
							}
							/* a is not a user-defined variable */
							else
							{
								if (this.dev) { console.warn("Variable " + a + " doesn't exist.\n") };
							}
							this.movePC(1);
						}
						break;
					case "PRINT":
						{
							// Only parse second part of instruction if it exists
							if (instruction[1])
							{
								let success = false;
								let uds = instruction[1].toString();

								let s;
								// It's a literal string
								if (uds[0] == "$")
								{
									// Remove first char
									s = uds.substring(1);
									success = true;
								}
								// It's a user-defined variable
								else if (this.UVV.has(uds))
								{
									s = this.UVV.get(uds);
									success = true;
								}
								else
								{
									success = false;
								}


								if (success)
								{
									this.console += s;
									console.log("Wrote " + s + " to the console.\n");

									let text = this.console;
									// Replace all occurrences of "\n" with "\r\n". Don't replace any "\n" that are preceded by "\". So don't replace "\\n"
									text = text.replace(/(?<!\\)\\n/g, "\r\n"); //&#013;&#010; \r\n
									// Replace all escaped "\n" with "\n". So "\\n" becomes "\n".
									// The first "\" in the replace functions escapes the second "\" before the "n".
									text = text.replace(/\\\\n/g, "\\n");
									textoutput.value = text;
								}
								else
								{
									if (this.dev)
									{
										console.warn("Supplied value is not a variable nor a valid string.\n");
									}
								}
							}
							else
							{
								if (this.dev)
								{
									console.warn("No variable or string supplied.\n");
								}
							}

							this.movePC(1);
						}
						break;
					case "CLS":
						{
							this.console = "";
							if (this.dev) { console.log("Cleared the screen.\n")};
						}
						break;
					case "GOTO":
						{
							if (instruction[1])
							{
								let a = instruction[1].toString();
								if (this.UFV.has(a))
								{
									// Push name of function that will now be executed onto the stack.
									this.S.push(a);
									// Push current address onto address stack.
									this.A.push(this.PC);

									// Jump to declaration of instruction. The movePC call below makes the PC jump to the first line of the function.
									this.PC = parseInt(this.UFV.get(a));
									console.log("this.S " + this.S);
								}
								else
								{
									if (this.dev)
									{
										console.warn("No function with name " + a + " declared.\n");
										let desc = "No function with name " + a + " declared.";
										this.addMessage("warning", this.PC, desc);
									}
									this.movePC(1);
								}
							}
							else
							{
								if (this.dev)
								{
									console.warn("No function name supplied at line " + this.PC + ".\n");
								}
								this.movePC(1);
							}
						}
						break;
					case "FUNC":
						{
							// Name may have a-z, A-Z, 0-9 and _. The first letter may not be a digit
							let rName = /^[a-z|A-z|\_]+[a-z|A-Z|0-9|\_]*$/;

							if (instruction[1])
							{
								let a = instruction[1].toString();

								// If supplied function name is valid
								if (rName.test(a))
								{
									this.UFV.set(a, this.PC);
								}

								// Only execute this function if the top-most memory address on the stack contains this function's name.
								if (this.S[this.S.length-1] == a)
								{
									// Go to first line of function code
									this.movePC(1);
								}
								// Otherwise go to the next line until you are below a ";" which marks the end of this function definition.
								// From there on execute as usual.
								else
								{
									let success = false;
									for (let i = this.PC; i < this.programEndAddress, success == false; i++)
									{
										let instruction = this.tokenize(this.memory[i]);
										if (instruction[0] == ";")
										{
											this.PC = i;
											this.movePC(1);
											console.log("Found end of function.\n\n\n\n");
											success = true;
										}
									}
								}
							}
							// No function name supplied
							else
							{
								// Go to the next line until you are below a ";" which marks the end of this function definition.
								// From there on execute as usual.
								let success = false;
								for (let i = this.PC; i < this.programEndAddress, success == false; i++)
								{
									let instruction = this.tokenize(this.memory[this.PC]);
									// Encountered end of function
									if (instruction[0] == ";")
									{
										this.PC = i;
										// Go to next line. Call movePC so that any out of bounds errors get handled.
										this.movePC(1);
										console.log("Found end of function.\n\n\n\n");
										success = true;
									}
								}
								// Program Counter is out of bounds as no ";" was encountered.
								if (success = false)
								{
									// Let movePC function handle the out of bounds PC error
									//this.movePC(1);
									/*
									if (this.dev)
									{
										console.warn("End of function not found.\n");
										console.warn("PC out of bounds.\n");
									}
									*/
								}
							}
						}
						break;
					case ";":
						{
							if (this.S.length > 0)
							{
								// Go back to where you called the function and move to the next line.
								this.PC = this.A.pop()+1;
								this.S.pop();
								if (this.dev)
								{
									console.log("Found end of function.\n");
								}
							}
							else
							{
								if (this.dev)
								{
									console.warn("No function to return from.\n");
								}
								this.movePC(1);
							}
						}
						break;
					default:
						{
							this.movePC(1);
							if (this.dev)
							{
								console.log("Instruction " + instruction + " unknown.\n");
							}
						}
						break;
				}
			}
			else
			{
				if (this.dev)
				{
					console.log("Line is 0.\n");
				}
				this.movePC(1);
			}
			cycles--;
		}
	}

	// Move the Program Counter forwards (+n) or backwards (-n).
	movePC(n)
	{
		this.PC += n;
		if (this.PC > this.programEndAddress)
		{
			if (this.dev) { console.log("Program Counter out of bounds.\n"); };
			this.isExecuting = false;
		}
	}

	addMessage(type, line, desc)
	{
		let s = "";
		s += type.toString().padEnd(8, " ") + " ";
		s += line.toString().padStart(4, " ") + " ";
		s += desc.toString().padStart(1, " ") + "\n";
		this.messagebox += s;
		messagebox.value = this.messagebox;
	}

	// This adds an error to the error list.
	addError(type, line, desc)
	{
		let tempText;

		// Insert new row at bottom of table
		let newRow = errorlistInsert.insertRow(-1);

		// Create Type cell
		let cellType = newRow.insertCell(0);
		tempText = document.createTextNode(type);
		cellType.appendChild(tempText);

		// Create Line cell
		let cellLine = newRow.insertCell(1);
		tempText = document.createTextNode(line);
		cellLine.appendChild(tempText);

		// Create Description cell
		let cellDesc = newRow.insertCell(2);
		tempText = document.createTextNode(desc);
		cellDesc.appendChild(tempText);
	}

	parse()
	{
	}

	tokenize(line)
	{
		// Remove any "," and split according to white space.
		//line = line.toString().replace(/\,/, "").split(/\s|\,/);
		//line = line.toString().replace(/\,/, "").split(/\s|\,/);

		// PRINT: Replace any whitespace followed by " or a-z or A-Z or _ with a comma
		//line = line.toString().replace(/\s+[\"+|a-z|A-Z|\_]/, ",\"");
		//line = line.toString().replace(/\s+[\"+|a-z|A-Z|\_]/, ",\"");
		// Replace any whitespace with a " following with a comma. So print "Hello, World" becomes print,Hello, World"
		//line = line.toString().replace(/\s+\"{1}/, ",");
		//// Replace the second " with any white space following with nothing
		//line = line.toString().replace(/\s+\"{1}/, "");
		// Replace white space at end of line with nothing
		//line = line.toString().replace(/\s+$/, "");
		// Replace remaining white space that is before a comma with a comma.
		// Split according to comma
		//line = line.split(/\,/);

		// Split at each whitespace that does not have a "$" preceding it. So "print $Hello, World!" becomes ["print", "$Hello, World!"]
		line = line.toString().split(/(?<!\$(?:.*))\s+/);
		console.log("Tokenized line to: " + line + "\n");
		return line;
	}

	load(s)
	{
		// Create array of lines
		let line = s.split("\n");

		/*
		 * 
		 * This is disabled for now, as the parser otherwise displays the wrong line numbers for errors and warnings.
		 * So this code is currently being used in the parser. (The giant switch statement.)
		 * 
		 */
		//line = this.hRemoveEmptyLines(line);

		// Copy lines into memory. One line per memory address
		for (let i = 0; i < line.length; i++)
		{
			// Remove any preceding whitespace. so "   int x, 5" becomes "int x, 5"
			let c = line[i].replace(/\s*/, "");
			// Remove and white space right before a comment and the following characters.
			this.memory[i] = c.replace(/\s*\/{2}.*/, "");
		}
		this.memoryNumLines = line.length;
		this.programEndAddress = line.length-1;

		console.log("Number of lines loaded into memory: " + this.memoryNumLines + "\n");
		console.log(line);

		if (this.dev)
		{
			console.log("Loaded code into memory.\n");
			for (let i = 0; i < this.memory.length; i++)
			{
				if (this.memory[i] != null && this.memory[i] != 0)
				{
					console.log("Line " + (i+1) + " " + this.memory[i]);
				}
			}
		}
	}

	hRemoveEmptyLines(line)
	{
		// Remove empty lines or lines that have white space or that have white space followed by //
		// So this will not remove "  int x, 5 // A comment"
		for (let i = 0; i < line.length; i++)
		{
			// If lines is empty or starts with any number of whitespace followed by //
			let commentRegExp = /^[\s|\/]*\/{2}.*/;///[\s]*\/{2}.*/;
			if (line[i] == null || line[i] == "" || commentRegExp.test(line[i]))
			{
				line.splice(i, 1);
				i--;
			}
		}

		return line;
	}

	reset()
	{
		this.dev = true;
		this.isExecuting = false;
		// The memory that holds all instructions
		this.memory = new Array(256).fill(0);
		// How many lines of code are there after loading is finished.
		this.memoryNumLines = 0;
		// Memory that holds all user-defined variables.
		// User-defined variable names and their values
		this.UVV = new Map();
		// User-defined variable names and their type, such as "INT" or later "STRING" and "FLOAT"
		this.UVT = new Map();
		// User-defined functions and their start address.
		this.UFV = new Map();
		// The name stack. This gets the name of the function that will get executed by a GOTO statement pushed onto it.
		this.S = new Array();
		// The address stack. Whenever the PC encounter the GOTO's a function, the current PC will be pushed onto this stack.
		this.A = new Array();
		//this.UV = [];
		this.PC = 0;
		this.programStartAddress = 0;
		this.programEndAddress = 0;
		// The output string of the interpreter.
		this.console = new String();
		// This shows any syntax errors. Like in Visual Studio
		this.messagebox = new String();
		this.messageTypeColor = new Map();
		// Define the colors associated with each type of message. From neutral to severe.
		this.messageTypeColor.set("info", "#222222"); // dark grey
		this.messageTypeColor.set("warning", "#fff480"); // yellow
		this.messageTypeColor.set("error", "#ff5029"); // red

		this.addMessage("Type", "Line", "Description");
	}
}

/* Function definitions */
function getRandomIntInclusive(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum and minimum are inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let code = "";
let interpreter = new LeoInterpreter;
//interpreter.load(texteditor.value);
//interpreter.execute(6);

// Time variables
let tp1 = Date.now();
let tp2 = Date.now();
let elapsedTime = 0;

// The game loop
window.main = function ()
{
    window.requestAnimationFrame(main);
    // Get elapsed time for last tick.
    tp2 = Date.now();
    elapsedTime = tp2 - tp1;
    //console.log("elapsedTime:" + elapsedTime + "\n");
    tp1 = tp2;

	if (interpreter.isExecuting)
	{
		interpreter.execute(1);
	}
}

// Start the game loop
main();