var gameHasStarted = false;
var isPlayersTurn = false;
var firstTurnTaken = false;
var boardData = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];

const gameContainer = document.getElementById("game-container");
const startButton = document.getElementById("start-button");
const gameInfo = document.getElementById("game-info");

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function drawGameBoard()
{
    const gameButtons = gameContainer.children;
    for (let i = 0; i < gameButtons.length; i++)
    {
        gameButtons[i].innerHTML = boardData[i];
    }
}

function startGame()
{
    if (!gameHasStarted)
    {
        boardData = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
        gameHasStarted = true;
        isPlayersTurn = Math.random() < 0.5;
        console.log(isPlayersTurn);
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
        boardData = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
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
    if (isGameOver()) { return; }

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
                botTurn();
                return;
            }

            gameInfo.innerHTML = "Players turn!";
            isPlayersTurn = true;
        });
    });
}

function isGameOver()
{
    return false;
}