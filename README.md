# Learning JavaScript and Front-end tooling

The goal of this project is to make you familiar with front-end tooling like
`babel`, `node-sass` and bundler like `webpack`.

<p align="center">
	<img src="https://raw.githubusercontent.com/swashata/course-use-webpack/todoapp.png" width="733" height="544">
</p>

Here we have a sample project written in react, a very simple [todo app](https://todos.swas.io).

## Part 1 - Using `babel`, `node-sass` and `browser-sync`

We start the project and write our javascript code in `esnext` and css in `scss`.

We use `babel` to compile our `esnext` into `es5` so that all browsers can understand
it. We also use `node-sass` to compile our `scss` into `css`.

We then learn how to automate things with `npm scripts` and use `browser-sync` to
have a fine developer experience.

## Part 2 - Using `webpack` bundler

Now we start using `webpack` bundler to bring more modularity to our application.
With a bundler we don't have to enqueue libraries to our HTML files manually.

We start by installing `webpack` and configuring only the parts necessary.

Then we start removing UMD `<script>` tags from our HTML file and install them
through `npm` to consume from `webpack` bundle.

## Getting started

Clone this repository and go to the folder `start-here`. Now install dependencies

```bash
npm i
```

Now goal is to:

1. Start using `babel` and `node-sass` along with `browser-sync`. The final outcome
   can be found in `with-babel-node-sass` directory.
2. Further introduce `webpack` and ditch `browser-sync` in favor of `webpack-dev-server`.

## Videos

Will upload soon.
