Serendip.Utils = (function () {
    var my = {};
    
    my.formatISODate = function (inputDate, format) {
        var formattedDate = "";
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

    return my;
}());