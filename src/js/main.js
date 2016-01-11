
var squares;
var height = 40;
var width = 80;
var size = 20;

var running = 0;

var timer;
var freq = 100;

window.onload = clearBoard;

function clearBoard() {
    squares = genBoard();
    tick();
};

var fps = {
    startTime : 0,
    frameNumber : 0,
    getFPS : function(){
        this.frameNumber++;
        var d = new Date().getTime(),
            currentTime = ( d - this.startTime ) / 1000,
            result = Math.floor( ( this.frameNumber / currentTime ) );

        if( currentTime > 1 ){
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;

    }
};

$("#Start").click(function () {
    running = !running;
    if (running) {
        $("#Start").prop('value',"Stop");
    } else {
        $("#Start").prop('value',"Start");
    }
});

$("#Rand").click(function() {
    for (var i = 0; i < 50; i += 1) {
        var x = Math.floor(Math.random() * width);
        var y = Math.floor(Math.random() * height);
        squares[x][y] = 1;
    }
});


function tick() {
    timer = setTimeout(tick, 1000.0/freq);
    if (running) {
        squares = nextBoard(squares);
    }
    drawBoard();
};

function genBoard() {
    var newBoard = new Array(width);
    for (var i = 0; i < width; i += 1) {
        newBoard[i] = new Array(height);
        for (var j = 0; j < height; j += 1) {
            newBoard[i][j] = 0;
        }
    }
    return newBoard;
};

function drawBoard() {
    var Board = $("#GameBoard");
    var context = Board[0].getContext('2d');

    context.clearRect(0,0,width*size,height*size);

    context.strokeStyle = 'grey';
    context.beginPath();
    for (var i = 0; i <= width; i += 1) {
        context.moveTo(i * size, 0);
        context.lineTo(i * size, height * size);
    }
    for (var i = 0; i <= height; i += 1) {
        context.moveTo(0, i * size);
        context.lineTo(width * size, i * size);
    }
    context.stroke();

    context.fillStyle = 'black';
    for (var i = 0; i < width; i += 1) {
        for (var j = 0; j < height; j += 1) {
            context.beginPath();
            if (squares[i][j] == 1) {
                context.fillRect(i * size, j * size, size, size);
            }
        }
    }

    $("#FPSvalue").html(fps.getFPS());
};

function getState(x,y,board) {
    var count = 0;

    count += board[(x + 1 + width)%width][(y + 1 + height)%height];
    count += board[(x + 1 + width)%width][(y - 0 + height)%height];
    count += board[(x + 1 + width)%width][(y - 1 + height)%height];

    count += board[(x - 0 + width)%width][(y + 1 + height)%height];
    count += board[(x - 0 + width)%width][(y - 1 + height)%height];

    count += board[(x - 1 + width)%width][(y + 1 + height)%height];
    count += board[(x - 1 + width)%width][(y - 0 + height)%height];
    count += board[(x - 1 + width)%width][(y - 1 + height)%height];

    if (count == 3 || (board[x][y] && count == 2)) {
        return 1;
    }

    return 0;
};

function nextBoard(currentBoard) {
    var newBoard = genBoard();
    for (var i = 0; i < width; i += 1) {
        for (var j = 0; j < height; j += 1) {

            newBoard[i][j] = getState(i,j,currentBoard);

        }
    }

    return newBoard;
};

$("#GameBoard").click(function (e) {
    var x = Math.floor(e.offsetX/size);
    var y = Math.floor(e.offsetY/size);

    if (squares) {
        if (squares[x][y] == 0) {
            squares[x][y] = 1;
        } else {
            squares[x][y] = 0;
        }
    }

});

$("#Step").click(function (e) {
    squares = nextBoard(squares);
});


