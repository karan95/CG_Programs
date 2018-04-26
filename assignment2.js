var xcanvas = document.getElementById('xcanvas');
var ctx = xcanvas.getContext('2d');
var scoreInfoMsg = document.getElementById('info-msg');
var wheelColorSelect = document.getElementById("wheelColor");

var radius;
var score;
var centerx = 500;
var centery = 200;
pixsize2 = 1;

var pixsize1 = 1;
var ratio;

var flag = 0;
var point1x;
var point1y;
var point2x;
var point2y;
var width;
var height;
var radius;
var sides;

var linex = [];
var liney = [];
var centerx = 500;
var centery = 200;

pixsize2 = 1;

function drawFractal() {
    ctx.clearRect(0, 0, xcanvas.width, xcanvas.height);
    point1x = parseInt(document.getElementById("pointx1").value);
    point1y = parseInt(document.getElementById("pointy1").value);
    point2x = parseInt(document.getElementById("pointx2").value);
    point2y = parseInt(document.getElementById("pointy2").value);

    linex.push(point1x);
    linex.push(point2x);
    liney.push(point1y);
    liney.push(point2y);

    drawLine1(point1x, point1y, point2x, point2y);
}

function drawLine1(pt1x, pt1y, pt2x, pt2y) {
    ctx.fillRect(pt1x, pt1y, pixsize1, pixsize1);

    var dx = pt2x - pt1x;
    var dy = pt2y - pt1y;

    var len = Math.sqrt((dx * dx) + (dy * dy));

    var cos = dx / len;
    var sin = dy / len;

    var i;
    var ptx, pty;

    for (i = 0; i < len; i++) {
        ptx = Math.round(pt1x + (i * cos));
        pty = Math.round(pt1y + (i * sin));

        ctx.fillRect(ptx, pty, pixsize1, pixsize1);
    }
}

function nextIteration() {
    ratio = parseInt(document.getElementById("ratio").value);

    ctx.clearRect(0, 0, xcanvas.width, xcanvas.height);

    var i;

    for (i = 1; i < linex.length; i++) {
        var dx = linex[i] - linex[i - 1];
        var dy = liney[i] - liney[i - 1];

        var len = Math.sqrt((dx * dx) + (dy * dy));

        var cos = dx / len;
        var sin = dy / len;

        var j, pos = i;

        for (j = 1; j < ratio; j++) {
            var tempx = Math.round(linex[i - 1] + ((len * cos) / ratio));
            var tempy = Math.round(liney[i - 1] + ((len * sin) / ratio));

            linex.splice(pos, 0, tempx);
            liney.splice(pos, 0, tempy);

            pos++;
            i++;
        }
    }

    for (i = 1; i < linex.length; i++) {
        var dx = linex[i] - linex[i - 1];
        var dy = liney[i] - liney[i - 1];
        var angle = 0;
        var pos = i;

        var length = Math.sqrt((dx * dx) + (dy * dy));

        if (flag == 0) {
            angle += Math.atan2(dy, dx) - ((60 * Math.PI) / 180);
            flag = 1;
        }
        else {
            angle += Math.atan2(dy, dx) + ((60 * Math.PI) / 180);
            flag = 0;
        }

        var tempx = Math.round(linex[i - 1] + (length * Math.cos(angle)));
        var tempy = Math.round(liney[i - 1] + (length * Math.sin(angle)));

        linex.splice(pos, 0, tempx);
        liney.splice(pos, 0, tempy);
        i++;
    }

    for (i = 1; i < linex.length; i++) {
        drawLine1(linex[i - 1], liney[i - 1], linex[i], liney[i]);
    }
}

function drawWheelShape() {
    ctx.clearRect(0, 0, xcanvas.width, xcanvas.height);
    ctx.fillStyle = wheelColorSelect.options[wheelColorSelect.selectedIndex].value;

    radius = document.getElementById("wheelRad").value;
    score = document.getElementById("driverScore").value;
    if (parseInt(score) > 0 && parseInt(radius) > 0) {
        drawWheel(centerx, centery, radius, score);
    }
    else {
        scoreInfoMsg.style.display = 'block';
    }
}

function drawWheel(x, y, r, s) {
    if (s == 100) {
        drawOval(x, y, r, r);
        drawOval(x, y, r - 30, r - 30);
    }

    else if (s > 79 && s < 100) {
        var r2 = r - ((r * (100 - s)) / 100);

        drawOval(x, y, r, r2);
        drawOval(x, y, r - 30, r2 - 30);
    }

    else {
        drawPolygon(x, y, r, s);
        drawPolygon(x, y, r - 30, s);
    }
}

function drawPolygon(x, y, r, s) {
    var a = 360 / score;

    var i;
    for (i = 45; i < 406;) {
        var x1 = x + r * Math.cos(i * Math.PI / 180);
        var y1 = y + r * Math.sin(i * Math.PI / 180);

        i += a;

        var x2 = x + r * Math.cos(i * Math.PI / 180);
        var y2 = y + r * Math.sin(i * Math.PI / 180);

        drawLine(x1, y1, x2, y2);
        drawLine(x1, y1, x2, y2);
    }

    drawInnerPart(x, y);
}

function drawOval(x, y, r1, r2) {
    var i;

    for (i = 0; i < 361;) {
        var x1 = x + r1 * Math.cos(i * Math.PI / 180);
        var y1 = y + r2 * Math.sin(i * Math.PI / 180);

        i += 0.1;
        ctx.fillRect(x1, y1, pixsize2, pixsize2);
    }
    drawInnerPart(x, y);
}

function drawInnerPart(x, y) {
    var i;

    for (i = 0; i < 361;) {
        var x1 = x + 20 * Math.cos(i * Math.PI / 180);
        var y1 = y + 20 * Math.sin(i * Math.PI / 180);

        i += 1;
        ctx.fillRect(x1, y1, pixsize2, pixsize2);
    }

    for (i = 0; i < 361;) {
        var x1 = x + 35 * Math.cos(i * Math.PI / 180);
        var y1 = y + 35 * Math.sin(i * Math.PI / 180);

        i += 72;

        var j;

        for (j = 0; j < 361; j += 5) {
            var x2 = x1 + 5 * Math.cos(j * Math.PI / 180);
            var y2 = y1 + 5 * Math.sin(j * Math.PI / 180);

            ctx.fillRect(x2, y2, pixsize2, pixsize2);
        }
    }
}

function drawLine(pt1x, pt1y, pt2x, pt2y) {
    ctx.fillRect(pt1x, pt1y, pixsize2, pixsize2);

    var dx = pt2x - pt1x;
    var dy = pt2y - pt1y;

    var length = Math.sqrt((dx * dx) + (dy * dy));

    var cos = dx / length;
    var sin = dy / length;

    var i;
    var ptx, pty;

    for (i = 0; i < length; i++) {
        ptx = Math.floor(pt1x + (i * cos));
        pty = Math.floor(pt1y + (i * sin));

        ctx.fillRect(ptx, pty, pixsize2, pixsize2);
    }
}

function clearShape() {
    scoreInfoMsg.style.display = 'none';
    ctx.clearRect(0, 0, xcanvas.width, xcanvas.height);
}