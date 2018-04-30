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

Vertex.transform = function(vertex, matrix) {
	return Vertex.fromVec3(
		matrix.multiply(
			Vertex.toVec3(vertex)
		)
	);
};

Vertex.toVec3 = function(vertex) {
	return new Vec3([vertex.x(), vertex.y(), vertex.z()]);
};

Vertex.fromVec3 = function(vector) {
	return new Vertex(vector.element(0), vector.element(1), vector.element(2));
};

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
	context.moveTo(fx(polygon.vertex(0)), -1 * fy(polygon.vertex(0)));
	for (var i = 1; i < polygon.count(); ++i) {
		context.lineTo(fx(polygon.vertex(i)), -1 * fy(polygon.vertex(i)));
	}
	context.closePath();
	context.stroke();
}

function drawPolygon2(context, polygon, matrix, fx, fy) {
	context.beginPath();
	var vertex = Vertex.transform(polygon.vertex(0), matrix);
	context.moveTo(fx(vertex), -1 * fy(vertex));
	for (var i = 1; i < polygon.count(); ++i) {
		vertex = Vertex.transform(polygon.vertex(i), matrix);
		context.lineTo(fx(vertex), -1 * fy(vertex));
	}
	context.closePath();
	context.stroke();
}

function drawAxisIndicator(context, matrix) {

	context.save();

	context.textBaseline = 'middle';
	context.textAlign = 'center';

	context.strokeStyle = '#F06';
	context.fillStyle = '#F06';

	var x = new Vec3([30.0, 0.0, 0.0]).multiply(matrix);
	context.fillText('X', x.element(0), -1 * x.element(1));
	drawLineFromVectors(
		context,
		new Vec3([0.0, 0.0, 0.0]).multiply(matrix),
		new Vec3([20.0, 0.0, 0.0]).multiply(matrix)
	);

	context.strokeStyle = '#F90';
	context.fillStyle = '#F90';

	var y = new Vec3([0.0, 30.0, 0.0]).multiply(matrix);
	context.fillText('Y', y.element(0), -1 * y.element(1));
	drawLineFromVectors(
		context,
		new Vec3([0.0, 0.0, 0.0]).multiply(matrix),
		new Vec3([0.0, 20.0, 0.0]).multiply(matrix)
	);

	context.strokeStyle = '#09C';
	context.fillStyle = '#09C';

	var z = new Vec3([0.0, 0.0, 30.0]).multiply(matrix);
	context.fillText('Z', z.element(0), -1 * z.element(1));
	drawLineFromVectors(
		context,
		new Vec3([0.0, 0.0, 0.0]).multiply(matrix),
		new Vec3([0.0, 0.0, 20.0]).multiply(matrix)
	);

	context.restore();

}

function drawLineFromVectors(context, a, b) {
	context.beginPath();
	context.moveTo(a.element(0), -1 * a.element(1));
	context.lineTo(b.element(0), -1 * b.element(1));
	context.stroke();
}


var modelVerts = [
	new Vertex(-1.0, -1.0, -1.0), // 0 FBL
	new Vertex( 1.0, -1.0, -1.0), // 1 FBR

	new Vertex(-1.0, -1.0,  1.0), // 2 RBL
	new Vertex( 1.0, -1.0,  1.0), // 3 RBR
	
	new Vertex(-1.0,  1.0, -1.0), // 4 FTL
	new Vertex( 1.0,  1.0, -1.0), // 5 FTR

	new Vertex(-1.0,  1.0,  1.0), // 6 RTL
	new Vertex( 1.0,  1.0,  1.0)  // 7 RTR
];

var modelPolygons = [
	new Polygon([
		modelVerts[0],
		modelVerts[1],
		modelVerts[5],
		modelVerts[4]
	]), // FRONT
	new Polygon([
		modelVerts[2],
		modelVerts[3],
		modelVerts[7],
		modelVerts[6]
	]), // REAR
	new Polygon([
		modelVerts[0],
		modelVerts[1],
		modelVerts[3],
		modelVerts[2]
	]), // BOTTOM
	new Polygon([
		modelVerts[4],
		modelVerts[5],
		modelVerts[7],
		modelVerts[6]
	]), // TOP
	new Polygon([
		modelVerts[0],
		modelVerts[2],
		modelVerts[6],
		modelVerts[4]
	]), // LEFT
	new Polygon([
		modelVerts[1],
		modelVerts[3],
		modelVerts[7],
		modelVerts[5]
	])  // RIGHT
];

var oblique = {
	gx: function(scale, zc) {
		return function(vertex) {
			return (vertex.x() + vertex.z() * zc) * scale;
		};
	},

	gy: function(scale, zc) {
		return function(vertex) {
			return (vertex.y() + vertex.z() * zc) * scale;
		};
	}
};

