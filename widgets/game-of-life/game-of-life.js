var cv = document.getElementById("gameoflife-canvas");
var c = cv.getContext("2d");
const wdt = 20, hgt = 20, barW = 200;
const w = document.documentElement.scrollWidth-50-barW;
const h = document.documentElement.scrollHeight-document.getElementById("nav-bar").offsetHeight-50;

var board;

var iters;
var advance;
var state;
var slider;

var mouseX, mouseY;
var held;

var req;

var pauseLoc = [w + 25, h - 100, w + 75, h - 50];
var wrapLoc;

function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
}

function setup() {
    cv.width = w+barW;
    cv.height = h;
    
    board = [];
    for (let i = 0; i < hgt; i++) {
        board.push([]);
        for (let j = 0; j < hgt; j++) {
            board[i].push(0);
        }
    }

    advance = true;
    slider = false;
    wrap = false;
    held = false;

    iters = 5;
    state = 0;
    pauseLoc = [w + 25, h - 100, 50, 50];
    wrapLoc = [w + 125, h - 100, 50, 50];
    
    c.fillRect(0,0,w,h);
    c.fillStyle = "#dddddd";
    c.fillRect(w,0,barW,h);
    
    cv.addEventListener('mousemove', (evt) => {
        mouseX = evt.offsetX;
        mouseY = evt.offsetY;
        if (held && mouseX >= 0 && mouseX < w && mouseY >= 0 && mouseY < h) {
            board[clamp((mouseY/(h/hgt))|0,0,hgt)][clamp((mouseX/(w/wdt))|0,0,wdt)] = state ? 1 : 0;
        }
        if (slider) {
            iters = clamp(((mouseX-w-20)/10)|0, 1, 15);
        }
    });
    
    cv.addEventListener('mousedown', (evt) => {
        held = true;
        mouseX = evt.offsetX;
        mouseY = evt.offsetY;
        if (mouseY >= 0 && mouseY < h) {
            if (mouseX >= 0 && mouseX < w) {
                let yloc = mouseY / (h/hgt);
                let xloc = mouseX / (w/wdt);
                state = (board[yloc|0][xloc|0] == 0);
                board[yloc|0][xloc|0] = state ? 1 : 0;
            } else if (inBox(mouseX, mouseY, ...pauseLoc)) {
                advance = !advance;
            } else if (inBox(mouseX, mouseY, ...wrapLoc)) {
                wrap = !wrap;
            }
            if (inBox(mouseX, mouseY, w + 10 + 10*iters, h-135, 20, 20)) {
                slider = true;
            } else slider = false;
        }
    });

    window.addEventListener('mouseup', (evt) => {
        held = false;
        slider = false;
    });

    window.addEventListener('keydown', (evt) => {
        key = evt.key;
        keyCode = evt.code;
        console.log('key pressed',key,keyCode);
        if (key == 'p') {
            console.log('paused');
            window.cancelAnimationFrame(req);
        }
        if (key == 'r') {
            console.log('unpaused');
            req = requestAnimationFrame(draw);
        }
        if (key == ' ') {
            advance = !advance;
        }
        if (key == 'x') {
            console.log(board);
        }
        if (keyCode == 'Enter') {
            board = iterate(board);
            drawArr(board);
        }
    });
    
    console.log("setup complete");
    
    c.frameCount = 0;
    req = window.requestAnimationFrame(draw);
    console.log("init draw");
}

