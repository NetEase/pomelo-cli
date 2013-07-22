pomelo-cli
========

pomelo-cli is a command-line library for [pomelo](https://github.com/NetEase/pomelo) maintenance.  
you can use pomelo-cli to connect to pomelo master and do lots of things.

##Installation
```
npm install -g pomelo-cli
```
##Usage
use pomelo-cli to connect to pomelo master  

```
pomelo-cli -h host -p port -u user -P password  
```  

default type pomelo-cli equals to  

```  
pomelo-cli -h 127.0.0.1 -p 3306 -u admin -P admin 
```  

then it will come to a repl mode, type help for help information  
enjoy with it  
![pomelo-cli help](http://ww1.sinaimg.cn/large/6a98ae6cgw1e6vq59xoihj20j60f3tb5.jpg)

## License

(The MIT License)

Copyright (c) 2012-2013 NetEase, Inc. and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.