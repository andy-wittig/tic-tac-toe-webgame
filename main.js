/*
Andrew Wittig
6/13/2025
*/
var gameHasStarted = false;
var isPlayersTurn = false;
var firstTurnTaken = false;
var winner = "";
var boardData = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];

const gameContainer = document.getElementById("game-container");
const startButton = document.getElementById("start-button");
const gameInfo = document.getElementById("game-info");
const gameButtons = gameContainer.children;

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function drawGameBoard()
{
    for (let i = 0; i < gameButtons.length; i++)
    {
        gameButtons[i].innerHTML = boardData[i];
        gameButtons[i].style.backgroundColor = "rgb(160, 232, 239)";
        gameButtons[i].style.boxShadow = "0px 1vw rgb(83, 170, 194)";
    }
}

function startGame()
{
    if (!gameHasStarted)
    {
        boardData = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
        gameHasStarted = true;
        isPlayersTurn = Math.random() < 0.5;

        startButton.innerHTML = "clear";
        gameContainer.classList.remove("clear-animation");
        drawGameBoard();

        if (isPlayersTurn) 
        { 
            gameInfo.innerHTML = "Players turn!"; 
        }
        else 
        { 
            gameInfo.innerHTML = "Bots turn!"; 
            botTurn();
        }
    }
    else //Clear board
    {
        gameContainer.classList.add("clear-animation");
        boardData = ["T", "I", "C", "T", "A", "C", "T", "O", "E"];
        drawGameBoard();
        startButton.innerHTML = "start";
        gameInfo.innerHTML = "Board cleared!";
        gameHasStarted = false;
        firstTurnTaken = false;
        return;
    }
}

function gameButton(button)
{
    if (gameHasStarted && isPlayersTurn)
    {
        if (boardData[button] == "X" || boardData[button] == "O")
        {
            gameInfo.innerHTML = "Sorry, this tile is taken!";
            return;
        }
        else if (boardData[button] == "-")
        {
            boardData[button] = "X";
            drawGameBoard();
        }
        
        if (firstTurnTaken)
        {
            isPlayersTurn = false;
            botTurn();
        }
        else
        {
            gameInfo.innerHTML = "Players turn again!";
            firstTurnTaken = true;
            return;
        }
    }

    if (checkGameOver()) { return; }
}

function botTurn()
{
    gameInfo.innerHTML = "Bots turn!";

    sleep(1500).then(() => {
        if (!gameHasStarted) { return; }
        gameInfo.innerHTML = "Bot thinking...";

        sleep(2000).then(() => {
            if (!gameHasStarted) { return; }
            let botChoice = Math.floor(Math.random() * 9); //0-8
            while (boardData[botChoice] == "X" || boardData[botChoice] == "O")
            {
                botChoice = Math.floor(Math.random() * 9); //try new position
            }
            boardData[botChoice] = "O";
            drawGameBoard();
            
            if (!firstTurnTaken)
            {
                firstTurnTaken = true;
                if (checkGameOver()) { return; }
                botTurn();
                return;
            }

            if (checkGameOver()) { return; }

            gameInfo.innerHTML = "Players turn!";
            isPlayersTurn = true;
        });
    });
}

function checkGameOver()
{
    if (checkScore("X"))
    {
        startButton.innerHTML = "start";
        gameInfo.innerHTML = "Player wins!";
        gameHasStarted = false;
        firstTurnTaken = false;
        return true;
    }
    else if (checkScore("O"))
    {
        startButton.innerHTML = "start";
        gameInfo.innerHTML = "Bot wins!";
        gameHasStarted = false;
        firstTurnTaken = false;
        return true;
    }
    let gameTied = true;
    for (let i = 0; i < boardData.length; i ++)
    {
        if (boardData[i] == "-")
        {
            gameTied = false;
        }
    }
    if (gameTied)
    {
        startButton.innerHTML = "start";
        gameInfo.innerHTML = "Tie!";
        gameHasStarted = false;
        firstTurnTaken = false;
        return true;
    }
    return false;
}

function checkScore(char)
{
    for (let i = 0; i < boardData.length; i += 3) //Rows
    {
        if (boardData[i] == char && boardData[i + 1] == char && boardData[i + 2] == char)
        {
            gameButtons[i].style.backgroundColor = "rgb(239, 160, 160)";
            gameButtons[i + 1].style.backgroundColor = "rgb(239, 160, 160)";
            gameButtons[i + 2].style.backgroundColor = "rgb(239, 160, 160)";
            gameButtons[i].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
            gameButtons[i + 1].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
            gameButtons[i + 2].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
            return true;
        }
    }

    for (let i = 0; i < 3; i++) //Columns
    {
        if (boardData[i] == char && boardData[i + 3] == char && boardData[i + 6] == char)
        {
            gameButtons[i].style.backgroundColor = "rgb(239, 160, 160)";
            gameButtons[i + 3].style.backgroundColor = "rgb(239, 160, 160)";
            gameButtons[i + 6].style.backgroundColor = "rgb(239, 160, 160)";
            gameButtons[i].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
            gameButtons[i + 3].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
            gameButtons[i + 6].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
            return true;
        }
    }

    if (boardData[0] == char && boardData[4] == char && boardData[8] == char) //Diagonal
    {
        gameButtons[0].style.backgroundColor = "rgb(239, 160, 160)";
        gameButtons[4].style.backgroundColor = "rgb(239, 160, 160)";
        gameButtons[8].style.backgroundColor = "rgb(239, 160, 160)";
        gameButtons[0].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
        gameButtons[4].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
        gameButtons[8].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
        return true;
    }

    if (boardData[2] == char && boardData[4] == char && boardData[6] == char) //Diagonal
    {
        gameButtons[2].style.backgroundColor = "rgb(239, 160, 160)";
        gameButtons[4].style.backgroundColor = "rgb(239, 160, 160)";
        gameButtons[6].style.backgroundColor = "rgb(239, 160, 160)";
        gameButtons[2].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
        gameButtons[4].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
        gameButtons[6].style.boxShadow = "0px 1vw rgb(194, 83, 83)";
        return true; 
    }
    return false;
}