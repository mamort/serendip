Serendip.DateFacet = (function (serendip) {
    var my = Serendip.Facet(serendip);

    my.facetType = "date";
    my.dateStart = null;
    my.dateEnd = null;
    my.dateGap = null;
    my.dateFormat = null;
    my.sortDir = "asc";

    my.getQuery = function () {
        var query = "facet.date={!ex=" + my.id + ", key=" + my.id + "}" + my.name;

        query = my.applyOption(query, "date.start", my.dateStart);
        query = my.applyOption(query, "date.end", my.dateEnd);
        query = my.applyOption(query, "date.gap", my.dateGap);

        return query;
    };

    my.getActiveQueryValue = function (value) {
        return "[" + value + "] ";
    };

    my.getFacetValue = function (value) {
        return value.from + " TO " + value.to;
    };

    my.getFormattedValue = function (value) {
        var from = Serendip.Utils.formatISODate(value.from, my.dateFormat);
        var to = Serendip.Utils.formatISODate(value.to, my.dateFormat);
        return from + " - " + to;
    };

    my.parseActiveFacetValue = function (activeValue) {
        var value = my.parseActiveValue(activeValue);
        if (value != "") {
            return Serendip.Utils.splitSolrMultiValue(value);
        }

        return [];
    };

    my.processActive = function (value) {
        var facetDateStr = value.split(" TO ");
        var fromDate = facetDateStr[0];
        var toDate = facetDateStr[1];

        var dateValue = {
            from: fromDate,
            to: toDate
        };
        var formattedValue = my.getFormattedValue(dateValue);

        var encodedValue = encodeURIComponent(value);
        return my.processActiveField(encodedValue, formattedValue);
    };


    my.process = function (data) {
        var facetdates = data.facet_counts.facet_dates;
        var dates = facetdates[my.id];
        var values = [];

        for (var key in dates) {
            if (key != "gap" && key != "end" && key != "start") {
                values.push(key);
                values.push(dates[key]);
            }
        }

        var end = dates["end"];

        var facetValues = [];

        var k;
        if (my.sortDir == "asc") {
            for (k = 0; k < values.length; k += 2) {
                processDateFacetValue(end, values, k, facetValues);
            }
        } else {

            for (k = values.length - 2; k > -1; k -= 2) {
                processDateFacetValue(end, values, k, facetValues);
            }
        }

        return facetValues;
    };

    function processDateFacetValue(end, values, k, facetValues) {
        var value = values[k];
        var count = values[k + 1];

        var dateFacet = {};
        dateFacet.from = value;

        if (k + 2 < values.length) {
            dateFacet.to = values[k + 2];
        } else {
            dateFacet.to = end;
        }

        facetValues.push(dateFacet);
        facetValues.push(count);
    };

    return my;

});