
var goAnd = new GoAnd("http://localhost:8080");

goAnd.get({"q": "test123"}).at("/list").now();