function draw() {
    if (advance && (c.frameCount++ % Math.round(75/iters) == 0)) {
        board = iterate(board);
    }
    c.fillStyle = "#dddddd";
    c.fillRect(w,0,barW,h);
    drawBoard(board);
    c.fillStyle = "#FFFFFF";

    // drawing pause button
    c.strokeStyle = "#000000";
    let col1, col2;
    if (inBox(mouseX, mouseY, ...pauseLoc)) {
        if (advance) {
            col1 = "#44cc55";
            col2 = "#77ff88";
        } else {
            col1 = "#ff7788";
            col2 = "#881122";
        }
    } else {
        if (advance) {
            col1 = "#22aa33";
            col2 = "#55bb66";
        } else {
            col1 = "#cc5555";
            col2 = "#881122";
        }
    }
    c.lineWidth = 2;
    c.fillStyle = col1;
    c.fillRect(...pauseLoc);
    c.strokeRect(...pauseLoc);
    c.fillStyle = col2;
    if (advance) {
        c.beginPath();
        c.lineTo(pauseLoc[0]+15, pauseLoc[1]+10);
        c.lineTo(pauseLoc[0]+15, pauseLoc[1]+40);
        c.lineTo(pauseLoc[0]+35, pauseLoc[1]+25);
        c.closePath();
        c.fill();
        c.stroke();
    } else {
        c.fillRect(pauseLoc[0]+10, pauseLoc[1]+10, 10, 30);
        c.fillRect(pauseLoc[0]+30, pauseLoc[1]+10, 10, 30);
    }

    // drawing wrap toggle
    if (inBox(mouseX, mouseY, ...wrapLoc)) {
        if (wrap) {
            col1 = "#44cc55";
            col2 = "#77ff88";
        } else {
            col1 = "#ff7788";
            col2 = "#881122";
        }
    } else {
        if (wrap) {
            col1 = "#22aa33";
            col2 = "#227722";
        } else {
            col1 = "#cc5555";
            col2 = "#881122";
        }
    }
    c.lineWidth = 1;
    c.fillStyle = col1;
    c.fillRect(...wrapLoc);
    c.strokeRect(...wrapLoc);
    c.fillStyle = col2;
    if (wrap) { // wrap symbol
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                c.fillRect(wrapLoc[0]+17+i*10, wrapLoc[1]+17+j*10, 7, 7);
                c.strokeRect(wrapLoc[0]+17+i*10, wrapLoc[1]+17+j*10, 7, 7);
            }
        }
        c.beginPath();
        c.lineTo(wrapLoc[0]+20, wrapLoc[1]+23);
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+23);
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+26);
        c.lineTo(wrapLoc[0]+20, wrapLoc[1]+26);
        // c.lineTo(wrapLoc[0]+15, wrapLoc[1]+40);
        // c.lineTo(wrapLoc[0]+35, wrapLoc[1]+25);
        c.arc(wrapLoc[0]+15, wrapLoc[1]+18, 8, Math.PI/2, Math.PI*3/2);
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+10);
        
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+7);
        c.lineTo(wrapLoc[0]+30, wrapLoc[1]+12);
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+16);
        
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+13);
        c.arc(wrapLoc[0]+15, wrapLoc[1]+18, 5, Math.PI*3/2, Math.PI/2, true);

        c.closePath();
        c.fill();
        c.stroke();
    } else { // no wrap symbol
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                c.fillRect(wrapLoc[0]+17+i*10, wrapLoc[1]+17+j*10, 7, 7);
                c.strokeRect(wrapLoc[0]+17+i*10, wrapLoc[1]+17+j*10, 7, 7);
            }
        }
        c.beginPath();
        c.lineTo(wrapLoc[0]+20, wrapLoc[1]+23);
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+23);
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+26);
        c.lineTo(wrapLoc[0]+20, wrapLoc[1]+26);
        // c.lineTo(wrapLoc[0]+15, wrapLoc[1]+40);
        // c.lineTo(wrapLoc[0]+35, wrapLoc[1]+25);
        c.arc(wrapLoc[0]+15, wrapLoc[1]+18, 8, Math.PI/2, Math.PI*3/2);
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+10);
        
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+7);
        c.lineTo(wrapLoc[0]+30, wrapLoc[1]+12);
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+16);
        
        c.lineTo(wrapLoc[0]+25, wrapLoc[1]+13);
        c.arc(wrapLoc[0]+15, wrapLoc[1]+18, 5, Math.PI*3/2, Math.PI/2, true);
        
        c.closePath();
        c.fill();
        c.stroke();
        c.fillStyle = "#ff0000";
        c.beginPath();
        c.lineTo(wrapLoc[0]+6, wrapLoc[1]+10);
        c.lineTo(wrapLoc[0]+8, wrapLoc[1]+8);
        c.lineTo(wrapLoc[0]+13, wrapLoc[1]+13);
        c.lineTo(wrapLoc[0]+18, wrapLoc[1]+8);
        c.lineTo(wrapLoc[0]+20, wrapLoc[1]+10);
        c.lineTo(wrapLoc[0]+15, wrapLoc[1]+15);
        c.lineTo(wrapLoc[0]+20, wrapLoc[1]+20);
        c.lineTo(wrapLoc[0]+18, wrapLoc[1]+22);
        c.lineTo(wrapLoc[0]+13, wrapLoc[1]+17);
        c.lineTo(wrapLoc[0]+8, wrapLoc[1]+22);
        c.lineTo(wrapLoc[0]+6, wrapLoc[1]+20);
        c.lineTo(wrapLoc[0]+11, wrapLoc[1]+15);
        c.closePath();
        c.fill();
        c.stroke();
    }

    // drawing slider
    c.fillStyle = "#cccccc";
    c.beginPath();
    c.roundRect(w+20, h-130, 160, 10, 5);
    c.closePath();
    c.fill();
    c.fillStyle = inBox(mouseX, mouseY, w + 10 + 10*iters, h-135, 20, 20) ? "#555555" : "#777777";
    c.beginPath();
    c.arc(w + 20 + 10*iters, h-125, 10, 0, Math.PI*2);    
    c.closePath();
    c.fill();

    // drawing example boxes
    c.fillStyle = "#000000";
    c.font = "15px Arial";
    c.fillText("Underpopulation", w + 45, 180);
    drawStateChange(100, [[1,0,0],[0,1,0],[0,0,0]], [[0,0,0],[0,0,0],[0,0,0]]);
    
    c.font = "15px Arial";
    c.fillText("Repopulation", w + 55, 270);
    drawStateChange(190, [[0,0,1],[0,0,1],[1,0,0]], [[0,0,0],[0,1,0],[0,0,0]]);

    c.font = "15px Arial";
    c.fillText("Overpopulation", w + 50, 360);
    drawStateChange(280, [[1,0,1],[0,1,1],[1,0,0]], [[0,0,0],[0,0,0],[0,0,0]]);

    // drawing text
    c.fillStyle = "#000000";
    c.font = "13px Arial"
    c.fillText("Pause", pauseLoc[0] + 7, pauseLoc[1] + 65);
    c.fillText("Wrapping", wrapLoc[0] - 3, wrapLoc[1] + 65);
    c.fillText(iters, w + 25 - 5*((iters/10)|0), h-140);
    c.fillText("Iterations/sec", w + 40, h-140);

    c.font = "25px Courier New";
    c.fillText("Conway's", w + 40, 50);
    c.fillText("Game of Life", w + 10, 80);

    req = window.requestAnimationFrame(draw);
}

