var cv = document.getElementById("calc-game-canvas");
var c = cv.getContext("2d");
const wdt = 20, hgt = 20;
const w = document.documentElement.scrollWidth-50;
const h = document.documentElement.scrollHeight-document.getElementById("nav-bar").offsetHeight-50;

var grid;
var stage;
var req;
const cellSize = 70;

const savedStates = 20;
var lastPressed;

function setup() {
    cv.width = w;
    cv.height = h;
    stage = 2;
    c.strokeStyle = "#000000";
    
    window.addEventListener('keydown', (evt) => {
        key = evt.key;
        keyCode = evt.code;
        console.log('key pressed',key,keyCode);
        if (key == 'p') {
            console.log('paused');
            window.cancelAnimationFrame(req);
        }
        if (key == 'r') {
            loadLevel(stage);
        }
        if (key == 'a') {
            console.log('left move');
            handleMove(-1,0);
        }
        if (key == 'd') {
            console.log('right move');
            handleMove(1,0);
        }
        if (key == 'w') {
            console.log('up move');
            handleMove(0,-1);
        }
        if (key == 's') {
            console.log('down move');
            handleMove(0,1);
        }
        if (key == 'z') {
            console.log('undo');
            console.log(prevStates);
            if (lastPressed != 'z') prevStates.pop();
            if (prevStates.length > 0) {
                state = prevStates.pop();
                grid = [...state[0]];
                playerLoc = state[1];
            }
        }
        if (key == '-') {
            console.log('stage down');
            stage--;
            loadLevel(stage);
        }
        if (key == '=') {
            console.log('stage up');
            stage++;
            loadLevel(stage);
        }
        console.log(playerLoc);
        lastPressed = key;
    });

    console.log('loaded');
    loadLevel(stage);
    req = window.requestAnimationFrame(draw);
}

function withinBounds(row, col) {
    console.log('bounds', row, col, row >= 0 && row < grid.length && col >= 0 && col < grid[row].length);
    return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length;
}

function handleMove(x,y) {
    console.log("moved",x,y)
    let dir = [x,y];
    let steps = 1;
    let ret = 0;
    while (withinBounds(playerLoc[0] + steps*dir[1], playerLoc[1] + steps*dir[0])) {
        let newCell = grid[playerLoc[0] + steps*dir[1]][playerLoc[1] + steps*dir[0]];
        if (newCell % 100 == 0) { // if empty space
            for (let i = steps; i > 0; i--) {
                console.log(playerLoc[0]+(i-1)*dir[1],playerLoc[1]+(i-1)*dir[0], 'to', playerLoc[0]+i*dir[1],playerLoc[1]+i*dir[0]);

                grid[playerLoc[0] + i*dir[1]][playerLoc[1] + i*dir[0]] += grid[playerLoc[0] + (i-1)*dir[1]][playerLoc[1] + (i-1)*dir[0]] % 100;
                grid[playerLoc[0] + (i-1)*dir[1]][playerLoc[1] + (i-1)*dir[0]] -= grid[playerLoc[0] + (i-1)*dir[1]][playerLoc[1] + (i-1)*dir[0]] % 100;
            }
            playerLoc[0] += dir[1];
            playerLoc[1] += dir[0];
            grid[playerLoc[0]][playerLoc[1]] -= grid[playerLoc[0]][playerLoc[1]] % 100;
            ret = 1;
            break;
        } else if (newCell > 200 || newCell % 100 == 1) {
            console.log('hit wall')
            ret = 0;
            break;
        }
        else if (newCell % 100 > 1) steps += 1;
    }
    saveState();
    if (checkWin()) nextStage();
}

function nextStage() {
    stage += 1;
    loadLevel(stage);
}

function saveState() {
    prevStates.push([grid.map(function(arr) { return arr.slice(); }), [...playerLoc]]);
    if (prevStates.length > savedStates) prevStates.splice(0,1);
}

// block map
/*
-1 - void
0 - blank
1 - wall
2 - integral sign
3 - equals
4 - x
5 - dx
6 - +c
7 - exponent sign
8 - open paren
9 - closed paren
10-19: numbers 0-9 (n-10)
20 - plus
21 - minus
22 - times
23 - divide
24 - sqrt (must use parens)
25 - pi
26 - infinity
27 - sin
28 - cos
29 - tan
30 - sec
31 - csc
32 - cot
33 - ln
34 - arcsin
35 - arccos
36 - arctan
37 - abs (|)

100+ - necessary, effect of n % 100
200+ - locked in place

*/

