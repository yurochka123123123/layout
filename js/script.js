document.addEventListener('DOMContentLoaded', function(){

	const buttonSly = document.querySelector('.my-example__list-button');

	const compWidth = document.querySelector('.my-example__image');
	const compMargin = document.querySelector('.my-example__item');

	const imageCount = document.querySelector('.my-example__list-slide-image');
	const imageLength = imageCount.children.length;
	
	let fotoCount, wResize, mResize;

	let width = '', animalEnd = true;

	function changeWidth() {
		imageCount.style.left = '0';
		buttonSly.innerHTML = '';
		for (let i = 0; i < Math.ceil(imageLength / fotoCount); i++) {
			buttonSly.innerHTML = buttonSly.innerHTML +'<li><button class="buttons"></button></li>';
			if (i === 0) {
				buttonSly.children[0].children[0].style.backgroundColor = '#ff4e2e';
			};
		};
	};

	function onResize() {
		const imageLineWidth = document.querySelector('.my-example__over-slide');
		const lineWidth = window.getComputedStyle(imageLineWidth).width;
		if (lineWidth != width) {
			wResize = parseInt(window.getComputedStyle(compWidth).width.replace('px', ''));
			mResize = parseInt(window.getComputedStyle(compMargin).marginRight.replace('px', ''));
			fotoCount = (parseInt(lineWidth.replace('px', '')) + mResize) / (wResize + mResize);
			imageCount.style.width = ((wResize + mResize) * imageLength) + 'px';
			changeWidth();
			width = lineWidth;
		};
	};

	onResize();
	window.addEventListener('resize', onResize);

	function setButtonLst(setbtn) {
		if (setbtn) {
			const but = Math.ceil((parseInt(parseInt(imageCount.style.left.replace('px', '')) * (-1)) / (wResize + mResize) / fotoCount));
			const allButon = document.querySelectorAll('.my-example__list-button button');
			for( let i = 0; i < allButon.length; i++) {
				if (i === but) { allButon[i].style.backgroundColor = '#ff4e2e'; } else { allButon[i].style.backgroundColor = '#dbdbdb'; };
			};
		};	
	};

	function animate(options) {
		animalEnd = false;
		const start = performance.now();
		requestAnimationFrame(function animate(time) {
			let timeFraction = (time - start) / options.duration;
			if (timeFraction > 1) {
				timeFraction = 1; 
				animalEnd = true;
				setButtonLst(options.setbtn);
			};
			const progress = options.timing(timeFraction);
	    	options.draw(progress);
			if (timeFraction < 1) {
				requestAnimationFrame(animate);
			};
		});
	};

	function makeEaseOut(timing) {
    	return function(timeFraction) {
    		return 1 - timing(1 - timeFraction);
    	};
    };

	function circ(timeFraction) { return  1 - Math.sin(Math.acos(timeFraction)) };

	function back(timeFraction) { return Math.pow(timeFraction, 2) * ((1.5 + 1) * timeFraction - 1.5) };

	buttonSly.addEventListener('click', function(ev) {
		if (ev.target.tagName === 'BUTTON') {
			ev.preventDefault();
			const elem = ev.target;
			const list = buttonSly.children;
			for (let i = 0; i < list.length; i++) {
				if (list[i] === elem.parentElement) {
					const allButon = document.querySelectorAll('.my-example__list-button button');
					for( let i = 0; i < allButon.length; i++) {
						allButon[i].style.backgroundColor = '#dbdbdb';
					};
					elem.style.backgroundColor = '#ff4e2e';
					const imgWidth = document.querySelector('.my-example__image');
					const intWidth = parseInt(window.getComputedStyle(imgWidth).width.replace('px', ''));
					const marginRight = document.querySelector('.my-example__item');
					const intMargin = parseInt(window.getComputedStyle(marginRight).marginRight.replace('px', ''));
					const visibleWidth = fotoCount * (intWidth + intMargin);
					let styleInt = -i * visibleWidth; 
					const incomplete = parseInt(imageCount.style.width.replace('px', '')) + styleInt;
					if (incomplete < visibleWidth) {
						styleInt += visibleWidth - incomplete;
					};
					const left = parseInt(imageCount.style.left.replace('px', ''));
					const bounceEaseOut = makeEaseOut(back);
		 			animate({
		 				setbtn: false,
				    	duration: 800,          
				    	timing: bounceEaseOut,
				    	draw: function(progress) {
				    		imageCount.style.left =  left +  progress * (styleInt - left )  + 'px';
				    	}
			    	});
					break;
				};
			};
		};
	});

	function slideStart(i) {
		if (animalEnd) {
			const storWdh = parseInt(imageCount.style.width.replace('px', '')) - (wResize + mResize) * fotoCount;
			const step = parseInt(imageCount.style.left.replace('px', '')) - (wResize + mResize) * i;
			console.log(step,', ',storWdh);
			if (step < 1 && step > -storWdh - 1){
				//imageCount.style.left = step + 'px';
				const left = parseInt(imageCount.style.left.replace('px', ''));
				const bounceEaseOut = makeEaseOut(circ);
	 			animate({
	 				setbtn: true,
			    	duration: 400,          
			    	timing: bounceEaseOut,
			    	draw: function(progress) {
			    		imageCount.style.left = left + progress * -(wResize + mResize) * i + 'px';
			    	}
		    	});
			};
		};
	};

	document.querySelector('.my-example__left-slide-button').addEventListener('click', function(){
		slideStart(1);
	});

	document.querySelector('.my-example__right-slide-button').addEventListener('click', function(){
		slideStart(-1);
	});

	let initialPoint;
	let finalPoint;

	imageCount.addEventListener('touchstart', function(event) {
		event.preventDefault();
		event.stopPropagation();
		initialPoint = event.changedTouches[0];
	}, false);

	imageCount.addEventListener('touchend', function(event) {
		event.preventDefault();
		event.stopPropagation();
		finalPoint = event.changedTouches[0];
		let xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
		var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
		if (xAbs > 20 || yAbs > 20) {
			if (xAbs > yAbs) { 
				if (finalPoint.pageX < initialPoint.pageX){ slideStart(1) } else { slideStart(-1) }
			};
		};
	}, false);

	const menu = document.querySelector('.menu-cover');

	function onClose(ev){
		if (ev.target.tagName === 'A') {
			menu.removeAttribute('style');
			document.body.removeAttribute('style');
		};
	};

	function removeMenu() {
		menu.removeAttribute('style');
		document.body.removeAttribute('style');
	
	};

	function showMenu() {
		menu.style.display = 'block';
		document.body.style.position = 'fixed';
		document.body.style.width = '100%';
		document.body.style.overflow = 'hidden';

	};

	document.querySelector('.page-header__menu-img').addEventListener('click', showMenu);

	document.querySelector('.menu-cover__list').addEventListener('click', onClose);
    
	document.querySelector('.menu-cover__close').addEventListener('click', removeMenu);

});

window.addEventListener('load', function(){
	setTimeout(function(){
		const elementHeader = document.querySelectorAll('.page-header__element');
		for (let i = 0; i < elementHeader.length; i++) {
			elementHeader[i].classList.remove('page-header__element_default');
		};
	}, 1000);
});
