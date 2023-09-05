var cv = document.getElementById("gridgame-canvas");
var c = cv.getContext("2d");
const wdt = 20, hgt = 20, barW = 200;
const w = document.documentElement.scrollWidth-50-barW;
const h = document.documentElement.scrollHeight-document.getElementById("nav-bar").offsetHeight-50;

var grid;
const gridw = 20, gridh = 20;

const returnString = "ret;", jumpString = "jmp;";

function setup() {
    cv.width = w+barW;
    cv.height = h;

    data = [];
    for (let i = 0; i < gridw * gridh; i++) {
        data.push(new Tile(i));
    }
}

function loadImage(id) {
    return null;
}

function getData(id) {
    return null;
}

function getCommand(id) {
    return null;
}

class Tile {
    constructor(index, id) {
        this.index = index;
        this.id = id;
        this.init();
    }
    
    init() {
        this.command = getCommand(this.id);
        this.data = getData(this.id);
        this.img = loadImage(this.id);
    }

    setData(dat) {
        this.data = dat;
    }

    setID(id) {
        this.id = id;

    }
}

function rect(x, y, w, l, col) {
    c.fillstyle = col;
    c.fillRect(x,y,w,l);
}