prevStates = [];

function loadLevel(lvl) { // x dx = x^2/2 + c
    if (lvl == 0) {
        playerLoc = [2,0];
        grid = [
            [202,204,205,203,100,100,100,100,100,100],
            [0,  0,  0,  0,  4,  7,  12, 24, 12 ,6  ],
            [0,  0,  0,  0,  0,  0,  0,  0,  0  ,0  ],
            [0,  0,  0,  0,  0,  0,  0,  0,  0  ,0  ]
        ];
    } else if (lvl == 1) { // 3 - 1 = 2
        playerLoc = [4,2];
        grid = [
            [100,221,100,203,100],
            [0  ,1  ,0  ,0  ,0  ],
            [0  ,0  ,0  ,0  ,0  ],
            [0  ,11 ,13 ,12 ,1  ],
            [1  ,0  ,0  ,0  ,1  ],
            [1  ,1  ,1  ,1  ,1  ]
        ];
    } else if (lvl == 2) { // cos x dx = sin x + c
        playerLoc = [3,2];
        grid = [
            [202,228,204,205,100,100,100,100,0  ,0  ],
            [0  ,0  ,0  ,0  ,0  ,0  ,6  ,4  ,27 ,0  ],
            [0  ,3  ,0  ,0  ,1  ,0  ,1  ,0  ,0  ,1  ],
            [0  ,0  ,0  ,0  ,1  ,0  ,0  ,0  ,1  ,1  ]
        ];
    } else if (lvl == 3) { // cos x dx = sin x + c
        playerLoc = [3,2];
        grid = [
            [0  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ],
            [0  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ],
            [0  ,3  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ],
            [0  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ,0  ]
        ];
    }
    saveState();
}

var playerLoc;

function draw() {
    drawRect(0,0,1000,1000,"#ffffff");
    drawGrid();

    // console.log('draw loop');
    // recalling draw
    req = window.requestAnimationFrame(draw);
}

let colarr = ["#ff0000","#ffff00","#00ff00","#00ffff","#0000ff"];
// const floorCol = "#d0d0d0";

function drawGrid() {
    drawRect(0,0,1000,700,"#666666");
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            let currCell = grid[row][col];
            if (currCell >= 200) { // highlighted floor panel
                drawRect(10 + col*cellSize,10 + row*cellSize,cellSize,cellSize,"#880000");
            } else if (currCell >= 100) { // highlighted floor panel
                drawRect(10 + col*cellSize,10 + row*cellSize,cellSize,cellSize,"#ff0000");
            }
            if (currCell % 100 > 1) { // needs box
                drawBlock(10 + col*cellSize,10 + row*cellSize,currCell % 100);
            } else if (currCell % 100 == 1) { // needs wall
                drawRect(10 + col*cellSize,10 + row*cellSize,cellSize,cellSize,"#333333");
            }
            drawRect(10 + col*cellSize,10 + row*cellSize,cellSize,cellSize,"#",false);
        }
    }
    // console.log('shown grid');
    
    drawRect(10 + playerLoc[1]*cellSize,10 + playerLoc[0]*cellSize,cellSize,cellSize,"#000000");
    drawRect(10 + playerLoc[1]*cellSize,10 + playerLoc[0]*cellSize,30,30,"#ffffff");
}

function checkWin() {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] == 100) return false;
        }
    }
    if (stage == 0) {
        return arrMatch(grid[0],[202,204,205,203,104,107,112,124,112,106]);
    } else if (stage == 1) {
        return arrMatch(grid[0], [113,221,111,203,112]);
    } else if (stage == 2) {
        return arrMatch(grid[0], [202,228,204,205,103,127,104,106,0,0]);
    }
}

function arrMatch(a1, a2) {
    if (a1.length != a2.length) return false;
    for (let i = 0; i < a1.length; i++) {
        if (a1[i] != a2[i]) return false;
    }
    return true;
}

