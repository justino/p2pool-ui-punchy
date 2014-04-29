p2pool-ui-punchy
==================

Another alternative p2pool UI.
Makes use of Bootstrap, jQuery and Highcharts.
Compatible with [Standard p2pool](https://github.com/forrestv/p2pool) and [Extended p2pool](https://github.com/mmouse-/p2pool-vtc) (and any forks that pull these extensions)

Features:
- Important information at the top of the page
- Mobile friendly
- Each user can highlight their own miners through configuration stored on the local client
- Change themes with the click of a button (themes provided by: [Bootswatch.com](http://bootswatch.com))
- Chart indicates when blocks are found (merged from https://github.com/roy7/p2pool-node-status)

See Screenshots:

#### Main UI with Stock p2pool
![Main UI - Stock p2pool](/img/screenshot_stock_p2pool.png?raw=true "Main UI - Stock p2pool")

#### Main UI with Extended p2pool
![Main UI - Extended p2pool](/img/screenshot_extended_p2pool.png?raw=true "Main UI - Extended p2pool")

#### Main UI sporting graph modal
![with Graph](/img/screenshot-graph.png?raw=true "with Graph")

## Installation

### Parallel to the default web-static

To run this UI in parallel to your current p2pool web interface, do in your web-static directory:

``` Bash
git clone https://github.com/justino/p2pool-ui-punchy.git
```

### As web-static replacement

To replace your current web-static, in the top directory of your p2pool installation:

``` Bash
mv web-static web-static-original
git clone https://github.com/justino/p2pool-ui-punchy.git
ln -s p2pool-ui-punchy web-static
```

## Setup

Once you have the UI installed, you'll need to create a configuration file.
You can find the file in the `/js/` directory.
Copy the example config `config.example.json` to `config.json` and modify to fit your needs.
See the `Configuration` section below for option descriptions.

Once this is setup, you'll be able to access the UI either by:
`http://<url-to-your-p2pool>:<port>/static/p2pool-ui-punchy/` if you chose to do a parallel installation
or
`http://<url-to-your-p2pool>:<port>/static` is you chose to do a replacement installation

## Configuration

The `config.json` is found in `js` directory.
    
### On a different host

This UI can be run on a different web server as well.  The web server must then provide at least PHP in order to execute the JSONP handler.

You need to configure the host and port of your p2pool server in the config.json like

``` JavaScript
var config = {
    myself : [],
    host : "http://p2pool.org:9332",
    reload_interval : 30,
    reload_chart_interval : 600,
    header_content_url : ""
}
```

**Beware**:  The UI queries the p2pool API periodically.  This will put additional network traffic on your p2pool server.  It can, but must not, result in a higher variance!

### Highlight the pool owners addresses.

If you want your server miner addresses highlighted, adjust `myself` variable accordingly. E.g.

``` JavaScript
var config = {
    myself : [
        "195ufic8mfNrDqxgFCfmw5mQYwdu2im9G5",
        "1MzFr1eKzLEC1tuoZ7URMB7WWBMgHKimKe"
    ],
    host : "",
    reload_interval : 30,
    reload_chart_interval : 600,
    header_content_url : ""
}
```

### Point the UI to a different p2pool server

You need to configure the host and port of your p2pool server in the `host` variable like

``` JavaScript
var config = {
    myself : [],
    host : "http://p2pool.org:9332",
    reload_interval : 30,
    reload_chart_interval : 600,
    header_content_url : ""
}
```

### Load additional content onto the page

``` JavaScript
var config = {
    myself : [],
    host : "",
    reload_interval : 30,
    reload_chart_interval : 600,
    header_content_url : "cool_content.html"
}
```

**NOTE** Loading content is subject to [Same-Origin Policy](http://en.wikipedia.org/wiki/Same_origin_policy)

### Adjust the reload interval

Per default the UI updates the miner list and server stats every 30 seconds.  You can adjust the `reload_interval` variable like

``` JavaScript
var config = {
    myself : [],
    host : "",
    reload_interval : 20,
    reload_chart_interval : 1200,
    header_content_url : ""
}
```

to set it to 20 seconds for example.

`reload_chart_interval` sets the amount of seconds until the hashrate graph is reloaded.  In above example, it's configured to 1200 seconds (20 minutes).

**Beware** that each API query puts network and CPU load on your p2pool installation.  Avoid decreasing this value too much.  In my tests, 20 to 30 seconds seem to be fair enough.

## Roadmap

- Replace HighCharts with another graph lib which can still be used on nodes having a fee (nodes considered as commercial)

- Add section for recent shares and share tree in network

- More graphs for the p2pool node

- Individual address page with individual stats (more like tradition central pools, MPOS dashboard view)

## Credits & License

Justin La Sotten

Original Code forked from https://github.com/johndoe75/p2pool-node-status    
Alexander Zschach <alex@zschach.net>

### Donate

If you like this UI, find it useful, or like that people out there are writing free software for everybody to use or contribute, please donate some coins:

Bitcoin: 195ufic8mfNrDqxgFCfmw5mQYwdu2im9G5   
Litecoin: LKs7z33st7PcnB28SMQhvCpawYapTm3HxC   
Dogecoin: DLethX5AdiwkvW28KhJxZBpBV9dr2ask53    
Vertcoin: VcoAm4gEg5vLmJ4NfRwaVkv8UWEPTXMTRC   

or

If you would like to donate to the original developer:

Bitcoin: 1MzFr1eKzLEC1tuoZ7URMB7WWBMgHKimKe   
Litecoin: LSRfZJf75MtwzrbAUfQgqzdK4hHpY4oMW3   
Terracoin: 1MsuC6knLeZKHCyQ39Xcw1qcgScS1ZK5R   
Feathercoin: 6tfEE48qk8Kgs9ancC82Y2iQBSX3VGYXfL   

### License

The MIT License (MIT)

Copyright (c) 2013-2014 Alexander Zschach alex@zschach.net

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

