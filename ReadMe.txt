Running: npm install from inside your app directory (i.e. where package.json is located) will install the dependencies
for your app in ./node_modules relative to your package.json file.

After adding nconf you should add environment variable NODE_PATH=.    //(dot) means current dir
After adding winston you should add environment variable NODE_ENV=development    //also used for error handling middleware