function drawStateChange(y, arr1, arr2) {
    c.font = "30px Arial";
    c.fillText("→", w + 85, y + 37);
    c.fillStyle = "#000000";
    c.fillRect(w+15, y, 60, 60);
    c.fillRect(w+125, y, 60, 60);
    c.strokeStyle = "#ffffff";
    for (let row = 0; row < arr1.length; row++) {
        for (let col = 0; col < arr1[row].length; col++) {
            c.fillStyle = arr1[row][col] == 1 ? "#ffffff" : "#000000";
            c.fillRect(w + 15 + col*(60/arr1.length), y + row*(60/arr1[row].length), 60/arr1.length, 60/arr1[row].length);
            c.strokeRect(w + 15 + col*(60/arr1.length), y + row*(60/arr1[row].length), 60/arr1.length, 60/arr1[row].length);
        }
    }
    for (let row = 0; row < arr2.length; row++) {
        for (let col = 0; col < arr2[row].length; col++) {
            c.fillStyle = arr2[row][col] == 1 ? "#ffffff" : "#000000";
            c.fillRect(w + 125 + col*(60/arr2.length), y + row*(60/arr2[row].length), 60/arr2.length, 60/arr2[row].length);
            c.strokeRect(w + 125 + col*(60/arr2.length), y + row*(60/arr2[row].length), 60/arr2.length, 60/arr2[row].length);
        }
    }
}

function inBox(x, y, x1, y1, x2, y2, corners=false) {
    if (corners) return (x1 <= x && x <= x2 && y1 <= y && y <= y2) ? 1 : 0;
    return (x1 <= x && x <= x1+x2 && y1 <= y && y <= y1+y2) ? 1 : 0;
}

function iterate(arr) {
    let out = Array(arr.length).fill(null).map(() => Array(arr[0].length));
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            let t = 0;
            for (let k = -1; k <= 1; k++) {
                for (let l = -1; l <= 1; l++) {
                    if ((k == 0 && l == 0) || (!wrap && (i + k < 0 || i + k >= hgt || j + l < 0 || j + l >= wdt))) continue;
                    t += arr[(i+k+hgt)%hgt][(j+l+wdt)%wdt];
                }
            }
            if (t == 3) {
                out[i][j] = 1;
            } else if (t == 2) {
                out[i][j] = arr[i][j];
            } else out[i][j] = 0;
        }
    }
    return out;
}


function drawBoard(arr) {
    c.strokeStyle = "#FFFFFF";
    c.lineWidth = 1;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            c.fillStyle = (arr[i][j] ? "white" : "black");
            c.fillRect(w/hgt * j, h/wdt * i, w/hgt, h/wdt);
            c.strokeRect(w/hgt * j, h/wdt * i, w/hgt, h/wdt);
        }
    }
}

