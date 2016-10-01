# Resize Images

Remember to `npm install` first

You can use *auto* to make image resize and keep ratio.

### Usage

~~~bash
# like this
$ node index.js <path/to/file> <width> <height>
~~~

#### Example

~~~bash
$ node index.js examples/ 350 280

# height is optional
$ node index.js examples/octocat.png 120

# auto width and keep ratio
$ node index.js examples/octocat.jpg auto 260
~~~
