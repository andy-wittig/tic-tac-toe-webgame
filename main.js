var gameHasStarted = false;

function drawGameBoard(board)
{
    //const gameContainer = document.getElementById("game-container");
    for (let i = 0; i < 9; i+=3)
    {
        const col1 = document.getElementById("itm" + i);
        const col2 = document.getElementById("itm" + (i + 1));
        const col3 = document.getElementById("itm" + (i + 2));

        col1.innerHTML = board[i / 3][0];
        col2.innerHTML = board[i / 3][1];
        col3.innerHTML = board[i / 3][2];
    }
}

function startGame()
{
    //Init game variables
    var boardData = [
        ["-", "-", "-"],
        ["-", "-", "-"],
        ["-", "-", "-"]
    ];

    drawGameBoard(boardData);

    if (!gameHasStarted) 
    {
        gameHasStarted = true;
        //runGame(boardData);
    }
    else //Clear board
    {
        gameHasStarted = false;
        return;
    }
}

function isGameOver(board)
{
    return false;
}

async function runGame(board) //Main game loop
{
    var roundsPlayed = 0;

    while (!isGameOver(board) && gameHasStarted)
    {
        //await getPlayerTurn();
        drawGameBoard(board);

        //await getBotTurn();
        drawGameBoard(board);

        roundsPlayed++;
    }
}