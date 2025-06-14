## Functions

<dl>
<dt><a href="#sleep">sleep(ms)</a> ⇒ <code>Promise</code></dt>
<dd><p>Delays execution of resolve function.</p>
</dd>
<dt><a href="#drawGameBoard">drawGameBoard()</a></dt>
<dd><p>Iterates through the game board data structure to update the HTML tic-tac-toe grid.</p>
</dd>
<dt><a href="#startGame">startGame()</a></dt>
<dd><p>Controls the game state, either starting the board or clearing it.</p>
</dd>
<dt><a href="#gameButton">gameButton(button)</a></dt>
<dd><p>Called when a button on the board is pressed. Handles the players turn and calls the bots function for it&#39;s turn.</p>
</dd>
<dt><a href="#botTurn">botTurn()</a></dt>
<dd><p>Manages the bot&#39;s turn, choosing the next &quot;O&quot; position and updates the game logic accordingly.</p>
</dd>
<dt><a href="#checkGameOver">checkGameOver()</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks the win state and resets the game. Wins can occur either by tie, player win, or bot win.</p>
</dd>
<dt><a href="#drawWinButtons">drawWinButtons(btn1, btn2, btn3)</a></dt>
<dd><p>Takes three button positions to color the winning buttons.</p>
</dd>
<dt><a href="#checkWin">checkWin(btnType)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if the designated character has a winning placement on the game board.</p>
</dd>
</dl>

<a name="sleep"></a>

## sleep(ms) ⇒ <code>Promise</code>
Delays execution of resolve function.

**Kind**: global function
**Returns**: <code>Promise</code> - - Promise uses setTimeout to delay execution of the resolve function.

| Param | Type | Description |
| --- | --- | --- |
| ms | <code>int</code> | Time to wait in miliseconds. |

<a name="drawGameBoard"></a>

## drawGameBoard()
Iterates through the game board data structure to update the HTML tic-tac-toe grid.

**Kind**: global function
<a name="startGame"></a>

## startGame()
Controls the game state, either starting the board or clearing it.

**Kind**: global function
<a name="gameButton"></a>

## gameButton(button)
Called when a button on the board is pressed. Handles the players turn and calls the bots function for it's turn.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| button | <code>int</code> | The button position to attempt to place an "X" for the player's turn. |

<a name="botTurn"></a>

## botTurn()
Manages the bot's turn, choosing the next "O" position and updates the game logic accordingly.

**Kind**: global function
<a name="checkGameOver"></a>

## checkGameOver() ⇒ <code>boolean</code>
Checks the win state and resets the game. Wins can occur either by tie, player win, or bot win.

**Kind**: global function
**Returns**: <code>boolean</code> - - Returns true or false based on whether the game is over.
<a name="drawWinButtons"></a>

## drawWinButtons(btn1, btn2, btn3)
Takes three button positions to color the winning buttons.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| btn1 | <code>int</code> | Position of the first button to color red. |
| btn2 | <code>int</code> | Position of the second button to color red. |
| btn3 | <code>nt</code> | Position of the third button to color red. |

<a name="checkWin"></a>

## checkWin(btnType) ⇒ <code>boolean</code>
Checks if the designated character has a winning placement on the game board.

**Kind**: global function
**Returns**: <code>boolean</code> - - Returns true if the specified character has three in a row, and false otherwise.

| Param | Type | Description |
| --- | --- | --- |
| btnType | <code>char</code> | The character used to check if there is three in a row. Typically "X" or "O". |