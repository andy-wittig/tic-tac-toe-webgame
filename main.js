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
        gameButtons[i].classList.remove("btn-red");
        gameButtons[i].classList.add("btn-normal");
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
    startButton.disabled = true;

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
            
            startButton.disabled = false;

            if (checkGameOver()) { return; }

            gameInfo.innerHTML = "Players turn!";
            isPlayersTurn = true;
        });
    });
}

function checkGameOver()
{
    if (checkWin("X"))
    {
        startButton.innerHTML = "start";
        gameInfo.innerHTML = "Player wins!";
        gameHasStarted = false;
        firstTurnTaken = false;
        return true;
    }

    else if (checkWin("O"))
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

function drawWinButtons(btn1, btn2, btn3)
{
    gameButtons[btn1].classList.remove("btn-normal");
    gameButtons[btn2].classList.remove("btn-normal");
    gameButtons[btn3].classList.remove("btn-normal");
    gameButtons[btn1].classList.add("btn-red");
    gameButtons[btn2].classList.add("btn-red");
    gameButtons[btn3].classList.add("btn-red");
}

function checkWin(btnType)
{
    for (let i = 0; i < boardData.length; i += 3) //Rows
    {
        if (boardData[i] == btnType && boardData[i + 1] == btnType && boardData[i + 2] == btnType)
        {
            drawWinButtons(i, i + 1, i + 2);
            return true;
        }
    }

    for (let i = 0; i < 3; i++) //Columns
    {
        if (boardData[i] == btnType && boardData[i + 3] == btnType && boardData[i + 6] == btnType)
        {
            drawWinButtons(i, i + 3, i + 6);
            return true;
        }
    }

    if (boardData[0] == btnType && boardData[4] == btnType && boardData[8] == btnType) //Diagonal
    {
        drawWinButtons(0, 4, 8);
        return true;
    }

    if (boardData[2] == btnType && boardData[4] == btnType && boardData[6] == btnType) //Diagonal
    {
        drawWinButtons(2, 4, 6);
        return true; 
    }

    return false;
}