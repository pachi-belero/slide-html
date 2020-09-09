var fs = require('fs');
var uglify = require('uglify-js').minify;
var cssmin = require('cssmin');

var css = fs.readFileSync('src/slide.css', encoding='utf8');
var js = fs.readFileSync('src/slide.js', encoding='utf8');
var customization = fs.readFileSync('src/customization.css', encoding='utf8');
var html = fs.readFileSync('src/slide.html', encoding='utf8');

var inline = html
  .replace(/<script src="slide.js"><\/script>/, '<script>'+uglify(js, {fromString: true}).code+'</script>')
  .replace(/<link .*href="slide.css">/, '<style>'+cssmin(css)+'</style>');

fs.writeFileSync('slide.html', inline);
fs.writeFileSync('customization.css', customization);
