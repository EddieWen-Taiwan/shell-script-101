# Resize Images

Remember to `npm install` first

*It doesn't crop image to new size, old image will fit new size. It will be terrible if you don't keep ratio.*

### Usage

~~~bash
# like this
$ node ./index.js <path/to/file> <width> <height>
~~~

#### Example

~~~bash
# example
$ node ./index.js examples/ 350 280

# height is optional with rectangle image
$ node ./index.js examples/octocat.png 120
~~~
