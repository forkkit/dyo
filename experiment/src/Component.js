/**
 * Component
 *
 * @param {Object?} props
 */
function Component (props) {
	var state = this.state;

	this.refs = null;
	this.this = null;

	// props
	if (this.props === void 0) {
		this.props = (props === object || props === void 0 || props === null) ? {} : props;
	}

	// state
	if (state === void 0) {
		state = this.state = {};
	}

	this._state = null;
}

/**
 * Component Prototype
 *
 * @type {Object}
 */
var ComponentPrototype = {
	setState: {value: setState},
	forceUpdate: {value: forceUpdate},
	UUID: {value: 2}
};

Component.prototype = Object.create(null, ComponentPrototype);
ComponentPrototype.UUID.value = 1;

/**
 * Extend Class
 *
 * @param {Function} type
 * @param {Object} prototype
 */
function extendClass (type, prototype) {
	if (prototype.constructor !== type) {
		Object.defineProperty(prototype, 'constructor', {value: type});
	}

	Object.defineProperties(prototype, ComponentPrototype);
}

/**
 * setState
 *
 * @param {Object} state
 * @param {Function?} callback
 */
function setState (state, callback) {
	var owner = this;
	var newState = state !== void 0 && state !== null ? state : {};
	var oldState = owner.state;
	var constructor = newState.constructor;

	if (constructor === Function) {
		newState = callbackBoundary(shared, owner, newState, oldState, 0);

		if (newState === void 0 || newState === null) {
			return;
		}

		constructor = newState.constructor;
	}

	if (constructor === Promise) {
		newState.then(function (value) {
			owner.setState(value, callback);
		});
	} else {
		owner._state = newState;
		owner.forceUpdate(callback);
	}
}

/**
 * forceUpdate
 *
 * @param {Function?} callback
 */
function forceUpdate (callback) {
	var owner = this;
	var older = owner.this;

	if (older === null || older.node === null || older.async !== 0) {
		if (older.async === 3) {
			// this is to avoid maxium call stack when componentDidUpdate
			// introduces an infinite render loop
			requestAnimationFrame(function () {
				owner.forceUpdate(callback);
			});
		}

		return;
	}

	patch(older, older, 3);

	if (callback !== void 0 && typeof callback === 'function') {
		callbackBoundary(older, owner, callback, owner.state, 1);
	}
}

/**
 * Update State
 *
 * @param {Object} oldState
 * @param {Object} newState
 */
function updateState (oldState, newState) {
	for (var name in newState) {
		oldState[name] = newState[name];
	}
}

/**
 * Get Initial State
 *
 * @param  {Tree} older
 * @param  {Object} state
 * @return {Object}
 */
function getInitialState (older, state) {
	if (state !== void 0 && state !== null) {
		switch (state.constructor) {
			case Promise: {
				state.then(function (value) {
					older.async = 0;
					older.owner.setState(value);
				});
				break;
			}
			case Object: {
				older.owner.state = state;
				break;
			}
		}
	}
}

/**
 * Get Initial Static
 *
 * @param  {Function} owner
 * @param  {Function} fn
 * @param  {String} type
 * @param  {Object} props
 * @return {Object?}
 */
function getInitialStatic (owner, fn, type, props) {
	if (typeof fn === 'object') {
		return fn;
	}

	var value = callbackBoundary(shared, owner, fn, props, 0);

	if (value !== void 0 && value !== null) {
		return Object.defineProperty(owner, type, {value: value});
	}
}

/**
 * PropTypes
 *
 * @param {Component} owner
 * @param {Function} type
 * @param {Object} props
 */
function propTypes (owner, type, props) {
	var display = type.name;
	var types = type.propTypes;

	try {
		for (var name in types) {
			var valid = types[name];
			var result = valid(props, name, display);

			if (result) {
				console.error(result);
			}
		}
	} catch (err) {
		errorBoundary(err, shared, owner, 2, valid);
	}
}
