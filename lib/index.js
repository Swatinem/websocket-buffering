
/**
 * Module dependencies.
 */

var ws;
var Emitter;
try {
	// node
	ws = require('ws');
	Emitter = require('events').EventEmitter;
} catch (e) {
	// component
	ws = WebSocket;
	Emitter = require('emitter');
}

module.exports = WebSocketWrapper;

/**
 * Create a WebSocket to optional `host`,
 * defaults to current page.
 *
 * @param {String} host
 * @return {Object} ws
 * @api public
 */

function WebSocketWrapper(url, options) {
	Emitter.call(this);

	options = options || {};

	this.url = url;
	this._buffered = [];
	this._buffering = options.buffering !== false;
	this._socket = undefined;
	if (options.connect !== false)
		this.connect();
}
WebSocketWrapper.prototype = Object.create(Emitter.prototype);

// wrap the states
WebSocketWrapper.prototype.CONNECTING = 0;
WebSocketWrapper.prototype.OPEN = 1;
WebSocketWrapper.prototype.CLOSING = 2;
WebSocketWrapper.prototype.CLOSED = 3;

// wrap readyState
Object.defineProperty(WebSocketWrapper.prototype, 'readyState', {
	enumerable: true,
	get: function () {
		return this._socket ? this._socket.readyState : this.CLOSED;
	}
});

WebSocketWrapper.prototype.send = function WebSocketWrapper_send(msg) {
	if (this.readyState !== this.OPEN) {
		if (!this._buffering)
			throw new Error('Sending message on a closed socket');
		return this._buffered.push(msg);
	}
	this._send(msg);
};

/**
 * Connect the websocket and hook up the events
 */
WebSocketWrapper.prototype.connect = function WebSocketWrapper_connect() {
	// maybe close and re-open?
	if (this.readyState === this.OPEN)
		return;

	var self = this;
	var socket;
	try {
		socket = new ws(this.url);
	}
	catch (err) {
		return setTimeout(function(){
			self.emit('error', err);
		}, 0);
	}

	socket.onmessage = function (message) { self.emit('message', message.data); };
	socket.onopen = function () {
		self._buffered.forEach(function (msg) {
			self._send.call(self, msg);
		});
		self.emit('open');
	};
	socket.onclose = function () { self.emit('close'); };
	socket.onerror = function (err) { self.emit('error', err); };

	this._socket = socket;
	this._send = socket.send.bind(socket);
};