function drawBlock(x, y, type) { // any block
    drawRect(x+cellSize/8, y+cellSize/8, cellSize*3/4, cellSize*3/4, "#00ff00");
    c.beginPath();
    c.lineWidth = 1;
    if (type == 2) { // integral sign
        c.fillStyle = "#000000";
        c.lineWidth = 5;
        c.moveTo(x+2*cellSize/3,y+cellSize/6);
        // c.lineTo(x+cellSize/2,y+cellSize/4);
        // c.lineTo(x+cellSize/2,y+3*cellSize/4);
        // c.lineTo(x+cellSize/3,y+5*cellSize/6);
        c.bezierCurveTo(x,y+cellSize/3,x+cellSize,y+2*cellSize/3,x+cellSize/3,y+5*cellSize/6);
        c.stroke();
        c.closePath();
        c.lineWidth = 1;
        c.beginPath();
    } else if (type == 3) { // equals
        c.fillStyle = "#000033";
        c.rect(x+cellSize/4,y+2*cellSize/7,cellSize/2, cellSize/7);
        c.rect(x+cellSize/4,y+4*cellSize/7,cellSize/2, cellSize/7);
    } else if (type == 4) { // x
        c.fillStyle = "#222222";
        drawX(x+cellSize/5,y+cellSize/5,3*cellSize/5);
    } else if (type == 5) { // dx
        c.fillStyle = "#000000";
        c.rect(x+6*cellSize/16,y+3*cellSize/16,cellSize/16,9*cellSize/16);
        c.arc(x+3*cellSize/10,y+3*cellSize/5,cellSize/8,0,2*Math.PI);
        drawX(x+3*cellSize/8,y+5*cellSize/16,cellSize/2)
    } else if (type == 6) { // +c
        c.fillStyle = "#000000";
        c.font = (5*cellSize/8) + "px Georgia";
        c.fillText("+c", x+cellSize/8, y+5*cellSize/8);
    } else if (type == 7) { // exponent
        c.fillStyle = "#000000";
        c.font = cellSize + "px Georgia";
        c.fillText("^", x+3*cellSize/16, y+17*cellSize/16);
    } else if (type < 20) { // numbers 0-9
        c.fillStyle = "#000000";
        c.font = (7*cellSize/8) + "px Georgia";
        c.fillText(type-10, x+cellSize/4, y+5*cellSize/7);
    } else if (type == 21) { // minus
        c.fillStyle = "#000000";
        c.font = "bold " + 2*cellSize/3 + "px Georgia";
        c.fillText("-", x+6*cellSize/16, y+2*cellSize/3);
    } else if (type == 23) { // multiply
        drawX(x,y,cellSize);
    } else if (type == 24) { // divide
        c.fillStyle = "#000000";
        c.font = "bold " + 2*cellSize/3 + "px Georgia";
        c.fillText("/", x+6*cellSize/16, y+2*cellSize/3);
    } else if (type == 27) { // sin
        c.fillStyle = "#000000";
        c.font = cellSize/2 + "px Georgia";
        c.fillText("sin", x+2*cellSize/16, y+2*cellSize/3);
    } else if (type == 28) { // cos
        c.fillStyle = "#000000";
        c.font = cellSize/2 + "px Georgia";
        c.fillText("cos", x+2*cellSize/16, y+2*cellSize/3);
    }
    c.fill();
    c.closePath();
}

function drawX(x,y,size) {
    c.moveTo(x+size/8,y+size/4);
    c.lineTo(x+size/4,y+size/8);
    c.lineTo(x+size/2,y+3*size/8);
    c.lineTo(x+3*size/4,y+size/8);
    c.lineTo(x+7*size/8,y+size/4);
    c.lineTo(x+5*size/8,y+size/2);
    c.lineTo(x+7*size/8,y+3*size/4);
    c.lineTo(x+3*size/4,y+7*size/8);
    c.lineTo(x+size/2,y+5*size/8);
    c.lineTo(x+size/4,y+7*size/8);
    c.lineTo(x+size/8,y+3*size/4);
    c.lineTo(x+3*size/8,y+size/2);}


function drawRect(x, y, wdd, ltt, col, fill=true) {
    c.beginPath();
    c.fillStyle = col;
    c.rect(x,y,wdd,ltt);
    if (fill) c.fill();
    c.stroke();
    c.closePath();
}

