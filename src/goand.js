class Request {
    constructor(baseUrl, method, params) {
        this.xhr = new XMLHttpRequest();
        this.baseUrl = baseUrl;
        this.path = undefined;
        this.params = params;
        this.method = method;
    }
    at(path) {
        this.path = path;
        return this;
    }
    now() {
        console.log("BASE: ", this.baseUrl);
        console.log("PATH: ", this.path);
        let paramString = "?";
        if (this.params != undefined) {
            if (typeof this.params == "object") {
                for (var key in this.params) {
                    if (paramString != "?") {
                        paramString += "&";
                    }
                    paramString += key + "=" + encodeURIComponent(this.params[key]);
                }
            } else {
                paramString += this.params;
            }
        }
        let url = this.baseUrl + this.path + paramString;
        console.log(url);
        return new Promise((resolve, reject) => {
            this.xhr.open(this.method.toUpperCase(), url);
            this.xhr.onreadystatechange = function(event) {
                if (event.target.readyState === 4) {
                    try {
                        var result = JSON.parse(event.target.responseText);
                    } catch(e) {
                        throw new Error("Unable to process response as JSON");
                    }
                    if (event.target.status === 200) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                }
            };
            this.xhr.send();
        });
    }
}

class GoAnd {
    constructor(baseUrl, config) {
        this.baseUrl = baseUrl || "";
        this.format = "";
        if (config != undefined) {
            this.format = config.format || "";
        }
        return this;
    }
    get(params) {
        return new Request(this.baseUrl, "get", params);
    }
    //static post(params) {
    //    return new Get(params);
    //}
    //static put(params) {
    //    return new Get(params);
    //}
    //static delete(params) {
    //    return new Get(params);
    //}
}