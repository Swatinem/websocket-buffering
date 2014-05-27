# WebSocket-Buffering

small wrapper around websocket that does message buffering and reconnects

[![Build Status](https://travis-ci.org/Swatinem/websocket-buffering.png?branch=master)](https://travis-ci.org/Swatinem/websocket-buffering)
[![Coverage Status](https://coveralls.io/repos/Swatinem/websocket-buffering/badge.png?branch=master)](https://coveralls.io/r/Swatinem/websocket-buffering)
[![Dependency Status](https://gemnasium.com/Swatinem/websocket-buffering.png)](https://gemnasium.com/Swatinem/websocket-buffering)

This is heavily inspired by [stagas/websocket](https://github.com/stagas/websocket)
for the client side, but does the same wrapping for [ws](https://github.com/einaros/ws)
in node as well, to provide the same api.

Buffers messages and sends them once the connection has been established.
Also offers a `.connect()` method to re-establish a broken connection.

## Installation

    $ npm install websocket-buffering
    $ component install Swatinem/websocket-buffering

## Usage

### new WebSocketBuffering(url, [options])

Creates a new WebSocket connection to `url`.
If `options.connect` is set to `false`, it will not automatically connect
If `options.buffering` is set to `false`, it will throw when sending on a closed
socket instead of buffering and sending once the socket is open.

### ws.readyState

This is the readyState as defined by WebSocket. `ws.OPEN` and so on.

### ws.send(data)

Send data down the wire, or buffer it to be sent once the connection is actually
open.

### ws.connect()

This opens up a new connection when it is not open yet. Does nothing otherwise.

### Event: 'open'

### Event: 'error' (err)

### Event: 'message' (message)

### Event: 'close'

## License

  LGPLv3

  Released as free software as part of [ChatGrape](https://chatgrape.com/)

