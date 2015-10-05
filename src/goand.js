class Request {
    static config;
    constructor(method, params) {
        this.xhr = new XMLHttpRequest();
        this.url = undefined;
        this.params = params;
        this.method = method;
    }
    setUrl(url) {
        "use strict";
        this.url = url;
    }
    now() {
        "use strict";
        console.log(Request.config);
        let url = this.url;
        if (this.params != undefined) {
            if (typeof this.params == "object") {
                for (var key in this.params) {
                    if (url != "") {
                        url += "&";
                    }
                    url += key + "=" + encodeURIComponent(this.params[key]);
                }
            } else {
                url += this.params;
            }
        }
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

class Get extends Request {
    constructor(params) {
        super("get", params);
        return this;
    }
    at(url) {
        "use strict";
        console.log(url);
        super.setUrl(url);
        return this;
    }
}

class GoAnd {
    constructor(config) {

    }
}

//class Post extends Request {
//    constructor(data) {
//        super("post");
//        return this;
//    }
//    at(url) {
//        "use strict";
//        super.url = url;
//        return this;
//    }
//}

var GoAnd = function(config) {
    Request.config = config;
    return {
        'get': function (params) {
            "use strict";
            return new Get(params);
        }
    };
};