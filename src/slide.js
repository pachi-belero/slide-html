/* This file is only used during the build process; its content is inserted in the html file */

/* Disable the previous advance-on-click behaviour */
/* NOTE: change below to CLICK_NEXT=1 to restore the default advance-on-click behaviour... */
var CLICK_NEXT = 0;
var INDENT_RE = /^(?:( )+|\t+)/;
var currentSlide = -1;

function trimIndent(s) {
	// The first ocurrence (in <pre id="slide">) of a set of spaces or tabs (at the beginning of a line) is the indent expected everywhere
	var indent = (s.match(INDENT_RE)||[''])[0].length;
	if (indent > 0) {
		var trim = '^' + s.substring(0, indent);
		return s.replace(new RegExp(trim, 'mg'), '');
	} else {
		return s;
	}
}

function renderSlide(root, slide, index) {
	var lines = slide.split('\n');
	var emSpanStart = -1;
	var slideWrapper = document.createElement('div');
	var slideContent = document.createElement('div');
	var html = '';
	slideWrapper.className = 'slide slide-'+index;
	slideContent.className = 'slide-content';
	for (var i = 0 ; i < lines.length; i++) {
		var line = lines[i];
		if (line.startsWith('#')) {
			// Add header
			if (line.startsWith('##')) {
				html = html + '<h2>' + line.substring(2).trim() + '</h2>';
			} else {
				html = html + '<h1>' + line.substring(1).trim() + '</h1>';
			}
		} else if (line.startsWith('`') || line.startsWith('\t') || line.startsWith('  ')) {
			// Add code
			var subs;
			if (line.startsWith('  ')) {
				subs = line.substring(2);
			} else {
				subs = line.substring(1);
			}
			if (subs.length == 0) {
				// Ensure at least one space inside the <pre> element
				subs = ' ';
			}
			html = html + '<pre>' + subs + '</pre>';
		} else if (line.startsWith('@NOSELECT@')) {
				// Disable text selection in this slide
				slideWrapper.className += ' noselect';
		} else if (line.startsWith('!')) {
				// Add image
				html = html + '<img src="' + line.substring(1).trim() + '" />';
		} else if (line.startsWith(':')) {
			html = html + '<a href="' + line.substring(1).trim() + '" target="_blank">' + line.substring(1).trim() + '</a>';
			html = html + '<br/>';
		} else if (line.startsWith('- ')) {
			// Add lists
			html = html + '<ul><li>' + line.substring(1).trim() + '</li></ul>';
		} else if (line.startsWith('<!--')) {
			// Remove comments (they otherwise cause an extra line break)
			continue;
		} else {
			// Unquote dot-quoted lines
			if (line.startsWith('.')) {
				line = line.substring(1);
			}
			line = line.trim();
			// Handle emphasis
			for (var j = 0; j < line.length; j++) {
				var c = line.charAt(j);
				if (c == '*') {
					if (emSpanStart == -1) {
						html = html + '<strong>';
						emSpanStart = html.length;
					} else {
						if (emSpanStart != html.length) {
							html = html + '</strong>';
						} else {
							html = html.substring(0, html.length-8) + '*';
						}
						emSpanStart = -1;
					}
				} else {
					html = html + c;
				}
			}
			html = html + '<br/>';
		}
	}
	slideContent.innerHTML = html;
	slideWrapper.appendChild(slideContent);
	root.appendChild(slideWrapper);
	slideWrapper.style.visibility = "hidden";
}

function render(content) {
	var root = document.createElement('div');
	root.className = 'slide-root';
	document.body.appendChild(root);
	content = trimIndent(content);
	// A new slide begins with a completely empty line, or one with just the expected indent (not more or less)
	var slides = content.split(new RegExp('^\n', 'mg'));
	for (var i = 0; i < slides.length; i++) {
		var slide = slides[i].trim();
		renderSlide(root, slide, i);
	}
	return root;
}

function resize() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	var bw = document.body.offsetWidth;
	var bh = document.body.offsetHeight;
	var scale = ((w/h < bw/bh) ? w/bw : h/bh);
	document.body.style.transform = 'scale(' + scale + ')';
}

function goTo(slideIndex) {
	window.location.hash = slideIndex;
	var slides = document.querySelectorAll('.slide');
	// Make zoom level affect the slides size
	var scalef = Math.round(window.devicePixelRatio) / 10.0 + 0.6;
	for (var i = 0; i < slides.length; i++) {
		var el = slides[i];
		var slide = el.children[0];
		var scaleWidth = (el.offsetWidth * scalef / slide.offsetWidth);
		var scaleHeight = (el.offsetHeight * scalef / slide.offsetHeight);
		if (i == slideIndex) {
			slide.style.transform = 'scale(' + Math.min(scaleWidth, scaleHeight) + ')';
			el.style.visibility = '';
		} else if (i == currentSlide) {
			el.style.visibility = 'hidden';
		}
	}
	currentSlide = slideIndex;
}

function next() {
	goTo(Math.min(currentSlide + 1, document.querySelectorAll('.slide').length - 1));
}

function prev() {
	goTo(Math.max(currentSlide - 1, 0));
}

function current() {
	goTo(currentSlide);
}

window.onload = function() {
	resize();
	render(document.getElementById('slide').innerHTML);
	currentSlide = Number(window.location.hash.substring(1))||0;
	window.setTimeout(current, 200);
	if (CLICK_NEXT) {
		window.onclick = next;
	}
	window.onresize = resize;
	// Mouse wheel (scroll) events
	window.onwheel = function(e) {
		if (!window.event.ctrlKey && !window.event.metaKey && !window.event.altKey) {
			if (e.deltaY > 0) {
				next();
			} else {
				prev();
			}
		}
	};
	window.onkeydown = function(e) {
		if (window.event.ctrlKey || window.event.metaKey || window.event.altKey) {
			return;
		}
		// Right-arrow, down-arrow, l, j
		// Enter, pg-down, spacebar
		if (e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 76 || e.keyCode == 74
				|| e.keyCode == 13 || e.keyCode == 34 || e.keyCode == 32) {
			next();
		// Left-arrow, up-arrow, h, k
		// Backspace, pg-up, h, k
		} else if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 72 || e.keyCode == 75
					|| e.keyCode == 8 || e.keyCode == 33) {
			prev();
		// Home
		} else if (e.keyCode == 36) {
			goTo(0);
		}
	};
};
