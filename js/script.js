"use strict";

const aboutContainer = document.querySelector(".about__container--01");
const aboutOverlay = document.querySelector(".about__overlay");
const aboutOverlayText = document.querySelector(".about__overlay--text");
const balls = document.querySelectorAll(".workBall");
const ballOverlay = document.querySelectorAll(".work__overlay");
const ballOverlayText = document.querySelector(".work__overlay--text");
const ballCont = document.querySelectorAll(".ball__container");
const btnAb = document.getElementById("btnAbout");
const btnAbout = document.querySelector(".btn__02");
const btnOverlay = document.querySelectorAll(".btn__overlay");
const closeBtn = document.querySelectorAll(".close");
const closeAb = document.querySelector(".closeAb");
const nav = document.querySelector(".nav");
const menu = document.getElementById("menu__hamburger");
const menuActive = document.querySelector(".menu__hamburger");
const sidebar = document.querySelector(".sidebar");
const skillBar = document.querySelectorAll(".skill__bar--fill");
const sidebarLink = document.querySelector(".nav");
const navBtn = document.querySelectorAll(".nav__btn");

//////////////////// btnAbout functionality

btnAb.addEventListener("click", () =>
	document.getElementById("section03").scrollIntoView({ behavior: "smooth" })
);

//////////////////// Sidebar Navigation
sidebarLink.addEventListener("click", function (e) {
	e.preventDefault();

	if (e.target.classList.contains("nav__btn")) {
		const id = e.target.getAttribute("href");
		document.querySelector(id).scrollIntoView({ behavior: "smooth" });
	}
});

//////////////////// Preloader
const preLoadCont = document.querySelector(".loader__container");
const preLoadAnim = document.querySelector(".loader__anim");

const preLoadAdd = function () {
	preLoadCont.classList.add("loader__container--active");
	preLoadAnim.classList.add("loader__anim--active");
};

const preLoadClose = function () {
	preLoadCont.classList.remove("loader__container--active");
	preLoadAnim.classList.remove("loader__anim--active");
};

const preLoadInit = function () {
	preLoadAdd();
	setTimeout(preLoadClose, 2500);
};

balls.forEach(function (e) {
	e.addEventListener("click", preLoadInit);
});

//////////////////// Sidebar functionality
const menuActivate = function (e) {
	sidebar.classList.toggle("sidebar__active");
	sidebar.style.transition = "all 0.5s ease";
	nav.classList.toggle("nav__active");
	menuActive.classList.toggle("menu__hamburger--active");
};

const menuMobClick = function () {
	sidebar.classList.remove("sidebar__active");
	nav.classList.remove("nav__active");
	menuActive.classList.remove("menu__hamburger--active");
};

navBtn.forEach(function (e) {
	if (window.innerWidth < 600) {
		e.addEventListener("click", menuMobClick);
	}
});

menu.addEventListener("click", menuActivate);

//////////////////// Animating the work balls

balls.forEach(function (el, i) {
	let to = {
		x:
			Math.random() *
			(i <= window.innerWidth + 500
				? -window.innerWidth / 100
				: window.innerWidth / 100),
		y:
			Math.random() *
			(i <= window.innerHeight + 500
				? -window.innerHeight / 100
				: window.innerHeight / 100),
	};

	const move = function () {
		let workSpeed = 10000;

		el.animate(
			[
				{ transform: "translate(0, 0)" },
				{ transform: `translate(${to.x}rem, ${to.y}rem)` },
				{ transform: "scale(1.25)" },
			],
			{
				duration: (Math.random() + 1) * workSpeed, // random duration
				direction: "alternate",
				fill: "both",
				iterations: Infinity,
				easing: "ease-in-out",
			}
		);
	};

	if (window.innerWidth >= 600) {
		move();
	}
});

//////////////////// Overlay functionality
ballCont.forEach(function (e) {
	e.addEventListener("click", function (el) {
		const clicked = el.target.closest(".workBall");
		if (!clicked) return;

		closeBtn.forEach(function (e) {
			e.addEventListener("click", function () {
				preLoadInit();
				document
					.querySelector(
						`.work__overlay--text-${clicked.dataset.btn}`
					)
					.classList.remove("work__overlay--text--active");
			});
		});

		document
			.querySelector(`.work__overlay--text-${clicked.dataset.btn}`)
			.classList.add("work__overlay--text--active");
	});
});

//////////////////// About Overlay

const addOverlay = function () {
	aboutOverlayText.classList.add("about__overlay--text--active");
	preLoadInit();
};

const closeOverlay = function () {
	aboutOverlayText.classList.remove("about__overlay--text--active");
	preLoadInit();
};

btnAbout.addEventListener("click", addOverlay);
closeAb.addEventListener("click", closeOverlay);

//////////////////// Resizable shape - using interactjs library
// https://interactjs.io/docs/resizable/

interact(".about__container--01").resizable({
	edges: {
		top: false,
		left: true,
		bottom: false,
		right: false,
	},
	listeners: {
		move: function (event) {
			let { x, y } = event.target.dataset;

			x = (parseFloat(x) || 0) + event.deltaRect.left;
			y = (parseFloat(y) || 0) + event.deltaRect.top;

			Object.assign(event.target.style, {
				width: `${event.rect.width}px`,
				height: `${event.rect.height}px`,
				transform: `translate(${x}px, ${y}px)`,
			});

			Object.assign(event.target.dataset, { x, y });
		},
	},
	modifiers: [
		interact.modifiers.restrictEdges({
			outer: "parent",
		}),
		interact.modifiers.restrictSize({
			min: { width: 1850 },
		}),
	],
});

//////////////////// Skill Bar
const progress = function () {
	skillBar.forEach(function (e) {
		let width = 1;
		const maxPerc = e.dataset.percent;
		const id = setInterval(frame, 10);

		function frame() {
			if (width < maxPerc) {
				width++;
				e.style.width = width + `%`;
				e.style.transition =
					"width 1s cubic-bezier(0.57, 0.09, 0.45, 0.95)";
				e.innerHTML = width + "%";
			}
		}
	});
};

aboutContainer.addEventListener("click", progress);

//////////////////// About section - rotate on scroll

const about = document.querySelector(".about");

const revealAbout = function (entries) {
	const [entry] = entries;
	const aboutConts = document.querySelectorAll(".about__container");

	if (!entry.isIntersecting) {
		return;
	} else {
		aboutConts.forEach((e) => e.classList.add("about__container--active"));
	}
};

const aboutObserver = new IntersectionObserver(revealAbout, {
	root: null,
	threshold: 0.3,
});

aboutObserver.observe(about);

//////////////////// Slider
let curSlide = 0;
const slides = document.querySelectorAll(".slider__container");
const sliderBtnLeft = document.querySelectorAll(".slider__btn--left");
const sliderBtnRight = document.querySelectorAll(".slider__btn--right");
const maxSlide = slides.length;

const goToSlide = function (slide) {
	slides.forEach(
		(s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
	);
};

// Controls functionality
const nextSlide = function (e) {
	curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;
	goToSlide(curSlide);
};
const prevSlide = function (e) {
	curSlide <= 0 ? curSlide === 0 : curSlide--;
	goToSlide(curSlide);
};

// Initialises script
const slideInit = function () {
	goToSlide(0);
};
slideInit();

// Click event for buttons
sliderBtnRight.forEach(function (e) {
	e.addEventListener("click", nextSlide);
});

sliderBtnLeft.forEach(function (e) {
	e.addEventListener("click", prevSlide);
});
