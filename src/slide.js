/* This file is only used during the build process; its content is inserted in the html file */

/* Disable the previous advance-on-click behaviour */
/* NOTE: use CLICK_NEXT=1 to restore the default advance-on-click behaviour... */
var CLICK_NEXT = 0;
/* NOTE: use HISTORY=0 to avoid pushing browser history elements for each page change! */
var HISTORY = 1;
var slideNames = {};
var currentSlide = -1;
var onSearch = false;
var INDENT_RE = /^(?:( )+|\t+)/;

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
		} else if (line.startsWith('@NOSCALE@')) {
				// Disable text selection in this slide
				slideWrapper.className += ' noscale';
				slideContent.className = 'slide-content-noscale';
		} else if (line.startsWith('@ZOOM@')) {
				var zoomf = line.substring(6).trim();
				// Disable text selection in this slide
				slideWrapper.className += ' zoom-' + zoomf;
		} else if (line.startsWith('@CLASS@')) {
				var classNm = line.substring(7).trim();
				slideWrapper.className += ' ' + classNm;
				slideNames[classNm] = index;
		} else if (line.startsWith('!')) {
				// Add image
				html = html + '<img src="' + line.substring(1).trim() + '" style="max-width: 100%"/>';
		} else if (line.startsWith(':')) {
			var url = line.substring(1).trim();
			var target = 'target="_blank"';
			// If it is a relative link to this presentation, open it in the same tab, otherwise in a new tan
			if (url.startsWith('#'))
				target = "";
			html = html + '<a href="' + url + '" ' + target + '>' + url + '</a>';
			html = html + '<br>';
		} else if (line.startsWith('- ')) {
			// Add lists
			html = html + '<ul><li>' + line.substring(1).trim() + '</li></ul>';
		} else if (line.startsWith('<!--')) {
			// Remove comments (they otherwise cause an extra line break)
			continue;
		} else {
			var br = true;
			// Unquote dot-quoted lines
			if (line.startsWith('.')) {
				line = line.substring(1);
			}
			line = line.trim();
			// Do not add a line break if the line ends with the special mark "/NOBR/"
			if ( line.substring(line.length - 6, line.length) == "/NOBR/" ) {
				br = false;
				line = line.substring(0, line.length - 6);
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
			if ( br == false ||
				 line.substring(line.length - 13, line.length) == "</blockquote>" ||
				 line.substring(line.length - 6, line.length) == "</pre>" ) {
				// No extra line break
				html = html + '<!-- nobr -->';
			} else {
				html = html + '<br>';
			}
		}
	}
	slideContent.innerHTML = html;
	slideWrapper.style.visibility = "hidden";
	slideWrapper.appendChild(slideContent);
	root.appendChild(slideWrapper);
}

function render(content) {
	var root = document.createElement('div');
	root.className = 'slide-root';
	document.body.appendChild(root);
	content = trimIndent(content);
	// A new slide begins with a completely empty line, or one with just the expected indent (not more or less)
	var slides = content.split(new RegExp('^\n+', 'mg'));
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
	current();
}

function goTo(slideIndex) {
	if (currentSlide >= 0) {
		if ( HISTORY == 1 ) {
			window.location.hash = slideIndex;  // affects browser history
		} else {
			window.location.hash.replace(slideIndex);  // does not affect browser history
		}
		currentSlide = slideIndex;
	}
	var slides = document.querySelectorAll('.slide');
	for (var i = 0; i < slides.length; i++) {
		var zoomf = 1.0;
		var el = slides[i];
		var slideContent = el.children[0];
		// Make zoom level affect the slides size (0.8 = 80% is the default)
		var newscalef = (window.devicePixelRatio / 10.0 ) + 0.6;
		if (el.className.match("noscale") || onSearch) {
			newscalef = 1.0;
		}
		var scaleWidth = (el.offsetWidth * newscalef / slideContent.offsetWidth);
		var scaleHeight = (el.offsetHeight * newscalef / slideContent.offsetHeight);
		if (el.className.match("zoom-")) {
			var zoomstr = el.className.match("zoom-.\+")[0].split();
			var zoomint = parseInt(zoomstr[0].substr(5))||100;
			zoomf *= zoomint / 100.0;
			if (zoomf < 0.25) {
				zoomf = 0.25;
			} else if (zoomf > 4.0) {
				zoomf = 4.0;
			}
		}
		zoomf *= Math.min(scaleWidth, scaleHeight);
			if (i == slideIndex || onSearch) {
				slideContent.style.transform = 'scale(' + zoomf + ')';
				if (currentSlide >= 0) {
					el.style.visibility = '';
				}
			} else if (!onSearch) {
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

function current() {
	dest = currentSlide;
	max = document.querySelectorAll('.slide').length - 1;
	goTo(Math.min(max, Math.max(dest, 0)));
}

function readhash() {
	dest = window.location.hash.substring(1)||"0";
	if (slideNames[dest] != undefined) {
		dest = slideNames[dest];
	}
	return dest;
}

function newhash() {
	if (currentSlide != -1) {
		dest = readhash();
		max = document.querySelectorAll('.slide').length - 1;
		goTo(Math.min(max, Math.max(dest, 0)));
	}
}

window.onload = function() {
	render(document.getElementById('slide').innerHTML);
	var initialSlide = readhash();
	resize();  // Includes a call to current() which does not change visibility the first time
	currentSlide = initialSlide;
	if (CLICK_NEXT) {
		window.onclick = next;
	}
	window.onresize = resize;
	// Mouse wheel (scroll) events
	window.onwheel = function(e) {
		if (!onSearch && !window.event.ctrlKey && !window.event.metaKey && !window.event.altKey) {
			if (e.deltaY > 0) {
				next();
			} else {
				prev();
			}
		}
	};
	window.onkeydown = function(e) {
		if (onSearch || window.event.ctrlKey || window.event.metaKey || window.event.altKey) {
			if ((window.event.ctrlKey && e.keyCode == 70) ||
				(window.event.metaKey && e.keyCode == 70)) {  // CTRL-F or META-F
				document.body.style.transform = 'none';
				var slides = document.querySelectorAll('.slide');
				for (var i = 0; i < slides.length; i++) {
					var el = slides[i];
					var slideContent = el.children[0];
					el.style.position = 'initial';
					el.style.overflow = 'hidden';
					el.style.display = 'flex';
					el.style.maxWidth = '100%';
					slideContent.style.padding = '1rem';
					if (i > 0) {
						slideContent.style.border = 'dotted';
					}
					el.style.visibility = 'visible';
				}
				onSearch = true;
				resize();
				window.setTimeout(resize, 150);
			}
			// Ignore all other keys in this case (avoid page changes in search mode)
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
		// Esc
		} else if (e.keyCode == 27) {
			// Show current slide # in hash (address bar), and put it in browser history
			window.location.hash = currentSlide;
		}
	};
	window.onhashchange = newhash;
	window.setTimeout(current, 150);
};
