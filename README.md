#A VERY basic HTTP client written with ES2015

This very simple client supports basic REST operations including JSONP for JSON data only. The ES2015 code has been transpiled and packaged into a SystemJS module using Babel 6.0. Check out the `.babelrc` file for details.

#Usage

Take a look at `src/example.js` for the following code.

```javascript
import {GoAnd} from 'goand.js';

var Petstore = new GoAnd("http://petstore.swagger.io/v2");

Petstore.get({"status": "sold"}).at("/pet/findByStatus").then(function(response){
    console.log("GET: ", response);
}).catch(function(error){
    console.error("ERROR: ", error);
});

new GoAnd("http://jsfiddle.net/echo").getJson().at("/jsonp").then(function(response){
    console.log("JSONP: ", response);
}).catch(function(error){
    console.error("ERROR: ", error);
});

var myPet = {
    "id": 0,
    "category": {
        "id": 0,
        "name": "string"
    },
    "name": "Leon's Pet",
    "photoUrls": [
        "string"
    ],
    "tags": [
        {
            "id": 0,
            "name": "string"
        }
    ],
    "status": "available"
};

Petstore.post(myPet).at("/pet").then(function(response){
    console.log("POST: ", response);
}).catch(function(error){
    console.error("ERROR: ", error);
});

var myPetUpdated = {
    "id": 0,
    "category": {
        "id": 0,
        "name": "string"
    },
    "name": "Leon's Pet",
    "photoUrls": [
        "string"
    ],
    "tags": [
        {
            "id": 0,
            "name": "string"
        }
    ],
    "status": "sold"
};

Petstore.put(myPetUpdated).at("/pet").then(function(response){
    console.log("PUT: ", response);
}).catch(function(error){
    console.error("ERROR: ", error);
});

Petstore.delete({id: 1}).at("/pet/{id}").then(function(response){
    console.log("DELETE: ", response);
}).catch(function(error){
    console.error("ERROR: ", error);
});
```

#Running

To see the client working, clone this repo and simple open `index.html` with the JavaScript console open.