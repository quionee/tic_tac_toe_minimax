
var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

const HUMAN = -1;
const COMP = 1;

var confirm = 0;

/* Function to heuristic evaluation of state. */
function evaluate(state) {
    var score = 0;

    if (gameOver(state, COMP)) {
        score = 1;
    }
    else if (gameOver(state, HUMAN)) {
        score = -1;
    } else {
        score = 0;
    }

    return score;
}

/* This function tests if a specific player wins */
function gameOver(state, player) {
    var win_state = [
        [state[0][0], state[0][1], state[0][2]],
        [state[1][0], state[1][1], state[1][2]],
        [state[2][0], state[2][1], state[2][2]],
        [state[0][0], state[1][0], state[2][0]],
        [state[0][1], state[1][1], state[2][1]],
        [state[0][2], state[1][2], state[2][2]],
        [state[0][0], state[1][1], state[2][2]],
        [state[2][0], state[1][1], state[0][2]],
    ];

    for (var i = 0; i < 8; i++) {
        var line = win_state[i];
        var filled = 0;
        for (var j = 0; j < 3; j++) {
            if (line[j] == player)
                filled++;
        }
        if (filled == 3)
            return true;
    }
    return false;
}

/* This function test if the human or computer wins */
function gameOverAll(state) {
    return gameOver(state, HUMAN) || gameOver(state, COMP);
}

function emptyCells(state) {
    var cells = [];
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            if (state[x][y] == 0)
                cells.push([x, y]);
        }
    }

    return cells;
}

