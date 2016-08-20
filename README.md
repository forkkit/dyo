# dio.js 

[![dio.js](https://cdn.rawgit.com/thysultan/dio.js/master/docs/layout/assets/logo.svg)](http://thysultan.com/dio)

Dio is a fast and lightweight (~7kb) feature rich Virtual DOM framework.

- ~7kb minified+gzipped
- ~15kb minified

[![npm](https://img.shields.io/npm/v/dio.js.svg?style=flat)](https://www.npmjs.com/package/dio.js) [![licence](https://img.shields.io/badge/licence-MIT-blue.svg?style=flat)](https://github.com/thysultan/dio.js/blob/master/LICENSE.md) [![Join the chat at https://gitter.im/thysultan/dio.js](https://img.shields.io/badge/chat-gitter-green.svg?style=flat)](https://gitter.im/thysultan/dio.js) ![dependencies](https://img.shields.io/badge/dependencies-none-green.svg?style=flat)

## Browser Support

* Edge
* IE 9+
* Chrome
* Firefox
* Safari

---


# Installation

#### direct download

```html
<script src=dio.min.js></script>
```

#### CDN

```html
<script src=https://cdnjs.cloudflare.com/ajax/libs/dio/1.0.6/dio.min.js></script>
```

#### bower

```
bower install dio.js
```

#### npm

```
npm install dio.js --save
```

You can also play with Dio [on this jsbin](http://jsbin.com/lobavo/edit?js,output)

---

# Getting Started

Dio is a fast and lightweight (~7kb) feature rich Virtual DOM framework
built around the concept that any function/object can become a component.

Components in Dio share the same api's as react with a few additions, 
this means that you can easily port both ways between Dio and React as and when needed
without any significant changes to the code base, 
the minimal change in most cases being a simple `React, ReactDOM = dio`.

Having said that dio can be used as just a "view" library but it does come
self containeed with everything you would need to build an application.

In that respect this getting started guide aims to show you how to go from zero to hello world in Dio.

## Hello world

```javascript
function HelloWorld () {
	return {
		render: function (props) {
			return h('h1', props.text);
		}
	}
}

dio.createRender(HelloWorld)({text: 'Hello World'})
```

Will mount a h1 element onto the `.app` div the contents of which will be 'Hello World.

---

# Performance

- [See the dbmon implementation](https://thysultan.com/examples/benchmark.html) 

# Single File Components

Single file components are self contained components with their own stylesheets,
this is possible with the use of `dio.createStyle` allowing us to create a component
within one file or function that has no external dependencies.

```javascript
var namespace = '#id';
var styles = {
	'h1': {
		'font-size': '40px',
		
		// takes the return value of the function
		width: function () {
			return window.innerWidth
		},
		
		// state
		'&:hover': {
			color: 'blue'
		},
		
		// pseudo element
		'&:after': {
			content: ' '
		},

		'@keyframes blink': {
			0: {
				backgroundColor: 'blue'
			},
			50: {
				backgroundColor: 'black'
			}
			// values can also be written as arrays
			// 0: ['background-color: blue;'],
			// 50: ['background-color: black;']
		}
	}
}

dio.createStyle(styles, namespace);

function HelloWorld () {
	return {
		render: function (props) {
			return h('div'+namespace,
						h('h1', props.text)
					)
		}
	}
}

dio.createRender(HelloWorld, '.app')({text: 'Hello World'});
```
---

# API Reference

## components schema

```javascript
{
	// lifecycle methods
	shouldComponentUpdate:     (props, state, this) => {}
	componentWillReceiveProps: (props, state, this) => {}
	componentWillUpdate:       (props, state, this) => {}
	componentDidUpdate:        (props, state, this) => {}
	componentWillMount:        (props, state, this) => {}
	componentDidMount:         (props, state, this) => {}
	componentWillUnmount:      (props, state, this) => {}
	componentDidUnmount:       (props, state, this) => {}
	propTypes:                 {}
	
	// this.methods
	this.withAttr              ({String|String[]}, {Function|Function[]})
	this.forceUpdate:          (this?: {Object})

	// setState is synchronous
	// setState also triggers this.forceUpdate
	this.setState:             ({Object})
	this.setProps:             ({Object})

	// displayName is auto created when you create a component
	// with a function like dio.createComponent({Function})
	// i.e function Foo () {} the displayName will be Foo
	// you can also set this manually {
	// 		displayName: 'something'
	// }
	// it is however an optional property so you do not need to set it,
	displayName:               {String}

	// render method
	render:                    (props, state, this) => {}
}
```

---

## creating hyperscript objects

```javascript
h(
	tag: {String}, 
	props?|children?: {Object} | {Array|Object}...,
	children?: {Array|Object}...
)

h('.wrap')
// <div class=wrap></div>

h('input[type=checkbox]')
// <input type=checkbox>

h('input', {value: 'text', onInput: ()=>{}})
// <input value=text>

h('div', 'Text')
// <div>Text</div>

h('div', h('span', 'Text'))
// <div><span>Text</span></div>

h('div', [h('h1', '1st'), h('h1', '2nd'), ...])
// <div><h1>1st</h1><h1>2nd</h1></div>

h('div', {innerHTML: "<script>alert('hello')</script>"});
// <div><script>alert('hello')</script></div>
```

---

## dio.createComponent

```javascript
dio.createComponent({Function|Object})
// or
dio.createClass({Function|Object})
// or
dio.Component({Function|Object})

// for example
var myComponent = dio.createComponent({
	render: () => { return h('div') }
});

// or with a function
var myComponent = dio.createComponent(function () {
	return {
		render: () => { return h('div') }
	};
});

// pass true as the third argument to access the 
// internal methods of a component created with .createComponent i.e
myComponent(__,__,true)
// returns {
// 		render: function ...
// }

```

---

## dio.createRender

```javascript
dio.createRender(
	component: {Function|Object}, 
	mount?: {String|Element|Function}
)
// or
dio.render(
	component: {Function|Object},
	mount?: {String|Element|Function}
)

// where component is either a hyperscript object 
// or an object with a render method that returns a hyperscript object 
// or a function that returns one of the above.

// While mount is either a selector, element
// or a function that returns an element
// if left blank this defaults to document.body within the browser context
// server-side this will return a function that returns html ouput

// dio.createRender(...) returns a render instance that can be executed anytime
// you require a render, which will either update the already rendered
// component or mount it for an initial render.
// This render instance{Function} accepts 3 optional arguments
var instance = dio.createRender(Component)
instance(props: {Object}, children: {Any}, forceUpdate: {Boolean})
// forceUpdate forces a mount stage render
// props passes props to the parent Component
// children sets this.props.children in the parent Component
// if you supply forceUpdate with '@@dio/COMPONENT' as in
instance(__, __, '@@dio/COMPONENT')
// this will return the hyperscript object of the parent component
// this is how .createHTML can accept render instances
// it extracts the resulting hyperscript object using the above method
// and converts that to a string representing the component

// you can also create a render in the following ways
// react-like
dio.createRender(h(Component, {...props}, ...children));

// or like
dio.createRender(Component, mount, {...props}, [...children]);
```

Components that do not return an object with a render function
or are itself an object with a render function will not feature
the component lifecycles and methods as presented above in the schema.

Lets go over some component examples.

```javascript
// function that returns a hyperscript object
function () {
	return h('div', 'Hello World')
}

// function that returns an object
function () {
	return {
		render: function () {
			return h('div', 'Hello World')
		}
	}
}

// hyperscript
h('div', 'Hello World')

// object with render method 
{
	render: function () {
		return h('div', 'Hello World')
	}
}

// create component with object
dio.createComponent({
	render: function () {
		return h('div', 'Hello World')
	}
})

// create component with function
dio.createComponent(function () {
	return  {
		render: function () {
			return h('div', 'Hello World')
		}
	}
})

dio.createRender(componentPlaceholder)
```

Components created with `dio.createComponent` that feature a
render method either returned from a function or within the
object passed to `.createComponent` are statefull by default.

One thing to note is that in the 'Hello World'
example that we began with, we did not create a component with `dio.createComponent()`
but rather just used a pure function that we passed
to `dio.createRender(here)` this is because
`.createRender` will create a component if what was passed to it was not a component.

Lets quickly go over some mount examples.

```javascript
document || document.querySelector('.myapp')
'.myapp'

dio.createRender(__, mountPlaceholder)

// note that the default mount is document.body if nothing is passed.
```

> But how do i render one component within another?

Components are just functions(statefull/stateless),
to render them just execute them where needed.

_note: render instances are not components_

```javascript
// stateless
function Foo (props) {
	return h('h1', props.text)
}

// statefull
var Bar = dio.createComponent({
	render: function (props) {
		return h('h2', props.text)
	}
});

// parent component
function () {
	var elementHolder = dio.createStream()

	return {
		render: function () {
			return h('div', {ref: elementHolder},
						Foo({text: 'Hello'}),
						Bar({text: 'World'})
					)
		}
	}
}

// In the above parent component we additionally assign
// a ref prop to our parent div, the ref works
// as it would in react, if it is a string
// you can access it with this.ref.name
// if it is a function the element/node is passsed to the function
// but since elementHolder is a stream
// when the element node is passed to it
// elementHolder will now container the element
// thus executing elementHolder() will return
// the element

```

---

## dio.createRouter

```javascript
dio.createRouter(
	routes: {Function|Object},
	rootAddress?: {String}, 
	onInitNavTo?: {String},
	mount?: {String|Element}
)
```

example router

```javascript
dio.createRouter({
	'/': function () {
		dio.createRender(home)()
	},
	'/user/:id': function (data) {
		dio.createRender(user)(data)
	}
}, '/backend', '/user/sultan')

// The above firstly defines a set of routes
// '/' and '/user/:id' the second of which features a data attribute
// that is passed to the callback function (data) in the form
// {id: value} i.e /user/sultan will output {id: 'sultan'}
// '/backend' specifies the root address to be used
// i.e your app lives in url.com/backend rather than on the root /
// and the third argument '/user/sultan' specifies
// an initial route address to navigate to
// initially. The last two arguments are optional.
// you can also pass a function that retuns an object of routes.

// you can also pass component functions or render functions, as in
dio.createRouter({
	'/': ComponentA,
	'/user/:id': ComponentA
}, null, null, document.body);
```

You can then assign this route to a variable and use it to navigate across views

```javascript
var myrouter = ...

myrouter.nav('/user/sultan')
myrouter.go(-2) // like calling myrouter.back() twice
myrouter.back()
myrouter.forward()
```

---

## dio.createStore

Alot like redux createStore or rather it's exactly like redux createStore
with the addition of `.connect` that accepts a render insance or a component 
and mount with which to update everytime the store is updated.
Which is mostly a short hand for creating a listerner with `.subscribe`
that updates your component on state changes.

```javascript
var store = dio.createStore(reducer: {Function})
// or
var store = dio.createStore(object of reducers: {Object})
// the same as doing a .combineReducers in redux

store.dispatch({type: '' ...})
// dispatch an action

store.getState()
// returns the current state

store.subscribe(listener: {Function})
// called everytime the state is updated with the current
// state as the only argument passed to it... as in
// function (state) {  }

store.connect(render: {Function})
store.connect(render: {Function|Object}, element: '.myapp')
// if you provide an element to .connect it assumes the render
// passed is not a render instance but a component and will then
// proceed to create a render instance.
```

---

## dio.createHTML

Like the name suggests this methods outputs the html 
of a specific component/render instance with the props passed
to it, this is normally used within the context of server-side rendering.
When used add the attribute `data-hydrate=true` to the container
you wish to ouput the html, this will tell dio not to
initialize a fresh mount and rather hydrate the current dom.

```javascript
dio.createHTML(component, props, children);
// you can also use this on plain hyperscript objects, as in
dio.createHTML(h('div', 'Text'));
```

---

## dio.createStream

```javascript
dio.createStream(store: {Any|Function}, mapper);
// if you specify a mapper/processor
// the store will be passed to mapper everytime you
// retrieve a store
// this means you can do

var alwaysString = dio.createStream(100, String);
alwaysString() // => '100' {String}


var foo = dio.createStream('initial value')
// => changes the store and returns the stream
foo('changed value') 
// thus you  can chain
foo('changed')('again')

foo() // => 'again'

// map
var bar = foo.map(function(foo){
	return foo + ' and bar';
});

bar() // => 'changed value and bar';
foo('hello world')
bar() // => 'hello world and bar'

// combine two or more streams
var faz = dio.createStream.combine(function(foo, bar, prevValueOfFaz){
	return foo() + bar();
}, foo, bar); // or an array

foo(1)
bar(2)

faz() // => 3

// listen for changes to a value
// note: this behaves like a promise but it is not a promise
faz.then(function(faz){
	console.log(faz)
});

faz('changed') // => 'changed'

// or chained
faz.then(fn).then(fn)....

// like Promise.all, will run 'fn' after all dependencies have resolved
dio.createStream.all([dep1, dep2]).then(fn);

// access resolve and reject
var async = dio.createStream(function (resolve, reject) {
	setTimeout(resolve, 500, 'value');
});

// resolve(value) assigns a value to the stream
// reject(reason) signals a rejection within the stream

// for example
var async = dio.createStream(function () {
	setTimeout(reject, 500, 'just because');
}).then(function (value) {
	console.log(value + 'resolved')
}).catch(function (reason) {
	console.log('why:' + reason)
});

// In the above code only the catch block will run
// .catch and .then blocks can return values that are
// passed to the next .catch / .then block.
// For example
var foo = dio.createStream(function (resolve, reject) {
	//...create xhr request object
	xhr.onload  = resolve;
	xhr.onerror = reject;
	xhr.send();
});

foo
	.then(function (value) { return 100 })
	.then(function (value) { console.log(value+20) }) // => 120
	.catch(function (value) { return 100 })
	.catch(function (value) { console.log(value+200) }) // => 300

// in the above if there are no errors the then blocks will execute
// in order, the first passing it's return value to the next
// the same happens if there is an error but with the catch blocks

// .scan
var numbers = createStream();
var sum = createStream.scan(function(sum, numbers) { 
	return sum + numbers();
}, 0, numbers);

numbers(2)(3)(5);
sum(); // => 10
```

---

## dio.curry

```javascript
var foo = dio.curry(
	fn: {Function|String}, 
	args...: {Any[]}, 
	preventDefault: {Boolean}, 
)
// passing preventDefault triggers e.preventDefault() 
// if function is called as an event listener
// for example:
onClick: dio.curry(
		(a) => {'look no e.preventDefault()'}, 
		['a'], 
		true
	)

// which allows us to do something like
function DoesOneThing (component, arg1, arg2) {
	// ... do something with arg1 and arg2
	// 'this' is the element that triggered the event
	component.setState({...});
}

// then in render
h('input', {
	onInput: dio.curry(DoesOneThing, [this, 1, 2], true)
})
```

---

## dio.createStyle

creates a style element that is mounted to `document.head`,
the output is auto prefixed and resembles sass/scss in the use of the "&" character
in nested styles. See the __Single File Components__ section for an example.

```javascript
dio.createStyle(css: {Object}, namespace?: {String});

// as in
dio.createStyle({'p': {color:'red'}}, '#id');
```

---

## dio.createFactory

```javascript
dio.createFactory(any[]|...arguments);
```

createFactory returns or exposes a function to the window that 
produces a hyperscript element of a given type.

If the last argument is a Boolean true 
the element factories are added to the global namespace
otherwise an object of the element factories are returned.

If only one element is specified, only that factory is returned and not an object,
if this is coupled with true as the second argument, the factory is added to
the global namespace instead.

```javascript
dio.createFactory('div', 'input', true);

// now instead of
h('div', 'Hello World');
// i can instead do
div('Hello World');
// and
input({value: 'empty'});

// multiple elements
dio.createFactory('div', 'input', true);
// or object destructuring
var {div, input} = dio.createFactory('div', 'input');

// single element
var div = dio.createFactory('div');
// or global
dio.createFactory('div', true);
```

---

## dio.request

a http helper that makes ajax requests.

```javascript
// returns a stream
dio.request(
	url: {String}, 
	payload?: {Object},

	// 'file' | 'json' | 'text',
	// default: 'application/x-www-form-urlencoded'
	enctype?: {String}, 

	// true/false
	// that indicates whether CORS requests should be made 
	// using credentials such as cookies, 
	// authorization headers or TLS client certificates.
	withCredentials?: {Boolean} 
)

// example

dio.request.post('/url', {id: 1234}, 'json')
	.then((res)=>{return res})
	.then((res)=>{'do something'})
	.catch((err)=>{throw err});

// request can also accept an opbject descriping the request

dio.request({
	method: 'GET',
	url: '/url',
	payload: {id: 1234},
	enctype: 'json',
	withCredentials: false
})
.then((res)=>{return res})
.catch((err)=>{throw err});
```

---

## dio.animateWith

```javascript
dio.animateWith.flip(
	className:       {String}, 
	duration:        {Number}, 
	transform:       {String}, 
	transformOrigin: {String}, 
	easing:          {String}
)(
element: {Element|String}
)

dio.animateWith.transitions(
	className: {String},
	type?:     {String|Number|Boolean}
)(
element: {Element}, 
callback: {Function} => (element: {Element}, transitions: {Function})
)
// where type can be a falsey or less than 0 or 'remove' 
// to indicate a removal of the class, the default being add
dio.animateWith.animations(...)
// the same as .transitions but for the css animations 
// triggered with animation: ... property 
// instead of the css transition: ... property
```

for example `dio.animateWith.flip` can be used within a render as follows

```javascript
render: function () {
	return h('.card', 
		{
			onclick: dio.animateWith.flip('active-state', 200)
		}, 
		''
	)
}
```
since `dio.animateWith.flip(...)` returns a function this is the same as

```javascript
dio.animateWith.flip('active-state', 200)(Element) // returns the duration
``` 

another animation helper is `animateWith.transitions` and `animateWith.animations`
the callback function supplied after the element will execute after the
resulting animation/transition from adding/removing the class completes.

```javascript
// within a method
handleDelete: function (e) {
	var 
	element = e.currentTarget,
	self = this
	
	// animate element out then update state
	dio.animateWith.transitions('slideUp')(element, function(el, next) {
		store.dispatch({type: 'DELETE', id: 1234});
		// we can also nest another transtion using the second arg
		// el will be the element we passed to it
		next('slideLeft')(el, function (el, next) {
			// we can also trigger the animation 
			// that results in removing the class
			next('slideLeft', -1)(el);
		});
	})
}
```

---

## dio.propTypes

validates props passed to components insuring they are of the the specificied type,
works just like it would in react-land.
The build in validtors are `[number, string, bool, array, object, func]`
and you can also create your own validators.

```javascript
dio.createComponent({
	propTypes: {
		// required
		id: dio.propTypes.string.isRequired,
		// no required/optional
		name: dio.propTypes.string,
		// build a custom validator
		custom: function (props, propName, componentName) {
			if (!/matchme/.test(props[propName])) {
	        	return new Error(
		          	'Invalid prop `' + propName + '` supplied to' +
		          	' `' + componentName + '`. Validation failed.'
	        	);
	      	}
		}
	}
	...
})
```

## dio.injectWindowDependency

injects a mock window object to be used for writting tests for 
features that do not exist outside of the browser enviroment,
like `XMLHttpRequest` and other `#document` operations.

```javascript
dio.injectWindowDependency({Object})
// returns whatever is passed to it
```