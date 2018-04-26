var vertices = [
    new Vertex(-1.0, -1.0, -1.0), // Front-Bottom-Left
    new Vertex(1.0, -1.0, -1.0), // Front-Bottom-Right
    new Vertex(-1.0, -1.0, 1.0), // Rear-Bottom-Left
    new Vertex(1.0, -1.0, 1.0), // Rear-Bottom-Right
    new Vertex(-1.0, 1.0, -1.0), // Front-Top-Left
    new Vertex(1.0, 1.0, -1.0), // Front-Top-Right
    new Vertex(-1.0, 1.0, 1.0), // Rear-Top-Left
    new Vertex(1.0, 1.0, 1.0)  // Rear-Top-Right
];

function Vertex(x, y, z) {
    this.x = function () {
        return x;
    };
    this.y = function () {
        return y;
    };
    this.z = function () {
        return z;
    };
}

var faces = [
    new Polygon([vertices[0], vertices[1], vertices[5], vertices[4]]), // Front
    new Polygon([vertices[2], vertices[3], vertices[7], vertices[6]]), // Rear
    new Polygon([vertices[0], vertices[1], vertices[3], vertices[2]]), // Bottom
    new Polygon([vertices[4], vertices[5], vertices[7], vertices[6]]), // Top
    new Polygon([vertices[0], vertices[2], vertices[6], vertices[4]]), // Left
    new Polygon([vertices[1], vertices[3], vertices[7], vertices[5]])  // Right
];

function Polygon(vertices) {
    this.count = function () {
        return vertices.length;
    };
    this.vertex = function (i) {
        if (i < 0) {
            throw new Error('Vertex index must be a positive integer')
        }
        if (i >= vertices.length) {
            throw new Error('Vertex index out of bounds');
        }
        return vertices[i];
    };
}

var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');

// Make the cube half the width of the canvas
var size = canvas.width / 2;

var fx = function (vertex) {
    return vertex.x() * size / 2;
};
var fy = function (vertex) {
    return vertex.y() * size / 2;
};

// Makes 0 the center of the canvas
context.translate(canvas.width / 2, canvas.height / 2);

for (var i = 0; i < faces.length; ++i) {
    drawPolygon(context, faces[i], fx, fy);
}

function drawPolygon(context, polygon, fx, fy) {
    context.beginPath();

    // The -1 * is used to flip the y coordinate as y value increases
    // as you move down the canvas.
    context.moveTo(fx(polygon.vertex(0)), -1 * fy(polygon.vertex(0)));
    for (var i = 1; i < polygon.count(); ++i) {
        context.lineTo(fx(polygon.vertex(i)), -1 * fy(polygon.vertex(i)));
    }
    context.closePath();
    context.stroke();
}