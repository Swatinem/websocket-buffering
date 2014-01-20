/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
/* global WebSocket:true */
"use strict";

var should = require('should');

var WebSocket = require('ws');
var WSBuffering = require('../');

describe('WebSocketBuffering', function () {
	var wss = new WebSocket.Server({port: 8080});
	it('should emit errors on wrong url format', function (done) {
		var client = new WSBuffering('wrongurl');
		client.on('error', function (err) {
			should.exist(err);
			done();
		});
	});
	it('should work just fine when connected', function (done) {
		var client = new WSBuffering('ws://localhost:8080');
		wss.once('connection', function (ws) {
			ws.on('message', function (msg) {
				msg.should.eql('foobar');
				done();
			});
		});
		client.on('open', function () {
			client.send('foobar');
		});
	});
	it('should noop when reconnecting an open connection', function (done) {
		var client = new WSBuffering('ws://localhost:8080');
		var count = 0;
		wss.on('connection', function () {
			if (++count === 2)
				should.fail();
		});
		client.on('open', function () {
			client.connect();
			setTimeout(function () {
				wss.removeAllListeners('connection');
				done();
			}, 10);
		});
	});
	it('should send buffered the messages after it connects', function (done) {
		wss.once('connection', function (ws) {
			ws.close();
		});
		var client = new WSBuffering('ws://localhost:8080');
		client.on('close', function () {
			client.send('foo');
			client.send('bar');
			wss.once('connection', function (ws) {
				var count = 0;
				ws.on('message', function (msg) {
					switch (count++) {
						case 0:
							msg.should.eql('foo');
						break;
						case 1:
							msg.should.eql('bar');
							done();
						break;
					}
				});
			});
			client.connect();
		});
	});
	it('should optionally not connect by default', function () {
		var wss = new WebSocket.Server({port: 8081});
		wss.once('connection', function () {
			should.fail();
		});
		new WSBuffering('ws://localhost:8081', {connect: false});
	});
	it('should optionally not buffer', function (done) {
		var client = new WSBuffering('ws://localhost:8080', {connect: false, buffering: false});
		(function () {
			client.send('foo');
		}).should.throw();
		wss.once('connection', function (ws) {
			done();
			ws.on('message', function (msg) {
				should.not.exist(msg);
			});
		});
		client.connect();
	});
});

