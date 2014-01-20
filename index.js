/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

module.exports = process.env.WS_BUFFERING_COV
	? require('./lib-cov')
	: require('./lib');
