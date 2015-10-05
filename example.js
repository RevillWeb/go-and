console.log("=== GoAnd EXAMPLE ===");
GoAnd({"format": "form"}).get().at("http://petstore.swagger.io/v2/swagger.json").now().then(function(response){
    console.log(response);
}).catch(function(response){
    console.log(response);
});