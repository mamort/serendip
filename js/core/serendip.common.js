var Serendip = (function () {
    var my = {};
    
    function myPrivate(){
        
    }
    
    my.anotherMethod1 = function () {
        alert("1");
    };

    return my;
}());

var Serendip = Serendip ? Serendip : {};

var Serendip = (function (my) {
    my.anotherMethod2 = function () {
        alert("2");
    };

    return my;
}(Serendip));

/* General purpose functions */
String.prototype.trim = function () { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };
String.prototype.startsWith = function (str) { return (this.match("^" + str) == str) }
String.prototype.endsWith = function (str) { return (this.match(str + "$") == str) }

/* Start Serendip library */
var Serendip = function () { };

Serendip.Class = function () { 
    $.extend(this, Simple.Events);
};

Serendip.Class.extend = function (properties) {
    var klass = this;
    var subClass = function (options) {
        Serendip.extend(this, new klass(options), properties, options);
    }
    subClass.extend = this.extend;
        
    return subClass;
};


Serendip.extend = function () {
    var target = arguments[0] || {}, i = 1, length = arguments.length, options;
    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (var name in options) {
                var src = target[name], copy = options[name];
                if (target === copy) {
                    continue;
                }
                if (copy && typeof copy == 'object' && !copy.nodeType) {
                    target[name] = Serendip.extend(src || (copy.length != null ? [] : {}), copy);
                }
                else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
};

Serendip.Core = Serendip.Class.extend({

    search: null,

    getParamsAsQueryString: function (params) {
        var query = "";

        for (var i = 0; i < params.length; i++) {
            query = query + params[i];
            if (i < params.length - 1)
                query = query + "&";
        }

        return query;
    },

    parseParam: function (queryStr, name) {
        var startIndex = queryStr.indexOf(name);

        if (startIndex != -1) {
            var endIndex = queryStr.indexOf("&", startIndex);

            if (endIndex == -1) {
                endIndex = queryStr.length;
            }

            return queryStr.substring(startIndex + name.length, endIndex);
        }

        return "";
    },

    parseQueryToMap: function (queryStr, postfix) {
        var split = queryStr.split("&");

        var queryParams = [];

        for (var i = 0; i < split.length; i++) {
            var params = split[i].split("=");
            queryParams[params[0] + postfix] = params[1];
        }
        
        split = queryStr.replace("!/", "").split("/");

        for (var i = 0; i < split.length-1; i+=2) {
            var key = split[i] + postfix;
            var value = split[i+1];
            queryParams[key] = value;
        }        

        return queryParams;
    }

});

Serendip.SortField = Serendip.Class.extend({
    name: null,
    header: null
});

Serendip.Term = Serendip.Class.extend({
    value: null,
    count: null
});