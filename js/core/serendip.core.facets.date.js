Serendip.DateFacet = (function (serendip) {
    var my = Serendip.Facet(serendip);
    
    my.facetType = "date";
    my.dateStart = null;
    my.dateEnd = null;
    my.dateGap = null;
    my.dateFormat = null;
    my.sortDir = "asc";

    my.getQuery = function() {
        var query = "facet.date={!ex=" + my.id + "}" + my.name;
        var key = "&f." + my.name + ".facet.date";
        query += key + ".start=" + encodeURIComponent(my.dateStart);
        query += key + ".end=" + encodeURIComponent(my.dateEnd);
        query += key + ".gap=" + encodeURIComponent(my.dateGap);
        
        return query;
    };
    
    my.getActiveQueryValue = function(value){
        return "[" + value + "] ";
    };
    
    my.getFacetValue = function(value){
        return value.from + " TO " + value.to;
    };
    
    my.getFormattedValue = function(value) {
        var from = Serendip.Utils.formatISODate(value.from, my.dateFormat);
        var to = Serendip.Utils.formatISODate(value.to, my.dateFormat);
        return from + " - " + to;
    };
    
    my.parseActiveFacetValue = function(activeValue){
        var value = my.parseActiveValue(activeValue);
        if(value != ""){
            return Serendip.Utils.splitSolrMultiValue(value);
        }
        
        return [];
    };    

    my.processActive = function(value) {
        var facetDateStr = value.split(" TO ");
        var fromDate = facetDateStr[0];
        var toDate = facetDateStr[1];

        var dateValue = {
            from : fromDate,
            to : toDate
        };
        var formattedValue = my.getFormattedValue(dateValue);

        var encodedValue = encodeURIComponent(value);
        return my.processActiveField(encodedValue, formattedValue);
    };

    my.process = function(data) {
        var facetdates = data.facet_counts.facet_dates;
        var dates = facetdates[my.name];
        var values = [];

        for (var key in dates) {
            if (key != "gap" && key != "end") {
                values.push(key);
                values.push(dates[key]);
            }
        }

        var facetValues = [];

        if (my.sortDir == "asc") {
            for (var k = 0; k < values.length; k += 2) {
                processDateFacetValue(values, k, facetValues, dates, "asc");
            }
        } else {

            for (var k = values.length - 2; k > -1; k -= 2) {
                processDateFacetValue(values, k, facetValues, dates, "desc");
            }
        }

        return facetValues;
    };

    function processDateFacetValue(values, k, facetValues, dates, type) {
        var value = values[k];
        var count = values[k + 1];

        var dateFacet = {};
        dateFacet.from = value;

        var gapDays = getGapAsDays(dates["gap"]);

        // Must use GAP to calculate end date from start date here
        var isoDateStr = formatIsoDateWithGap(dateFacet.from, gapDays);

        if (k + 2 < values.length) {
            dateFacet.to = values[k + 2];
        }else{
            dateFacet.to = isoDateStr;
        }

        facetValues.push(dateFacet);
        facetValues.push(count);
    };

    function formatIsoDateWithGap(inputDate, gapDays) {
        var isoDateStr = "";
        try {
            var date = Serendip.Utils.convertISOFormatToDate(inputDate);
            date.setDate(date.getDate() + gapDays);

            isoDateStr = date.format("isoDateTime") + "Z";
        } catch(ex) {
            isoDateStr = "Could not parse date: " + inputDate;
        }

        return isoDateStr;
    };

    function convertIsoDate(inputDate, format) {
        var formattedDate = "";
        try {
            var date = Serendip.Utils.convertISOFormatToDate(inputDate);
            formattedDate = date.format(format);
        } catch(ex) {
            formattedDate = "Could not parse date: " + inputDate;
        }

        return formattedDate;
    };

    function getGapAsDays(gap) {
        var modifier = 1;
        var dayModifier = 1;
        var days = 0;

        if (gap[0] == "-")
            modifier = -1;

        if (gap.match("YEARS")) {
            days = gap.substring(1, gap.length - 5);
            dayModifier = 365;
        }

        if (gap.match("MONTHS")) {
            days = gap.substring(1, gap.length - 6);
            dayModifier = 30;
        }

        if (gap.match("DAYS")) {
            days = gap.substring(1, gap.length - 4);
        }

        if (gap.match("YEAR")) {
            days = gap.substring(1, gap.length - 4);
            dayModifier = 365;
        }

        if (gap.match("MONTH")) {
            days = gap.substring(1, gap.length - 5);
            dayModifier = 30;
        }

        if (gap.match("DAY")) {
            days = gap.substring(1, gap.length - 3);
        }

        days = parseInt(days);

        return days * modifier * dayModifier;
    };
    
    return my;
    
}); 