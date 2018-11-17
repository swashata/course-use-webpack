## Setup

Navigation to `start-here` directory and open your favorite code editor.
If you have VSCode installed and the command setup you can just do

```bash
code .
```

Now install dependencies

```bash
npm i
```

## Getting around

Inside `src` you can see two files:

1. `todoapp.js` - Our main application. It is written with modern javascript features and has `jsx` syntax inside it.
2. `style.scss` - Application styling. Written in SCSS language.

At the root we have `index.html` file which is the main file for serving our
todo application.

Here we have

1. Bulma CSS from CDN.
2. Our own styles.
3. JavaScript libraries we are going to need. Included with good old fashioned `<script>` tags.
4. And of course our own javascript file.

Now this setup won't run in the browser, not yet. To see
what happens, open `index.html` with chrome.

```bash
open index.html
```

## Setup JavaScript and SASS tooling

### Babel

First we need babel for compiling our javascript. Remember

1. We have used all modern javascript features since ES6.
2. We have used `JSX` syntax.

While some browsers can understand and run ES6 just fine, none of the browsers
can and probably shouldn't run JSX. That is because it is a **syntax extension**
to JavaScript and it is not valid javascript at all.

Now I am not gonna go much into it, because our goal here is to setup tooling.
If you have never heard about JSX, don't worry too much about it now. You will
get to know it when you learn React. I have chosen to show this to you because
all the tooling and bundlers actually make sense with new libraries.

With that being said, what we need is, a tool which would

1. Convert/Compile `ESNext` code into something that most of the browsers understand.
2. Compile `JSX` into valid JavaScript code.