var isometric = {
	gx: function(scale, c) {
		return function(vertex) {
			return (vertex.x() * c + vertex.z() * c) * scale;
		};
	},

	gy: function(scale, c) {
		return function(vertex) {
			return (vertex.y() + vertex.z() * c - vertex.x() * c) * scale;
		};
	}
};

var loop = {
	fns: [],
	start: function() {
		var fns = this.fns;
		var step = function() {
			for (var i = 0; i < fns.length; ++i) {
				fns[i]();
			}
			window.requestAnimationFrame(step);
		};
		window.requestAnimationFrame(step);
	}
};

function Vec3(elements) {

	if (elements.length !== 3) {
		throw new Error('Vec3 must have 3 elements');
	}

	this.element = function(i) {

		if (i < 0 || i > 2) {
			throw new Error('i must be in the range 0 - 2');
		}

		return elements[i];
	};

	this.multiply = function(matrix) {

		if (!(matrix instanceof Mat3)) {
			throw new Error('matrix must be a Mat3');
		}

		return matrix.multiply(this);
	}
}


function Mat3(elements) {

	if (elements.length !== 9) {
		throw new Error('Mat3 must have 9 elements');
	}

	this.element = function(x, y) {

		if (x < 0 || x > 2) {
			throw new Error('x must be in the range 0 -2');
		}

		if (y < 0 || y > 2) {
			throw new Error('y must be in the range 0 - 2');
		}

		return elements[y * 3 + x];

	};

	this.multiply = function(other) {

		if (!(other instanceof Vec3)
				&& !(other instanceof Mat3)) {
			throw new Error('vector must be either a Vec3 or Mat3');
		}

		if (other instanceof Vec3) {

			var elements = [];
			for (var y = 0; y < 3; ++y) {
				var sum = 0;
				for (var x = 0; x < 3; ++x) {
					sum += other.element(x) * this.element(x, y);
				}
				elements.push(sum);
			}

			return new Vec3(elements);
		} else {

			var elements = [];
			for (var z = 0; z < 3; ++z) {
				for (var y = 0; y < 3; ++y) {
					var sum = 0;
					for (var x = 0; x < 3; ++x) {
						sum += other.element(y, x) * this.element(x, z);
					}
					elements.push(sum);
				}
			}

			return new Mat3(elements);
		}
	};
}

Mat3.identity = function() {
	return new Mat3([
		1.0, 0.0, 0.0,
		0.0, 1.0, 0.0,
		0.0, 0.0, 1.0
	]);
}

Mat3.rotationX = function(angle) {
	var a = Math.cos(angle);
	var b = Math.sin(angle);
	return new Mat3([
		1.0, 0.0, 0.0,
		0.0,   a,  -b,
		0.0,   b,   a,
	]);
};

Mat3.rotationY = function(angle) {
	var a = Math.cos(angle);
	var b = Math.sin(angle);
	return new Mat3([
		  a, 0.0,   b,
		0.0, 1.0, 0.0,
		 -b, 0.0,   a,
	]);
};


Mat3.rotationZ = function(angle) {
	var a = Math.cos(angle);
	var b = Math.sin(angle);
	return new Mat3([
		  a,  -b, 0.0,
		  b,   a, 0.0,
		0.0, 0.0, 1.0,
	]);
};

Mat3.isometric = function(angle) {
	var a = Math.cos(angle);
	var b = Math.sin(angle);
	return new Mat3([
		 a, 0, a,
		-b, 1, b,
		 0, 0, 0
	]);
};


(function() {
			
	var canvas = document.getElementById('canvas-2');
	var context = canvas.getContext('2d');

	canvas.width = 640;
	canvas.height = 240;

	context.translate(canvas.width / 2, canvas.height / 2); // 0 should be in the centre
	context.strokeStyle = '#222222';

	var modelSize = canvas.width / 4;
	var scale = modelSize / 2;
	var c = 0.2;
	var fx = oblique.gx(scale, c);
	var fy = oblique.gy(scale, c);

	for (var i = 0; i < modelPolygons.length; ++i) {
		drawPolygon(context, modelPolygons[i], fx, fy);
	}

}) ();

(function() {

	var canvas = document.getElementById('canvas-3');
	var context = canvas.getContext('2d');

	canvas.width = 640;
	canvas.height = 320;

	context.translate(canvas.width / 2, canvas.height / 2); // 0 should be in the centre
	context.strokeStyle = '#222222';

	var modelSize = canvas.width / 4;
	var scale = modelSize / 2;
	var angle = Math.PI / 6; // 30 degrees
	var a = Math.cos(angle);
	var b = Math.sin(angle);
	var fx = oblique.gx(scale, a);
	var fy = oblique.gy(scale, b);

	for (var i = 0; i < modelPolygons.length; ++i) {
		drawPolygon(context, modelPolygons[i], fx, fy);
	}

}) ();

