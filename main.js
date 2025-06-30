/*
Andrew Wittig
6/29/2025

Self Hosted Tic Tac Toe (using JSON) Web Game
*/

if ("showOpenFilePicker" in self)
{
    console.log("The File System Access API is supported in this browser!");
}

//----------Math Helpers----------
function getRandIntFromRange(min, max)
{ //Inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Delays execution of resolve function.
 *
 * @param {int} ms - Time to wait in miliseconds.
 * @returns {Promise} - Promise uses setTimeout to delay execution of the resolve function.
 */
function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
//----------End Math Helpers----------

//----------HTML Elements----------
const gameContainer = document.getElementById("game-container");
const startButton = document.getElementById("start-button");
const gameInfo = document.getElementById("game-info");
const clientGameInfo = document.getElementById("client-game-info");
const scoreCount = document.getElementById("score");
const gameButtons = gameContainer.children;
const divFileSystem = document.getElementById("file-system-buttons");

gameInfo.innerHTML = "Either host or join a game to start playing!";

divFileSystem.addEventListener('animationend', (event) => {
    divFileSystem.innerHTML = "";
});
//----------End HTML Elements----------

//----------Game Logic Variables----------
let diceRoll = getRandIntFromRange(1, 6);

var gameState = {
    gameHasStarted: false,
    firstRound: true,
    clearBoard: false,
    startingRoll: diceRoll,
    hostRoll: 0,
    clientRoll: 0,
    isHostTurn: false,
    boardData: ["T", "I", "C", "T", "A", "C", "T", "O", "E"]
}

let fileHandle;
let pauseRead = false;

async function readGameState()
{
    let gameStateFile = await fileHandle.getFile();
    let gameStateContent = await gameStateFile.text();

    const newGameState = JSON.parse(gameStateContent);

    Object.assign(gameState, newGameState);
}

async function writeGameState()
{
    const writableGameState = await fileHandle.createWritable();

    const jsonString = JSON.stringify(gameState);

    await writableGameState.write(jsonString);
    await writableGameState.close();
}
//----------End Game Logic Variables----------

//----------Saving and Loading Files----------
async function getFileHandle()
{
    const options = {
        startIn: "documents",
        types: [{
            accept: { "application/json" : [".json"] }
        }]
    };

    try
    {
        const [fileHandle] = await window.showOpenFilePicker(options);
        return fileHandle;
    }
    catch (err)
    {
        console.log(`There was an error openening the file picker: ${err}`);
        throw err;
    }
}
async function saveFileHandle()
{
    const options = {
        startIn: "documents",
        suggestedName: 'Game State.json',
        types: [{
            description: "Json Files",
            accept: { "application/json" : [".json"] }
        }]
    };
    
    try
    {
        const fileHandle = await window.showSaveFilePicker(options);
        return fileHandle;
    }
    catch (err)
    {
        console.error(`The file save was cancelled or failed: ${err}`);
        throw err;
    }
}
//----------End Saving and Loading Files----------

//----------Joining and Hosting----------
let isUserHost;

async function joinGame()
{
    try
    {
        fileHandle = await getFileHandle();

        document.title = "Tic-Tac-Toe Client";
        divFileSystem.classList.add("fade-out");

        requestAnimationFrame(gameLoop);
        startButton.disabled = false;
        isUserHost = false;
    }
    catch (err)
    {
        console.log("Could not join the game: ", err);
    }
}

async function hostGame()
{
    try
    {
        fileHandle = await saveFileHandle();

        document.title = "Tic-Tac-Toe Host";
        divFileSystem.classList.add("fade-out");

        await writeGameState();
        requestAnimationFrame(gameLoop);
        startButton.disabled = false;
        isUserHost = true;
    }
    catch (err)
    {
        console.error("Hosting failed!: ", err);
    }
}
//----------End Joining and Hosting----------

/** Iterates through the game board data structure to update the HTML tic-tac-toe grid. */
function drawGameBoard()
{
    for (let i = 0; i < gameButtons.length; i++)
    {
        gameButtons[i].innerHTML = gameState.boardData[i];
        gameButtons[i].classList.remove("btn-red");
        gameButtons[i].classList.add("btn-normal");
    }
}

let lastTime = 0;
startButton.innerHTML = "Roll";
startButton.disabled = true;

async function gameLoop()
{
    if (!pauseRead)
    {
        try
        {
            await readGameState();
        }
        catch (err)
        {
            console.error(err);
        }
    }

    drawGameBoard();

    if (gameState.hostRoll > 0 && gameState.clientRoll > 0 && gameState.firstRound) //Both parties have completed their rolls
    {
        startButton.disabled = false;
        startButton.innerHTML = "clear";

        let hostScore = Math.abs(gameState.startingRoll - gameState.hostRoll);
        let clientScore = Math.abs(gameState.startingRoll - gameState.clientRoll);

        if (hostScore < clientScore)
        {
            gameInfo.innerHTML = `The host's roll of ${gameState.hostRoll} was closest to the computer's roll of ${gameState.startingRoll}.`;
            clientGameInfo.innerHTML = `The client lost with a roll of ${gameState.clientRoll}. It's the host's turn.`;
            gameState.isHostTurn = true;
        }
        else
        {
            gameInfo.innerHTML = `The client's roll of ${gameState.clientRoll} was closest to the computer's roll of ${gameState.startingRoll}.`;
            clientGameInfo.innerHTML = `The host lost with a roll of ${gameState.hostRoll}. It's the client's turn.`;
            gameState.isHostTurn = false;
        }

        gameState.firstRound = false;
        gameState.gameHasStarted = true;
        gameState.boardData = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
        await writeGameState();
    }

    if (gameState.clearBoard)
    {
        startButton.innerHTML = "start";
        gameInfo.innerHTML = "Board has been cleared!";
        clientGameInfo.innerHTML = "";
        gameContainer.classList.add("clear-animation");
        gameState.boardData = ["T", "I", "C", "T", "A", "C", "T", "O", "E"];

        gameState.gameHasStarted = false;
        gameState.firstRound = true;
        gameState.hostRoll = 0;
        gameState.clientRoll = 0;
        gameState.clearBoard = false
        await writeGameState();
    }

    if (game)

    requestAnimationFrame(gameLoop);
}

/** Controls the game state, either starting the board or clearing it. */
async function startGame()
{
    pauseRead = true;
    await readGameState();

    if (gameState.firstRound)
    {
        clientGameInfo.innerHTML = `The computer has rolled a ${gameState.startingRoll}`;
    }

    if (gameState.firstRound && isUserHost) //Host Dice Roll
    {
        let roll = getRandIntFromRange(1, 6);
        gameState.hostRoll = roll;
        gameInfo.innerHTML = `You rolled a ${gameState.hostRoll}`;
        startButton.disabled = true;
    }

    if (gameState.firstRound && !isUserHost) //Client Dice Roll
    {
        let roll = getRandIntFromRange(1, 6);
        gameState.clientRoll = roll;
        gameInfo.innerHTML = `You rolled a ${gameState.clientRoll}`;
        startButton.disabled = true;
    }

    if (gameState.gameHasStarted && !gameState.firstRound) //Clear the board
    {
        gameState.clearBoard = true;
    }

    await writeGameState();
    pauseRead = false;
}

/**
 * Called when a button on the board is pressed. Handles the players turn and calls the bots function for it's turn.
 *
 * @param {int} button - The button position to attempt to place an "X" for the player's turn.
 */
async function gameButton(button)
{
    pauseRead = true;
    await readGameState();

    if (gameState.gameHasStarted && isUserHost && gameState.isHostTurn)
    { //Host
        if (gameState.boardData[button] == "X" || gameState.boardData[button] == "O")
        {
            gameInfo.innerHTML = "Sorry, this tile is taken!";
            return;
        }
        else if (gameState.boardData[button] == "-")
        {
            gameState.boardData[button] = "X";
            gameState.isHostTurn = !gameState.isHostTurn;
            await writeGameState();
        }

        if (checkGameOver()) { return; }
    }

    if (gameState.gameHasStarted && !isUserHost && !gameState.isHostTurn)
    { //Client
        if (gameState.boardData[button] == "X" || gameState.boardData[button] == "O")
        {
            gameInfo.innerHTML = "Sorry, this tile is taken!";
            return;
        }
        else if (gameState.boardData[button] == "-")
        {
            gameState.boardData[button] = "O";
            gameState.isHostTurn = !gameState.isHostTurn;
            await writeGameState();
        }

        if (checkGameOver()) { return; }
    }

    pauseRead = false;
}

/**
 * Checks the win state and resets the game. Wins can occur either by tie, player win, or bot win.
 *
 * @returns {boolean} - Returns true or false based on whether the game is over.
 */
async function checkGameOver()
{
    if (checkWin("X"))
    {
        startButton.innerHTML = "start";
        gameInfo.innerHTML = "The host wins!";
        wins++;
        scoreCount.innerHTML = "Win-Streak: " + wins;
        gameState.gameHasStarted = false;
        return true;
    }

    else if (checkWin("O"))
    {
        startButton.innerHTML = "start";
        gameInfo.innerHTML = "The client wins!";
        wins = 0;
        scoreCount.innerHTML = "Win-Streak: " + wins;
        gameState.gameHasStarted = false;
        return true;
    }

    let gameTied = true;
    for (let i = 0; i < gameState.boardData.length; i ++)
    {
        if (gameState.boardData[i] == "-")
        {
            gameTied = false;
        }
    }

    if (gameTied)
    {
        startButton.innerHTML = "start";
        gameInfo.innerHTML = "It was a Tie!";
        gameState.gameHasStarted = false;
        return true;
    }

    return false;
}

/**
 * Takes three button positions to color the winning buttons.
 *
 * @param {int} btn1 - Position of the first button to color red.
 * @param {int} btn2 - Position of the second button to color red.
 * @param {nt} btn3 - Position of the third button to color red.
 */
function drawWinButtons(btn1, btn2, btn3)
{
    gameButtons[btn1].classList.remove("btn-normal");
    gameButtons[btn2].classList.remove("btn-normal");
    gameButtons[btn3].classList.remove("btn-normal");
    gameButtons[btn1].classList.add("btn-red");
    gameButtons[btn2].classList.add("btn-red");
    gameButtons[btn3].classList.add("btn-red");
}

/**
 * Checks if the designated character has a winning placement on the game board.
 *
 * @param {char} btnType - The character used to check if there is three in a row. Typically "X" or "O".
 * @returns {boolean} - Returns true if the specified character has three in a row, and false otherwise.
 */
function checkWin(btnType)
{
    for (let i = 0; i < gameState.boardData.length; i += 3) //Rows
    {
        if (gameState.boardData[i] == btnType && gameState.boardData[i + 1] == btnType && gameState.boardData[i + 2] == btnType)
        {
            drawWinButtons(i, i + 1, i + 2);
            return true;
        }
    }

    for (let i = 0; i < 3; i++) //Columns
    {
        if (gameState.boardData[i] == btnType && gameState.boardData[i + 3] == btnType && gameState.boardData[i + 6] == btnType)
        {
            drawWinButtons(i, i + 3, i + 6);
            return true;
        }
    }

    if (gameState.boardData[0] == btnType && gameState.boardData[4] == btnType && gameState.boardData[8] == btnType) //Diagonal
    {
        drawWinButtons(0, 4, 8);
        return true;
    }

    if (gameState.boardData[2] == btnType && gameState.boardData[4] == btnType && gameState.boardData[6] == btnType) //Diagonal
    {
        drawWinButtons(2, 4, 6);
        return true; 
    }

    return false;
}