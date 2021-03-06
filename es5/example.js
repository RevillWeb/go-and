"use strict";

System.register(["goand.js"], function (_export) {
    var GoAnd, Petstore, myPet, myPetUpdated;
    return {
        setters: [function (_goandJs) {
            GoAnd = _goandJs.GoAnd;
        }],
        execute: function () {
            Petstore = new GoAnd("http://petstore.swagger.io/v2");
            Petstore.get({
                "status": "sold"
            }).at("/pet/findByStatus").then(function (response) {
                console.log("GET: ", response);
            }).catch(function (error) {
                console.error("ERROR: ", error);
            });
            new GoAnd("http://jsfiddle.net/echo").getJson().at("/jsonp").then(function (response) {
                console.log("JSONP: ", response);
            }).catch(function (error) {
                console.error("ERROR: ", error);
            });
            myPet = {
                "id": 0,
                "category": {
                    "id": 0,
                    "name": "string"
                },
                "name": "Leon's Pet",
                "photoUrls": ["string"],
                "tags": [{
                    "id": 0,
                    "name": "string"
                }],
                "status": "available"
            };
            Petstore.post(myPet).at("/pet").then(function (response) {
                console.log("POST: ", response);
            }).catch(function (error) {
                console.error("ERROR: ", error);
            });
            myPetUpdated = {
                "id": 0,
                "category": {
                    "id": 0,
                    "name": "string"
                },
                "name": "Leon's Pet",
                "photoUrls": ["string"],
                "tags": [{
                    "id": 0,
                    "name": "string"
                }],
                "status": "sold"
            };
            Petstore.put(myPetUpdated).at("/pet").then(function (response) {
                console.log("PUT: ", response);
            }).catch(function (error) {
                console.error("ERROR: ", error);
            });
            Petstore.delete({
                id: 1
            }).at("/pet/{id}").then(function (response) {
                console.log("DELETE: ", response);
            }).catch(function (error) {
                console.error("ERROR: ", error);
            });
        }
    };
});