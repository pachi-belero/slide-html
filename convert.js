var fs = require('fs');
var cssmin = require('cssmin')

var input_file;
var output_file;
var css;
process.argv.forEach(function (val, index) {
  if (index == 2)      { input_file  = val; } // Input file (text content)
  else if (index == 3) { output_file = val; } // Output file
//  else if (index == 4) { css         = val; } // Custom css file
});

// Find a way not to hard code this
var html = fs.readFileSync("slide.html", encoding='utf8'); // Template file
var input = fs.readFileSync(input_file, encoding='utf8');
if (!css) {
  var customization = fs.readFileSync("customization.css", encoding='utf8');
} else {
  var customization = fs.readFileSync(css, encoding='utf8');
}

// I'm assuming we could use lookaheads here, but I don't know how
// The first line of the presentation requires two spaces
var new_slide = html.replace(/<pre id="slide">.*?<\/pre>/s, '<pre id="slide">\n  ' + input + '</pre>');

// Optional: also insert the contents of the specified CSS file. Not for now (we don't do it in build.js either)
// customization = customization.replace(/\/\* SPECIAL-MARK-CONVERT.JS-WILL-DELETE-THIS-SECTION.*SPECIAL-MARK-END.*\*\//s, '');
// new_slide = new_slide.replace(/<link .*href="customization.css">/, '<style>' + cssmin(customization) + '</style>');

fs.writeFileSync(output_file, new_slide);
