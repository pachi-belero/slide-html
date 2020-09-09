# Slide-HTML

The most simple plain text presentation maker.

This version is a standalone HTML page of 4K in size that you can edit in place
and get a working presentation. No other tools needed except for a text editor.
No programming knowledge is required, too.

The original (trikita) implementation can be found [here](https://github.com/trikita/slide-html).
Android implementation (2016) can be found [here](https://github.com/trikita/slide).

The improved version that this one is based on can be found [here](https://github.com/jloow/slide-html).

## Tutorial

1. Download `slide.html` and `customization.css`.
 [Open this link](https://raw.githubusercontent.com/pachi-belero/slide-html/master/slide.html)
 and press <kbd>Ctrl+S</kbd>. Then do the same with
 [this link](https://raw.githubusercontent.com/pachi-belero/slide-html/master/customization.css).
2. Open the downloaded `slide.html` with a text editor.
3. Find the line `<pre id="slide">` (should be somewhere around line 16).
4. Edit the text. This is the contents of your presentation.
5. Edit the `customization.css` to delete the example CSS styles customizations for
specific slides (lines 33 to 50), and optionally adjust color or other styles.
6. After you save the files, open `slide.html` in your browser and see the results. You
can edit, save and refresh the browser to see how your presentation looks like.

## Demo

Either open `slide.html` in your browser or [view it online](http://htmlpreview.github.io/?https://github.com/pachi-belero/slide-html/blob/master/slide.html).

NOTE: the images will not work if you view the file online with the previous link, but they will on your local computer or any other HTTP server.

## Syntax

Slides are separated with a blank line.

The font size of each slide is scaled automatically to fit the screen. This is
suitable for [Takahashi method](https://en.wikipedia.org/wiki/Takahashi_method).

Headlines use a larger font size and start with `#` sign. `##` creates second-level headlines.

Emphasized text is written as bold and must be surrounded with asterisks, `*like this*`.

To print an actual asterist just write it twice, `** like this`.

To emphasize text or use any other special format, just use HTML tags directly, _`<em>like in this emphasized text</em>`_.

Code blocks are written with monospace font and must start with at least two spaces, tab, or backticks (\`) (on each line).

Image slides start with `!` character.

Simple lists can be created by starting lines with a dash (`-`).

Lines that contain just a URL and must be converted to a link start with `:` character.

To disable the special meaning of newlines, spaces, `:`, `#`, etc. put a dot at the
beginning of the line.

## Styling

In `customization.css` there is a small style block. You can specify the default font, foreground and background colors for your slides. You can also
customize header, monospace and emphasized font styles, and do further customizations for specific slides, to include background images, etc.

## Printing

You can print your presentation, in this case the slides will be printed as small thumbnails
so that you could make notes on paper or use it as a story plan for your speech.

## Development

We really want to keep it minimal, but if you want to customize it or offer a
pull request you can edit files inside the `src` folder. Then you may open
`src/slide.html` to view your changes, or run `npm run build` to generate the
standalone `slide.html` version.

Also, you can run `npm run convert input_text_file output_slide_file.html` to generate a new HTML file from the text file specified, using `slide.html` as a template.

## License

Code is distributed under MIT license, feel free to use it.

Made by [Trikita](http://trikita.co) - feel free to checkout our other works!
