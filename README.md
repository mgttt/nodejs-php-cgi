# nodejs-php-cgi

```
pm2 => app.js*n => php-cgi-pool*n => php-router-controller(n*m)
```

# TODO

* add routing/plugin support
* pooling and threshold-control
* performance improve
* codes clean up

# reference 

* http://blog.milkfarmsoft.com/2006/06/fastcgi-in-php-the-way-it-could-be/
* https://github.com/sihorton/node-php-cgi/blob/master/index.js
* https://github.com/hushicai/node-phpcgi
* https://github.com/fgnass/gateway
* https://github.com/thomasdondorf/phantomjs-pool
