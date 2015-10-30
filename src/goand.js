class Request {
    constructor(baseUrl, method, params, payload) {
        this.xhr = new XMLHttpRequest();
        this.baseUrl = baseUrl;
        this.path = undefined;
        this.params = params;
        this.payload = payload;
        this.method = method;
    }
    at(path) {
        this.path = path || "";
        return this.execute();
    }
    execute() {
        const url = Request.interpolate(this.baseUrl + this.path, this.params) + Request.buildParamString(this.params);
        return new Promise((resolve, reject) => {
            this.xhr.open(this.method.toUpperCase(), url);
            this.xhr.onreadystatechange = function(event) {
                if (event.target.readyState === 4) {
                    var result = Request.fromJson(event.target.responseText);
                    if (event.target.status === 200) {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                }
            };
            if (["post", "put"].indexOf(this.method) > -1) {
                this.xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            }
            const data = (this.payload !== undefined) ? Request.toJson(this.payload) : "";
            this.xhr.send(data);
        });
    }
    static buildParamString(params) {
        let paramString = "";
        if (params != undefined && Object.keys(params).length > 0) {
            paramString = "?";
            if (typeof params == "object") {
                for (var key in params) {
                    if (paramString != "?") {
                        paramString += "&";
                    }
                    paramString += key + "=" + encodeURIComponent(params[key]);
                }
            } else {
                paramString += params;
            }
        }
        return paramString;
    }
    static interpolate(url, params) {
        if (typeof params == "object") {
            for (var key in params) {
                const find = "{" + key + "}";
                if (url.indexOf(find) > -1) {
                    url = url.replace(find, params[key]);
                }
                delete params[key];
            }
        }
        return url;
    }
    static toJson(obj) {
        let str = "";
        if (typeof obj == "object") {
            try {
                str = JSON.stringify(obj);
            } catch (e) {
                console.error("Invalid JSON object provided. ");
            }
        }
        return str;
    }
    static fromJson(str) {
        let obj = null;
        if (typeof str == "string") {
            try {
                obj = JSON.parse(str);
            } catch (e) {
                console.error("Invalid JSON string provided. ");
            }
        }
        return obj;
    }
}

class JpRequest {
    static count;
    constructor(baseUrl, params) {
        if (isNaN(JpRequest.count++)) {
            JpRequest.count = 0;
        }
        this.baseUrl = baseUrl;
        this.path = undefined;
        this.params = params;
    }
    at(path) {
        this.path = path;
        return this.execute();
    }
    execute() {
        const timeout = 5000;
        let url = this.baseUrl + this.path + Request.buildParamString(this.params);
        return new Promise((resolve, reject) => {
            let callback = '__callback' + JpRequest.count++;
            const timeoutId = window.setTimeout(() => {
                reject(new Error('Request timeout.'));
            }, timeout);
            window[callback] = response => {
                window.clearTimeout(timeoutId);
                resolve(Request.fromJson(response));
            };
            const script = document.createElement('script');
            script.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + callback;
            script.onload = () => {
                script.remove();
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }
}

export class GoAnd {
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
    getJson(params) {
        return new JpRequest(this.baseUrl, params);
    }
    post(payload, params) {
        return new Request(this.baseUrl, "post", params, payload);
    }
    put(payload, params) {
        return new Request(this.baseUrl, "put", params, payload);
    }
    delete(params) {
        return new Request(this.baseUrl, "delete", params);
    }
}