/* A move is valid if the chosen cell is empty */
function validMove(x, y) {
    var empties = emptyCells(board);
    try {
        if (board[x][y] == 0) {
            return true;
        }
        else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

/* Set the move on board, if the coordinates are valid */
function setMove(x, y, player) {
    if (validMove(x, y)) {
        board[x][y] = player;
        return true;
    }
    else {
        return false;
    }
}

function randomPositionFinal(state) {
    if (emptyCells(state).length == 0) {
        return [-1, -1, 0];
    }

    x = parseInt(Math.random() * 3);
    y = parseInt(Math.random() * 3);

    if (state[x][y] == 0) {
        return [x, y, 0];
    }

    return randomPositionFinal(state);
}

function randomBorderPosition(state) {
    freeBorders = [];

    if (state[0][1] == 0) {
        freeBorders.push([0, 1, 0])
    }
    if (state[1][0] == 0) {
        freeBorders.push([1, 0, 0])
    }
    if (state[1][2] == 0) {
        freeBorders.push([1, 2, 0])
    }
    if (state[2][1] == 0) {
        freeBorders.push([2, 1, 0])
    }

    if (freeBorders.length > 0) {
        border = parseInt(Math.random() * (freeBorders.length - 1));
        return freeBorders[border]
    }
    
    return randomPositionFinal(state)
}

function randomCornerPosition(state) {
    freeCorners = [];

    if (state[0][0] == 0) {
        freeCorners.push([0, 0, 0]);
    }
    if (state[0][2] == 0) {
        freeCorners.push([0, 2, 0]);
    }
    if (state[2][0] == 0) {
        freeCorners.push([2, 0, 0]);
    }
    if (state[2][2] == 0) {
        freeCorners.push([2, 2, 0]);
    }

    if (freeCorners.length > 0) {
        corner = parseInt(Math.random() * (freeCorners.length - 1));
        return freeCorners[corner];
    }
    return randomPositionFinal(state);
}

function randomPosition(state) {
    if (state[1][1] == -1) {
        return randomCornerPosition(state);
    }
    else {
        return randomBorderPosition(state);
    }
}

function minimaxA(state, depth, player) {
    score = new Array(3)
    score1 = new Array(3)

    if (depth == 8) {
        if (state[1][1] == 0) {
            return [1, 1, 0]
        }
        else {
            return randomPosition(state)
        }
    }

    for (i = 0; i < 3; ++i) {
        for (j = 0; j < 3; ++j) {
            if (state[i][j] == 0) {
                state[i][j] = player;
                
                score[0] = i;
                score[1] = j;
                score[2] = evaluate(state);
        
                if (score[2] > 0) {
                    state[i][j] = 0;
                    return score;
                }
        
                state[i][j] = 0;
            }
        }
    }

    for (i = 0; i < 3; ++i) {
        for (j = 0; j < 3; ++j) {
            if (state[i][j] == 0) {
                state[i][j] = player;
                
                score[0] = i;
                score[1] = j;
                score[2] = evaluate(state);
        
                for (k = 0; k < 3; ++k) {
                    for (l = 0; l < 3; ++l) {
                        if (state[k][l] == 0) {
                            state[k][l] = -player;
                            score1[0] = k;
                            score1[1] = l;
                            score1[2] = evaluate(state);

                            if (gameOver(state, HUMAN)) {
                                state[i][j] = 0;
                                state[k][l] = 0;
                                return score1;
                            }
                            state[k][l] = 0;
                        }
                    }
                }
                state[i][j] = 0;
            }
        }
    }

    return randomPosition(state);
}

/* *** AI function that choice the best move *** */
// Read more on https://github.com/Cledersonbc/tic-tac-toe-minimax/
function minimax(state, depth, player) {
    var best;

    if (player == COMP) {
        best = [-1, -1, -1000];
    }
    else {
        best = [-1, -1, +1000];
    }

    if (depth == 0 || gameOverAll(state)) {
        let score = evaluate(state);
        return [-1, -1, score];
    }

    emptyCells(state).forEach(function (cell) {
        let x = cell[0];
        let y = cell[1];
        state[x][y] = player;
        let score = minimax(state, depth - 1, -player);
        state[x][y] = 0;
        score[0] = x;
        score[1] = y;

        if (player == COMP) {
            if (score[2] > best[2])
                best = score;
        }
        else {
            if (score[2] < best[2])
                best = score;
        }
    });

    return best;
}

/* It calls the minimax function */
function aiTurn() {
    var x, y;
    var move;
    var cell;
    if (confirm==0)
    {
        move = minimaxA(board, emptyCells(board).length, COMP);
    }
    else
    {
        move = minimax(board, emptyCells(board).length, COMP);
    }
    x = move[0];
    y = move[1];

    if (setMove(x, y, COMP)) {
        cell = document.getElementById(String(x) + String(y));
        cell.innerHTML = "O";
    }
}

/* main */
function clickedCell(cell) {
    //var button = document.getElementById("bnt-restart");
    //button.disabled = true;
    var conditionToContinue = gameOverAll(board) == false && emptyCells(board).length > 0;

    if (conditionToContinue) {
        var x = cell.id.split("")[0];
        var y = cell.id.split("")[1];
        var move = setMove(x, y, HUMAN);
        if (move == true) {
            cell.innerHTML = "X";
            if (conditionToContinue)
                aiTurn();
        }
    }
    if (gameOver(board, COMP)) {
        var lines;
        var cell;
        var msg;

        if (board[0][0] == 1 && board[0][1] == 1 && board[0][2] == 1)
            lines = [[0, 0], [0, 1], [0, 2]];
        else if (board[1][0] == 1 && board[1][1] == 1 && board[1][2] == 1)
            lines = [[1, 0], [1, 1], [1, 2]];
        else if (board[2][0] == 1 && board[2][1] == 1 && board[2][2] == 1)
            lines = [[2, 0], [2, 1], [2, 2]];
        else if (board[0][0] == 1 && board[1][0] == 1 && board[2][0] == 1)
            lines = [[0, 0], [1, 0], [2, 0]];
        else if (board[0][1] == 1 && board[1][1] == 1 && board[2][1] == 1)
            lines = [[0, 1], [1, 1], [2, 1]];
        else if (board[0][2] == 1 && board[1][2] == 1 && board[2][2] == 1)
            lines = [[0, 2], [1, 2], [2, 2]];
        else if (board[0][0] == 1 && board[1][1] == 1 && board[2][2] == 1)
            lines = [[0, 0], [1, 1], [2, 2]];
        else if (board[2][0] == 1 && board[1][1] == 1 && board[0][2] == 1)
            lines = [[2, 0], [1, 1], [0, 2]];

        for (var i = 0; i < lines.length; i++) {
            cell = document.getElementById(String(lines[i][0]) + String(lines[i][1]));
            cell.style.color = "red";
        }

        msg = document.getElementById("message");
        msg.innerHTML = "You lose!";
    }
    if (emptyCells(board).length == 0 && !gameOverAll(board)) {
        var msg = document.getElementById("message");
        msg.innerHTML = "Draw!";
    }
    if (gameOverAll(board) == true || emptyCells(board).length == 0) {
        button.disabled = false;
    }
}

/* Restart the game*/
function restart(button) {
    // se game over ou emptyCells(board).length==0
    // habilitar botões
    // limpar tabuleiro
    if (button.value == "RESTART") {
        var htmlBoard;
        var msg;

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                board[x][y] = 0;
                htmlBoard = document.getElementById(String(x) + String(y));
                htmlBoard.style.color = "#444";
                htmlBoard.innerHTML = "";
            }
        }
        msg = document.getElementById("message");
        msg.innerHTML = "";
    }

    //button.disabled = false;
    let Board = document.getElementById("board-body").style.display = "none";
    Board.innerHTML = "";
    let depth = document.getElementById("bnt-depth").disabled = false;
    depth.innerHTML = "";
    let astar = document.getElementById("bnt-astar").disabled = false;
    astar.innerHTML = "";
}

function AStarMode(button) {
    // desabiltar os botões
    if (button.value == "A*") {
        confirm = 0;
        let tableBoard = document.getElementById("board-body").style.display = "table";
        tableBoard.innerHTML = "";
        button.disabled = "true";
        let depthBtn = document.getElementById("bnt-depth").disabled = "true";
        depthBtn.innerHTML = "";
    } else {
        restart();
    }
    //   esperar o proximo click
    //   se clickou
    //      restartar jogo
}

function depthMode(button) {
    // desabilitar os botões
     if (button.value == "PROFUNDIDADE") {
        confirm = 1;
        let tableBoard = document.getElementById("board-body").style.display = "table";
        tableBoard.innerHTML = "";
        button.disabled = "true";
        let astarBtn = document.getElementById("bnt-astar").disabled = "true";
        astarBtn.innerHTML = "";
    } else {
        button.value = "Restart";
        restart();
    }
}