[Babel](https://babeljs.io/) is one such tool which can do both.

#### Install

From your terminal, run

```bash
npm i -D @babel/core @babel/cli @babel/plugin-proposal-class-properties @babel/preset-env @babel/preset-react
```

This installs all tooling we need within your project's development dependency.

Now let's just run babel and see what it does.

```bash
`npm bin`/babel src --out-dir dist
```

Or (if using windows)

```bash
./node_modules/.bin/babel src --out-dir dist
```

Now it just yells at you saying the same error we've seen in the browsers.

#### Configuration

So we installed babel, hoping that it would somehow compile our code into
something that browsers understand, instead it is now yelling about the same
error. Why so?

Because, babel, just by itself, doesn't do anything.

From the [docs](https://babeljs.io/docs/en/plugins)

> It basically acts like `const babel = code => code;` by parsing the code and then generating the same code back out again. You will need to add plugins for Babel to do anything.

So instead of finding plugins for every ES6+ syntax and feature we are going
to use, we can just grab a bunch of them through distributed presets.

> https://babeljs.io/docs/en/babel-preset-env

> @babel/preset-env is a smart preset that allows you to use the latest
> JavaScript without needing to micromanage which syntax transforms (and
> optionally, browser polyfills) are needed by your target environment(s).
> This both makes your life easier and JavaScript bundles smaller!

Now to get started, let's create a configuration file (babel 7 style).

Under the root, create `babel.config.js` and put the following code

```js
module.exports = {
  presets: ["@babel/preset-env"]
};
```

It tells babel to use the `@babel/preset-env` we have installed before. This
preset, in turn, will use plugins to automatically compile your ES6+ code
into something that your target browsers understand.

Now let's run the babel command again

```bash
./node_modules/.bin/babel src --out-dir dist
```

It still gives the same error.

Remember I told you that we are using `JSX` in our javascript? Well, babel
even with `preset-env` doesn't understand that syntax. Luckily we have
another preset, which tells babel how to compile jsx.

So edit `babel.config.js` and add the preset.

```js
module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"]
};
```

Now let's run the command again.

```bash
./node_modules/.bin/babel src --out-dir dist
```

Now it's showing us a new error `Support for the experimental syntax 'classProperties ' isn't currently enabled`.

This is because, even with `preset-env` and `preset-react`, babel doesn't
understand about javascript features, which aren't finalized.

Here in our code, if you look at line 94, you can see we are using something
what is called class properties.

> https://babeljs.io/docs/en/babel-plugin-proposal-class-properties

To make babel understand it, we have pass in the plugin to babel configuration.

So edit the `babel.config.js` file again and put a new plugin.

```js
module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: ["@babel/plugin-proposal-class-properties"]
};
```

Now let's run babel again.

```bash
./node_modules/.bin/babel src --out-dir dist

Successfully compiled 1 file with Babel.
```

All right!!!

To check if the code actually works or not, let's edit our `index.html` file.

```diff
	<script crossorigin src="https://unpkg.com/react-spring@6.1.6/dist/addons.umd.js"></script>
	<!-- Our own javascript -->
-	<script src="./src/todoapp.js"></script>
+	<script src="./dist/todoapp.js"></script>
```

Here instead of using our source file in the browser, we are using the one
compiled by babel.

All right, it works now. Let us also see, what babel did.

1. It added a bunch of helpers to have ES6+ features within ES5.
2. It converted all the JSX syntax into `React.createElement`.

But do we really need all this things? What if, we want to target only `chrome latest`
where many of the ES6+ code we wrote, just works? And works faster?

That's where `.browserslistrc` file comes in. Just create this file
on the root (where `package.json` is) and just put the following content.

```
chrome >= 68
```

Now compile it again, and see the code is much much smaller.

In production though, you would probably want to use something like

```
> 0.25%, not dead
```

Do visit https://browserl.ist/ to checkout all the possible queries.

The best thing about using such file is, the same value can be shared across
babel, postcss and all other tooling that support it. This is a good
article https://css-tricks.com/browserlist-good-idea/

#### Define NPM Script

Did you notice that everytime we wanted to compile our file, we would just

```bash
./node_modules/.bin/babel src --out-dir dist
```

again and again? It becomes hectic and repetitive. So we define an npm script.

Edit `package.json` and under `scripts`, put

```diff
  "scripts": {
-    "test": "eslint src/*.js"
+    "test": "eslint src/*.js",
+    "build-js": "babel src --out-dir dist --source-map"
```

Now simply run

```bash
npm run build-js
```

and it will compile using babel.

What if we want it to auto-compile whenever we make changes?

Let's add another script

```diff
  "scripts": {
-    "test": "eslint src/*.js"
+    "test": "eslint src/*.js",
+    "build-js": "babel src --out-dir dist --source-map",
+    "start-js": "babel src --out-dir dist --source-map --watch"
```

Now run

```bash
npm run start-js
```

And hey if you want to know all the cli options you have with babel, do read
the docs:

> https://babeljs.io/docs/en/babel-cli#install

### Node Sass

Now our main javascript bundling out of the way, let's focus on CSS for a moment.

We have written our styles in [sass language](https://sass-lang.com/) and we
need a compiler, much like babel, which would compile our sass into css.

#### Install

```bash
npm i -D node-sass
```

And that's about it. Really!!

#### Run and Define NPM Scripts

Much like before, we would go ahead and define our NPM scripts to run the
`node-sass` command. Edit the `package.json` file and add the following two
npm scripts.

```diff
    "test": "eslint src/*.js",
    "build-js": "babel src --out-dir dist --source-map",
    "start-js": "babel src --out-dir dist --source-map --watch",
+    "build-sass": "node-sass --source-map true ./src --output ./dist"
```

Now run the command

```bash
npm run build-sass
```

And watch it compile our file in `dist` directory.

Similarly, let's create a watch script which would continuously watch our
files for changes.

```diff
    "test": "eslint src/*.js",
    "build-js": "babel src --out-dir dist --source-map",
    "start-js": "babel src --out-dir dist --source-map --watch",
+    "build-sass": "node-sass --source-map true ./src --output ./dist",
+    "start-sass": "npm run build-sass && node-sass --source-map true --watch ./src --output ./dist"
```

Now run

```bash
npm run start-sass
```

Here we build before the watch task, because `node-sass` doesn't compile
files at the start of the watch task.

#### Change `index.html`

Now we would like to enqueue the compiled `css` file within our HTML. So
again, edit `index.html` and change the following

```diff
	<!-- Our styling -->
-	<link rel="stylesheet" href="./src/style.scss">
+	<link rel="stylesheet" href="./dist/style.css">
```

Open the `index.html` in browser and see it go crazy.

## Setup Development Tooling

Now that we have the babel and sass tooling set, let's create something to
ease up our development. Right now to develop we would

1. Run `start-js` in one terminal.
2. Run `start-sass` in another terminal.
3. Open `index.html` directly in our browser.
4. Make changes.
5. Refresh browser.

What if, we could automate everything with a single command? Well that's what
we will be doing now.

### Install Tools

We will need the following tools for this.

```bash
npm i -D npm i -D browser-sync concurrently
```

### Configure Scripts

Now our goal is to

1. Have `concurrently` run `start-js` and `start-sass` together.
2. Run browser-sync and serve `index.html`.
3. Make browser-sync watch for files inside `dist` and reload browser.

With these in mind, we create another npm script `start-bs`.

```diff
    "start-sass": "npm run build-sass && node-sass --source-map true --watch ./src --output ./dist",
+    "start-bs": "browser-sync start --server --files 'dist' 'index.html'"
```

To make sure things are working fine, let's manually change contents inside
`dist/style.css` file. Look it works!

So now we need a way to concurrently run `start-js`, `start-sass` and `start-bs`
together. That's why we have `concurrently` package. Let's add another
script here now.

```diff
    "start-bs": "browser-sync start --server --files 'dist' 'index.html'",
+    "start": "concurrently --names \"🚧,💅,🔥\" --prefix \"name\" npm:start-js npm:start-sass npm:start-bs"
```

Now simply run

```bash
npm start
```

And watch thing go. Cool right?

To complement the `start` task, let's create a build task too.

```diff
    "start": "concurrently --names \"🚧,💅,🔥\" --prefix \"name\" npm:start-js npm:start-sass npm:start-bs",
+    "build": "npm run build-js && npm run build-sass"
```

Run it and we have production ready files.

```bash
npm run build
```

## Exercise

Here are a few things you can do to further strengthen your skills and
understanding.

1. Start using `@babel/polyfill`.
1. Add post-css to the mix.
1. Use `autoprefixer` with `post-css`.
1. Perhaps do all the above with a task runner like `gulp`. (Although we will be using webpack and will learn how to do that! So gulp isn't necessary).
