
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

/* Start Serendip library */
var Serendip = function () { };

Serendip.Class = function () { };

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

    getFacetsAsQueryString: function (facets) {
        var query = "";

        for (var i = 0; i < facets.length; i++) {
            var facet = facets[i];
            var name = facet.name;
            var type = facet.facetType;

            if (type == "text") {
                query += "facet.field={!ex=" + facet.id + "}" + name;

            } else if (type == "range") {
                query += "facet.range={!ex=" + facet.id + "}" + name;
                var datekey = "&f." + name + ".facet.range";
                query += datekey + ".start=" + encodeURIComponent(facet.rangeStart);
                query += datekey + ".end=" + encodeURIComponent(facet.rangeEnd);
                query += datekey + ".gap=" + encodeURIComponent(facet.rangeGap);

            } else if (type == "query") {
                var len = facet.queries.length;
                for (var k = 0; k < len; k++) {
                    var facetQuery = facet.queries[k];
                    query += "facet.query={!ex=" + facet.id + " key=" + facet.id + "range[" + k + "]}" + name + ":" + facetQuery.query;

                    if (k < len - 1) {
                        query += "&";
                    }
                }
            } else if (type == "date") {
                query += "facet.date={!ex=" + facets[i].id + "}" + name;
                var datekey = "&f." + name + ".facet.date";
                query += datekey + ".start=" + encodeURIComponent(facets[i].dateStart);
                query += datekey + ".end=" + encodeURIComponent(facets[i].dateEnd);
                query += datekey + ".gap=" + encodeURIComponent(facets[i].dateGap);
            }

            if (i < facets.length - 1)
                query = query + "&";
        }

        return query;
    },

    parseFacets: function (queryStr, configFacets) {

        var facets = [];
        for (var i = 0; i < configFacets.length; i++) {
            var configFacet = configFacets[i];

            var paramName = "fq={!tag=" + configFacet.id + "}";

            if (queryStr.indexOf(paramName) > 0) {
                var querySplit = queryStr.split(paramName);
                var value = querySplit[1];

                if (value.indexOf("&") > 0)
                    value = value.split("&")[0];

                var facetArr = "";
                if (value.indexOf(":(") > 0)
                    facetArr = value.split(":(");
                else
                    facetArr = value.split(":[");

                var facet = new Object();

                facet.id = configFacet.id;
                facet.name = facetArr[0];

                facet.query = paramName + value;

                if (value.indexOf(":(") > 0) {
                    facet.values = [];

                    var facetArrValues = facetArr[1].substring(0, facetArr[1].length - 1);
                    facetArrValues = facetArrValues.trim();

                    var vals = "";

                    if (configFacet.facetType == "text") {
                        vals = facetArrValues.split(/\"\s/);

                        for (var k = 0; k < vals.length; k++) {
                            var val = vals[k].replace(/\"/g, "").trim();
                            facet.values.push(val);
                        }
                    } else if (configFacet.facetType == "query") {

                        facet.values.push(facetArrValues.trim());

                    } else if (configFacet.facetType == "date") {
                        vals = facetArrValues.split("]");

                        for (var k = 0; k < vals.length; k++) {
                            var val = vals[k].replace(/\[/g, "");
                            val = val.replace(/]/g, "").trim();

                            if (val.length > 0)
                                facet.values.push(val);
                        }
                    }

                } else {
                    facet.value = facetArr[1].substring(0, facetArr[1].length - 1);
                }

                facets.push(facet);
            }

        }

        return facets;
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

Serendip.Facet = Serendip.Class.extend({
    facetType: "text",
    name: null,
    activeHeader: null,
    header: null,
    minFacetsToDisplay: null,
    maxFacetsToDisplay: null
});

/* Note: Range facets not supported yet in 1.4 */
Serendip.RangeFacet = Serendip.Facet.extend({
    facetType: "range",
    rangeStart: null,
    rangeEnd: null,
    rangeGap: null
});

Serendip.QueryFacet = Serendip.Facet.extend({
    facetType: "query",
    queries: null
});


Serendip.DateFacet = Serendip.Facet.extend({
    facetType: "date",
    dateStart: null,
    dateEnd: null,
    dateGap: null,
    dateFormat: null,
    sortDir: "asc"
});

Serendip.CustomDateFacet = Serendip.Facet.extend({
    facetType: "customdate",
    getFacetValues: function () { }
});

Serendip.CustomDateFacetValue = Serendip.Class.extend({
    name: null,
    value: null
});

Serendip.SortClickHandler = Serendip.Class.extend({
    handleSortClick: function (sortField, direction) { }
});

Serendip.FacetClickHandler = Serendip.Class.extend({
    handleFacetClick: function (name, value, isActive) { }
});

Serendip.PagingClickHandler = Serendip.Class.extend({
    handlePagingClick: function (page) { }
});

Serendip.SuggestClickHandler = Serendip.Class.extend({
    handleSuggestClick: function (suggestion) { }
});

Serendip.AutocompleteClickHandler = Serendip.Class.extend({
    handleAutocompleteClick: function () { }
});