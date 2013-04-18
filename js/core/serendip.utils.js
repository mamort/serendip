Serendip.Utils = (function () {
    var my = {};
    
    if (!browserSupportsISODates()) {
        my.parseISODate = function (s) {
            var day, tz,
            rx = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
            p = rx.exec(s) || [];
            if (p[1]) {
                day = p[1].split(/\D/);
                for (var i = 0, L = day.length; i < L; i++) {
                    day[i] = parseInt(day[i], 10) || 0;
                }
                day[1] -= 1;
                day = new Date(Date.UTC.apply(Date, day));
                if (!day.getDate()) return NaN;
                if (p[5]) {
                    tz = (parseInt(p[5], 10) * 60);
                    if (p[6]) tz += parseInt(p[6], 10);
                    if (p[4] == '+') tz *= -1;
                    if (tz) day.setUTCMinutes(day.getUTCMinutes() + tz);
                }
                return day;
            }
            return NaN;
        };
    }
    else {
        my.parseISODate = function (s) {
            return new Date(s);
        };
    }

    my.formatISODate = function (inputDate, format) {
        var formattedDate;
        try {
            var date = my.convertISOFormatToDate(inputDate);
            formattedDate = date.format(format);
        } catch(ex) {
            formattedDate = "Could not parse date: " + inputDate;
        }
    
        return formattedDate;
    };
    
    my.convertISOFormatToDate = function (input) {
        // http://stackoverflow.com/questions/498578/how-can-i-convert-a-date-value-in-utc-format-to-a-date-object-in-javascript
        if (!(typeof input === "string")) throw "ISODate, convert: input must be a string";
        var d = input.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(([+-])(\d{2}):(\d{2})))$/i);
        if (!d) throw "ISODate, convert: Illegal format";
        return new Date(
                Date.UTC(d[1], d[2] - 1, d[3], d[4], d[5], d[6] | 0, (d[6] * 1000 - ((d[6] | 0) * 1000)) | 0, d[7]) +
                (d[7].toUpperCase() === "Z" ? 0 : (d[10] * 3600 + d[11] * 60) * (d[9] === "-" ? 1000 : -1000))
        );
    };
    
    my.isArray = function(testObject) {
        return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
    };
    
    my.trim = function(str1){
        return str1.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
    
    my.splitSolrMultiValue = function(multiValue){
        var parsedValues = [];
        var vals = multiValue.split("]");

        for (var k = 0; k < vals.length; k++) {
            var val = vals[k].replace(/\[/g, "");
            val = val.replace(/]/g, "");
            val = my.trim(val);

            if (val.length > 0) {
                parsedValues.push(val);
            }
        }
        
        return parsedValues;
    };
    
    my.setupEvents = function(obj){
        obj.on = Serendip.Events.on;
        obj.trigger = Serendip.Events.trigger;
    };
    
    // parseUri 1.2.2
    // (c) Steven Levithan <stevenlevithan.com>
    // MIT License

    my.parseUri = function(str) {
        var o = my.parseUri.options,
            m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
            uri = {},
            i = 14;

        while (i--) uri[o.key[i]] = m[i] || "";

        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
            if ($1) uri[o.q.name][$1] = $2;
        });

        return uri;
    };

    my.parseUri.options = {
        strictMode: false,
        key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    };

    function browserSupportsISODates() {
        var D = new Date('2011-06-02T09:34:29+02:00');
        if (isNaN(D) || D.getUTCMonth() !== 5 || D.getUTCDate() !== 2 ||
            D.getUTCHours() !== 7 || D.getUTCMinutes() !== 34) {
            return false;
        }

        return true;
    };


    return my;
}());