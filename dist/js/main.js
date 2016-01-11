// Main file. Where the junk is put until I organize it.
var gameBoard = {
    height : 40,
    width: 80,
    squares: {},

    getState: function (x, y) {
        var count = 0;

        count += this.squares[(x + 1 + this.width) % this.width][(y + 1 + this.height) % this.height];
        count += this.squares[(x + 1 + this.width) % this.width][(y - 0 + this.height) % this.height];
        count += this.squares[(x + 1 + this.width) % this.width][(y - 1 + this.height) % this.height];

        count += this.squares[(x - 0 + this.width) % this.width][(y + 1 + this.height) % this.height];
        count += this.squares[(x - 0 + this.width) % this.width][(y - 1 + this.height) % this.height];

        count += this.squares[(x - 1 + this.width) % this.width][(y + 1 + this.height) % this.height];
        count += this.squares[(x - 1 + this.width) % this.width][(y - 0 + this.height) % this.height];
        count += this.squares[(x - 1 + this.width) % this.width][(y - 1 + this.height) % this.height];

        if (count === 3 || (this.squares[x][y] && count === 2)) {
            return 1;
        }

        return 0;
    },

    step : function() {
        var newBoard = this.getEmptyBoard(this.width, this.height);
        for (var i = 0; i < this.width; i += 1) {
            for (var j = 0; j < this.height; j += 1) {
                newBoard[i][j] = this.getState(i, j);
            }
        }
        this.squares = newBoard;
    },

    getEmptyBoard : function (sizeX, sizeY) {
        var newBoard = new Array(sizeX);
        for (var i = 0; i < sizeX; i += 1) {
            newBoard[i] = new Array(sizeY);
            for (var j = 0; j < sizeY; j += 1) {
                newBoard[i][j] = 0;
            }
        }
        return newBoard;
    },

    clear : function () {
        this.squares = this.getEmptyBoard(this.width, this.height);
    },

    toggle : function (x, y) {

        if (this.squares) {
            if (this.squares[x][y] === 0) {
                this.squares[x][y] = 1;
            } else {
                this.squares[x][y] = 0;
            }
        }
    },

    resize : function (newWidth, newHeight) {
        var newBoard = this.getEmptyBoard(newWidth, newHeight);
        if (this.squares !== {}) {
            for (var i = 0; i < newWidth && i < this.width; i += 1) {
                for (var j = 0; j < newHeight && j < this.height; j += 1) {
                    newBoard[i][j] = this.squares[i][j];
                }
            }
        }
        this.squares = newBoard;
        this.width = newWidth;
        this.height = newHeight;
    }

};

var size = 20;

var running = 0;

var timer;
var freq = 100;


var fps = {
    startTime : 0,
    frameNumber : 0,
    getFPS : function() {
        this.frameNumber++;
        var d = new Date().getTime();
        var currentTime = (d - this.startTime) / 1000;
        var result = Math.floor((this.frameNumber / currentTime));

        if (currentTime > 1) {
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;

    }
};

$('#Start').click(function () {
    running = !running;
    if (running) {
        $('#Start').prop('value', 'Stop');
    } else {
        $('#Start').prop('value', 'Start');
    }
});

$('#Rand').click(function() {
    for (var i = 0; i < 1000 / size; i += 1) {
        var x = Math.floor(Math.random() * gameBoard.width);
        var y = Math.floor(Math.random() * gameBoard.height);
        gameBoard.squares[x][y] = 1;
    }
});

function drawBoard() {
    var Board = $('#GameBoard');
    var context = Board[0].getContext('2d');
    var i;

    context.clearRect(0, 0, gameBoard.width * size, gameBoard.height * size);

    context.strokeStyle = 'grey';
    context.beginPath();
    if (size > 4) {
        for (i = 0; i <= gameBoard.width; i += 1) {
            context.moveTo(i * size, 0);
            context.lineTo(i * size, gameBoard.height * size);
        }
        for (i = 0; i <= gameBoard.height; i += 1) {
            context.moveTo(0, i * size);
            context.lineTo(gameBoard.width * size, i * size);
        }
    } else {
        context.moveTo(0, 0);
        context.lineTo(gameBoard.width * size, 0);
        context.lineTo(gameBoard.width * size, gameBoard.height * size);
        context.lineTo(0, gameBoard.height * size);
        context.closePath();
    }
    context.stroke();

    context.fillStyle = 'black';
    for (i = 0; i < gameBoard.width; i += 1) {
        for (var j = 0; j < gameBoard.height; j += 1) {
            context.beginPath();
            if (gameBoard.squares[i][j] === 1) {
                context.fillRect(i * size, j * size, size, size);
            }
        }
    }

    $('#FPSvalue').html(fps.getFPS());
}

$('#cellSize').change(function () {
    console.log('Change cell size ' + this.value);

    size = this.value;
    var width = Math.floor(1500.0 / size);
    var height = Math.floor(1000.0 / size);

    console.log('new size = ' + width + ' ' + height);
    gameBoard.resize(width, height);

});

$('#GameBoard').click(function (e) {
    var x = Math.floor(e.offsetX / size);
    var y = Math.floor(e.offsetY / size);

    gameBoard.toggle(x, y);
});

$('#Step').click(function () {
    gameBoard.step();
});

function tick() {
    timer = setTimeout(tick, 1000.0 / freq);
    if (running) {
        gameBoard.step();
    }
    drawBoard();
}

function clearBoard() {
    var width = Math.floor(1500.0 / size);
    var height = Math.floor(1000.0 / size);

    console.log('new size = ' + width + ' ' + height);
    gameBoard.clear();
    gameBoard.resize(width, height);
    tick();
}

window.onload = clearBoard;

