/* This file is only used during the build process; its content is inserted in the html file */

/* Disable the previous advance-on-click behaviour */
/* NOTE: change below to CLICK_NEXT=1 to restore the default advance-on-click behaviour... */
var CLICK_NEXT = 0;
var INDENT_RE = /^(?:( )+|\t+)/;

function trimIndent(s) {
	var indent = (s.match(INDENT_RE)||[''])[0].length;
	if (indent > 0) {
		var trim = s.substring(0, indent);
		return s.replace(new RegExp(trim, 'g'), '');
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
			    html = html + '<h2>' + line.substring(2) + '</h2>';
            } else {
			    html = html + '<h1>' + line.substring(1) + '</h1>';
            }
		} else if (line.startsWith('`') || line.startsWith('\t') || line.startsWith('  ')) {
			// Add code
    		if (line.startsWith('  ')) {
				html = html + '<pre>' + line.substring(2) + '</pre>';
            } else {
				html = html + '<pre>' + line.substring(1) + '</pre>';
            }
		} else if (line.startsWith('!')) {
				// Add image
				html = html + '<img src="' + line.substring(1) + '" />';
		} else if (line.startsWith(':')) {
			html = html + '<a href="' + line.substring(1).trim() + '" target="_blank">' + line.substring(1).trim() + '</a>';
			html = html + '<br/>';
		} else if (line.startsWith('- ')) {
			// Add lists
			html = html + '<li>' + line.substring(1) + '</li>';
		} else if (line.startsWith('<!--') || line.startsWith('\t')) {
			// Remove comments (they otherwise cause an extra line break)
			continue;
		} else {
			// Unquote dot-quoted lines
			if (line.startsWith('.')) {
				line = line.substring(1);
			}
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
	var slides = content.split(/[\s+]\n/mg);
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

var currentSlide = -1;

function goTo(slideIndex) {
	currentSlide = slideIndex;
	window.location.hash = slideIndex;
	var slides = document.querySelectorAll('.slide');
	for (var i = 0; i < slides.length; i++) {
		var el = slides[i];
		var slide = el.children[0];
		var scaleWidth = (el.offsetWidth * 0.8 / slide.offsetWidth);
		var scaleHeight = (el.offsetHeight * 0.8 / slide.offsetHeight);
		slide.style.transform = 'scale(' + Math.min(scaleWidth, scaleHeight) + ')';
		if (i == currentSlide) {
			el.style.visibility = '';
		} else {
			el.style.visibility = 'hidden';
		}
	}
}

function next() {
	goTo(Math.min(currentSlide + 1, document.querySelectorAll('.slide').length - 1));
}

function prev() {
	goTo(Math.max(currentSlide - 1, 0));
}

window.onload = function() {
	resize();
	render(document.getElementById('slide').innerHTML);
	goTo(window.location.hash.substring(1)||0);
	if (CLICK_NEXT) {
		window.onclick = next;
	}
	window.onresize = resize;
	window.onkeydown = function(e) {
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
		// Home, 0, numpad-0
		} else if (e.keyCode == 36 || e.keyCode == 48 || e.keyCode == 96) {
			goTo(0);
		}
	};
};
