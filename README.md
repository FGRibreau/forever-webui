# Forever Web UI [![Build Status](https://secure.travis-ci.org/FGRibreau/forever-webui.png)](http://travis-ci.org/FGRibreau/forever-webui) [![Gittip](http://badgr.co/gittip/fgribreau.png)](https://www.gittip.com/fgribreau/)

Console, for an efficient NodeJS administration.

![Login Page](http://f.cl.ly/items/0g2f2u2C3M1W2Q1J2s2i/LoginScreen.png)

![Forever Console](http://f.cl.ly/items/2d3F121B261d0H1z0t1N/ForeverConsole.png)

## Installation

### Via npm (node package manager)

``` bash
    npm install forever-webui && sudo node node_modules/forever-webui/app.js
```

and browse ```http://127.0.0.1:8085```

#### Via Git + NPM

``` bash
    git clone https://github.com/FGRibreau/forever-webui.git
    cd forever-webui/
    npm install
    sudo npm start
```

and browse ```http://127.0.0.1:8085```

## Usage

Start NodeJS processes with forever cli and manage them via a web interface.

** Please note that you need to start Forever Console via sudo, 
because if you are planning to run node processes thru sudo,
they will be visible to forever, via sudo only. [\[1\]][1]

## Run Tests

``` bash
    npm install && npm test
```

## Clean

``` bash
    npm clean
```

## To Do

* Starting process directly from the web interface: In-Progress
* Save the last X processes stopped via the web for later restart: In-Progress

## Donate
[Donate Bitcoins](https://coinbase.com/checkouts/fc3041b9d8116e0b98e7d243c4727a30)

### Licence

Copyright (c) 2011, Francois-Guillaume Ribreau <node@fgribreau.com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  - Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.

  - Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  - Neither the name of forever-webui nor the names of its contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

#### Author: [Francois-Guillaume Ribreau][0]

[0]: http://fgribreau.com
[1]: https://github.com/nodejitsu/forever/issues/88#issuecomment-1613309
