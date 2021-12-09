"use strict";

//////////////////// Canvas drawing
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dist = 60;
const minRad = 40;
const radFilter01 = 700; //controls colour spread
const radFilter02 = 275; //controls highlight
const rad = 70;
let num;
canvas.width < 600 ? (num = 0) : (num = 20);
const growSpeed = 1.1;
const speed = 1.5;
const maxRadius = rad + 50;
const colorArray = ["#26495c", "#c66b3d", "#c4a35a"];

// const colorArray = ["#26495c", "#c66b3d", "#c4a35a"];
// #ef9d10, #3b4d61  and #6b7b8c

// /////////////////// Interacting with the canvas
// Works by comparing the distance between the mouse and the circles
const mouse = {
	x: undefined,
	y: undefined,
};

// Executes the function whenever the mouseover event occurs - In order for the balls to grow and shrink when we hover near/over them, we need to get the distance between the mouse and the balls
window.addEventListener("mousemove", function (e) {
	// console.log(e);
	mouse.x = e.x;
	mouse.y = e.y;
});

// ////////////////// Drawing and Animating multiple circles
// // This function is responsible for creating each individual circle. Essentially, this function continues to draw circles all the way across to the new coordinates

function Circle(x, y, dx, dy, radius) {
	//   toString(radix)
	//   The radix parameter is used to specify which numeral system to be used, for example, a radix of 16 (hexadecimal) indicates that the number in the string should be parsed from a hexadecimal number to a decimal number.
	//   let randomColour = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.colour = colorArray[Math.floor(Math.random() * colorArray.length)];

	let gradient = context.createRadialGradient(
		x,
		y,
		radFilter01,
		x + 20,
		y + 20,
		radFilter02
	);
	gradient.addColorStop(0.3, this.colour);
	gradient.addColorStop(1, "#fffcf4");

	//////////// 	Draws the circle
	this.draw = function () {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		context.fillStyle = gradient;
		context.strokeStyle = gradient;

		context.fill("evenodd");
		context.stroke();
	};

	//////////// 	Moves the circle - i.e. draws the next circle to the new random coordinates
	this.update = function () {
		// 	Bouncing the circle off the edges
		if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
			this.dx = -this.dx;
		}
		if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
			this.dy = -this.dy;
		}

		//     This controls the speed at which the balls are moving
		this.x += this.dx;
		this.y += this.dy;

		////////////     Interactivity - measuring the distance between the mouse and each individual circle coordinates. If any circle is within 60px distance of the mouse, increase the circle radius by 1
		if (
			mouse.x - this.x < dist &&
			mouse.x - this.x > -dist &&
			mouse.y - this.y < dist &&
			mouse.y - this.y > -dist
		) {
			this.radius < maxRadius ? (this.radius += growSpeed) : this.radius;
			// this.radius += 1;
		} else if (this.radius > radius) {
			this.radius -= growSpeed;
		}

		this.draw();
	};
}

//////////// Drawing multiple circles - You want to draw a circle and then store it in an array to be called later
let circleArray = [];
const drawCircle = function (rad, num, speed) {
	for (let i = 0; i < num; i++) {
		let radius =
			Math.random() * Math.floor(Math.random() * rad) +
			minRad +
			growSpeed;
		let x = Math.random() * (window.innerWidth - radius * 2) + radius;
		let y = Math.random() * (window.innerHeight - radius * 2) + radius;
		let dx = (Math.random() - 0.5) * speed;
		let dy = (Math.random() - 0.5) * speed;

		circleArray.push(new Circle(x, y, dx, dy, radius));
	}
};
drawCircle(rad, num, speed);

const animate = function () {
	requestAnimationFrame(animate);
	// 	Need to make sure the canvas is cleared each time before the new circle is drawn
	context.clearRect(0, 0, innerWidth, innerHeight);
	// Creating animation functionality
	circleArray.forEach((i) => i.update());
};
animate();
