# Slide-HTML

The most simple plain text presentation maker.

This version is a standalone HTML page of 5KB in size that you can edit in place
and get a working presentation. No other tools needed except for a text editor.
No programming knowledge is required, too.

The original (trikita) implementation can be found [here](https://github.com/trikita/slide-html).
Android implementation (2016) can be found [here](https://github.com/trikita/slide).

The improved version that this one is based on can be found [here](https://github.com/jloow/slide-html).

## Tutorial

1. Download `slide.html` and `customization.css`.
 [Open this link](https://raw.githubusercontent.com/pachi-belero/slide-html/master/slide.html)
 and press <kbd>Ctrl+S</kbd>, then do the same with
 [this link](https://raw.githubusercontent.com/pachi-belero/slide-html/master/customization.css).
2. Open the downloaded `slide.html` with a text editor.
3. Find the line `<pre id="slide">` (should be somewhere around line 16).
4. Edit the text. This is the contents of your presentation.
5. Edit the `customization.css` (the style settings for your presentation) to delete the example CSS
styles customizations for specific slides (lines 33 to 50), and optionally adjust colors, etc.
Note that using specific slide customization makes sharing the `customization.css` file for several
HTML presentations impossible (in that case, it is better to use a *`samefilename.html.css`* file
(same name as the HTML file, which will also be read and used; you can keep the "common" settings
in the `customization.css`).
6. After you save the files, open `slide.html` in your browser and see the results. You can edit,
save and refresh the browser to see how your presentation looks like.
7. Copy, share and/or publish BOTH the HTML and CSS files whenever needed, and also the local image
files you have used (if any).
8. Optionally, you can place a `favicon.ico` file too (in the same folder) and it will be used.

## Demo

Either open `slide.html` in your browser or [view it online](http://htmlpreview.github.io/?https://github.com/pachi-belero/slide-html/blob/master/src/slide.html).

NOTE: the images will not work if you view the file online with the previous link, but they will on
your local computer or any other HTTP server.

## Syntax

Slides are separated with a blank line.

The font size of each slide is scaled automatically to fit the screen. This is
suitable for [Takahashi method](https://en.wikipedia.org/wiki/Takahashi_method).

Headlines use a larger font size and start with `#` sign. `##` creates second-level headlines.

Emphasized text is written as bold and must be surrounded with asterisks, `*like this*`.

To print an actual asterist just write it twice, `** like this`.

To emphasize text or use any other special format, just use HTML tags directly, _`<em>like in this emphasized text</em>`_.

Code blocks are written with monospace font and must start with at least two spaces, tab, or
backticks (\`) (on each line).

Image slides start with `!` character. You can specify a relative path to a file, or a URL.

Simple lists can be created by starting lines with a dash (`-`).

Lines that contain just a URL and must be converted to a link start with `:` character.

To disable the special meaning of newlines, spaces, `:`, `!`, `-`, `#`, etc. put a dot at the
beginning of the line.

## Styling

In the CSS file(s) you can specify the default font, foreground and background colors for your
slides. You can also customize header, monospace and emphasized font styles, and do further
customizations for specific slides, to include background images, etc. (see example).

Also, some special "marks" can be used to alter a specific slide stile:

- `@NOSELECT@` to disable text/content selecting
- `@NOSCALE@` to not auto-scale the slide acording to content (can be useful for iframes or other special HTML or embedded content)
- `@ZOOM@` **followed by** space(s) and an **integer** (in the range 25 to 400), to alter the slide's relative scaling. Note that the "zoom factor" applied here is not direclty visible in the final result, i.e. 200 makes content a bit bigger but not double-sized. Experiment to get suitable values (this should behave similarly to a browser's zoom level)

They should appear as-is (uppercase), at the beginning of a line, one per line, and with no other content (they will be filtered out from the final content rendered).

## Printing

You can print your presentation, in this case the slides will be printed as small thumbnails
so that you could make notes on paper or use it as a story plan for your speech.

## Development

We really want to keep it minimal, but if you want to customize it or offer a
pull request you can edit files inside the `src` folder. Then you may open
`src/slide.html` to view your changes, or run `npm run build` to generate the
standalone `slide.html` version.

Also, you can run `npm run convert input_text_file output_slide_file.html` to generate a new
HTML file from the text file specified, using `slide.html` as a template.

## License

Code is distributed under MIT license, feel free to use it.

Made by [Trikita](http://trikita.co) - feel free to checkout our other works!
