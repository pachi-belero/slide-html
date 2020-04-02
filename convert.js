var fs = require('fs');
var cssmin = require('cssmin')

//var beautify = require('beautify')

var input_file;
var output_file;
var css;
process.argv.forEach(function (val, index) {
  if (index == 2)      { input_file  = val; } // Input file
  else if (index == 3) { output_file = val; } // Output file
  else if (index == 4) { css         = val; } // Custom css file
});

// Find a way not to hard code this
var html = fs.readFileSync("/home/joel/.local/src/slide-html/slide.html", encoding='utf8');
var input = fs.readFileSync(input_file, encoding='utf8');
if (!css) {
  var customization = fs.readFileSync("/home/joel/.local/src/slide-html/customization.css", encoding='utf8');
} else {
  var customization = fs.readFileSync(css, encoding='utf8');
}

// I'm assuming we could use lookaheads here, but I don't know how
// The first line of the presentation requires two spaces
var new_slide = html
  .replace(/<pre id="slide">.*?<\/pre>/s, '<pre id="slide">\n  ' + input + '</pre>')
  .replace(/<link .*href="customization.css">/, '<style>' + cssmin(customization) + '</style>');

fs.writeFileSync(output_file, new_slide);
