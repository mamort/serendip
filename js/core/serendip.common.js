
/* 
* The follwing ISODate code was found here:
* http://stackoverflow.com/questions/498578/how-can-i-convert-a-date-value-in-utc-format-to-a-date-object-in-javascript
*/
var ISODate = {
    convert: function (input) {
        if (!(typeof input === "string")) throw "ISODate, convert: input must be a string";
        var d = input.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(([+-])(\d{2}):(\d{2})))$/i);
        if (!d) throw "ISODate, convert: Illegal format";
        return new Date(
                Date.UTC(d[1], d[2] - 1, d[3], d[4], d[5], d[6] | 0, (d[6] * 1000 - ((d[6] | 0) * 1000)) | 0, d[7]) +
                (d[7].toUpperCase() === "Z" ? 0 : (d[10] * 3600 + d[11] * 60) * (d[9] === "-" ? 1000 : -1000))
        );
    },

    format: function (t, utc) {
        if (typeof t === "string") t = this.convert(t);
        if (!(t instanceof Date)) throw "ISODate, format: t is not a date object";
        t = utc ?
                [t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), t.getUTCHours(), t.getUTCMinutes(), t.getUTCSeconds()] :
                [t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds()];

        return this.month[t[1]] + " " + this.ordinal(t[2]) + ", " + t[0] +
                " @ " + this.clock12(t[3], t[4]);
    }

};

/* General purpose functions */
String.prototype.trim = function () { return this.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };
String.prototype.startsWith = function (str) { return (this.match("^" + str) == str) }
String.prototype.endsWith = function (str) { return (this.match(str + "$") == str) }

function isArray(testObject) {
    return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
}

function convertIsoDate(inputDate, format) {
    var formattedDate = "";
    try {
        var date = ISODate.convert(inputDate);
        formattedDate = date.format(format);
    } catch(ex) {
        formattedDate = "Could not parse date: " + inputDate;
    }

    return formattedDate;
}

/* Start Serendip library */
var Serendip = function () { };

Serendip.Class = function () { 
    $.extend(this, Simple.Events);
    
    if(typeof init2 == 'function'){

    }
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
            queryParams[split[i] + postfix] = split[i+1];
        }        

        return queryParams;
    },

    isArray: function (obj) {
        return obj.constructor == Array;
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