(function() {

	var canvas = document.getElementById('canvas-4');
	var context = canvas.getContext('2d');

	canvas.width = 640;
	canvas.height = 240;

	context.translate(canvas.width / 2, canvas.height / 2); // 0 should be in the centre
	context.strokeStyle = '#222222';

	var modelSize = canvas.width / 4;
	var scale = modelSize / 2;
	var angle = Math.PI / 6; // 30 degrees
	var a = Math.cos(angle) / 2;
	var b = Math.sin(angle) / 2;
	var fx = oblique.gx(scale, a);
	var fy = oblique.gy(scale, b);

	for (var i = 0; i < modelPolygons.length; ++i) {
		drawPolygon(context, modelPolygons[i], fx, fy);
	}

}) ();

(function() {

	var canvas = document.getElementById('canvas-5');
	var context = canvas.getContext('2d');

	canvas.width = 640;
	canvas.height = 320;

	context.translate(canvas.width / 2, canvas.height / 2); // 0 should be in the centre
	context.strokeStyle = '#222222';

	var modelSize = canvas.width / 4;
	var scale = modelSize / 2;
	var angle = Math.PI / 6; // 30 degrees
	var a = Math.cos(angle);
	var b = Math.sin(angle);

	var fx = isometric.gx(scale, a);
	var fy = isometric.gy(scale, b);

	for (var i = 0; i < modelPolygons.length; ++i) {
		drawPolygon(context, modelPolygons[i], fx, fy);
	}

}) ();

(function() {

	var canvas = document.getElementById('canvas-6');
	var context = canvas.getContext('2d');

	canvas.width = 640;
	canvas.height = 240;

	context.translate(canvas.width / 2, canvas.height / 2); // 0 should be in the centre
	context.strokeStyle = '#222222';

	var modelSize = canvas.width / 4;
	var scale = modelSize / 2;
	var step = 0;

	loop.fns.push(function() {
		context.clearRect(- canvas.width / 2, - canvas.height / 2, canvas.width, canvas.height);
		var transform = Mat3.rotationX(Math.PI * step++ / 128);

		var fx = function(vertex) {
			return vertex.x() * scale;
		};

		var fy = function(vertex) {
			return vertex.y() * scale;
		};

		drawAxisIndicator(context, transform);

		for (var i = 0; i < modelPolygons.length; ++i) {
			drawPolygon2(context, modelPolygons[i], transform, fx, fy);
		}
	});

}) ();

(function() {

	var canvas = document.getElementById('canvas-7');
	var context = canvas.getContext('2d');

	canvas.width = 640;
	canvas.height = 240;

	context.translate(canvas.width / 2, canvas.height / 2); // 0 should be in the centre
	context.strokeStyle = '#222222';

	var modelSize = canvas.width / 4;
	var scale = modelSize / 2;
	var step = 0;

	loop.fns.push(function() {
		context.clearRect(- canvas.width / 2, - canvas.height / 2, canvas.width, canvas.height);
		var transform = Mat3.rotationY(Math.PI * step++ / 128);

		var fx = function(vertex) {
			return vertex.x() * scale;
		};

		var fy = function(vertex) {
			return vertex.y() * scale;
		};

		drawAxisIndicator(context, transform);

		for (var i = 0; i < modelPolygons.length; ++i) {
			drawPolygon2(context, modelPolygons[i], transform, fx, fy);
		}
	});

}) ();

(function() {

	var canvas = document.getElementById('canvas-8');
	var context = canvas.getContext('2d');

	canvas.width = 640;
	canvas.height = 240;

	context.translate(canvas.width / 2, canvas.height / 2); // 0 should be in the centre
	context.strokeStyle = '#222222';

	var modelSize = canvas.width / 4;
	var scale = modelSize / 2;
	var step = 0;

	loop.fns.push(function() {
		context.clearRect(- canvas.width / 2, - canvas.height / 2, canvas.width, canvas.height);
		var transform = Mat3.rotationZ(Math.PI * step++ / 128);

		var fx = function(vertex) {
			return vertex.x() * scale;
		};

		var fy = function(vertex) {
			return vertex.y() * scale;
		};

		drawAxisIndicator(context, transform);

		for (var i = 0; i < modelPolygons.length; ++i) {
			drawPolygon2(context, modelPolygons[i], transform, fx, fy);
		}
	});

}) ();
loop.start();