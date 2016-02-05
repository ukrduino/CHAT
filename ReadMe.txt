Running: npm install from inside your app directory (i.e. where package.json is located) will install the dependencies
for your app in ./node_modules relative to your package.json file.

After adding nconf you should add environment variable NODE_PATH=.    //(dot) means current dir
After adding winston you should add environment variable NODE_ENV=development    //also used for error handling middleware

MongoDB instalation http://devcolibri.com/2091
add to path MongoDB directory (f.e."c:\Program Files\MongoDB\Server\3.2\bin\")
create dirs as in mongo.config file

If you need install native MongoDB driver for node.js
npm install mongodb --save (AS ADMINISTRATOR)