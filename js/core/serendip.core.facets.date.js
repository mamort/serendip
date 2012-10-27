Serendip.DateFacetCore = Serendip.Class.extend({
    
   processDateFacet : function(data, facet) {
        var facetdates = data.facet_counts.facet_dates;
        var dates = facetdates[facet.name];
        var values = [];

        for (var key in dates) {
            if (key != "gap" && key != "end") {
                values.push(key);
                values.push(dates[key]);
            }
        }

        var facetValues = [];

        if (facet.sortDir == "asc") {
            for (var k = 0; k < values.length; k += 2) {
                this.processDateFacetValue(values, k, facetValues, dates, "asc");
            }
        } else {
            for (var k = values.length - 2; k > -1; k -= 2) {
                this.processDateFacetValue(values, k, facetValues, dates, "desc");
            }
        }

        return facetValues;
    },

    processDateFacetValue : function(values, k, facetValues, dates, type) {
        var value = values[k];
        var count = values[k + 1];

        var dateFacet = new Object();
        dateFacet.from = value;

        var gapDays = this.getGapAsDays(dates["gap"]);

        // Must use GAP to calculate end date from start date here
        var isoDateStr = this.formatIsoDateWithGap(dateFacet.from, gapDays);

        if (type == "asc") {
            if (k + 2 < values.length) {
                dateFacet.to = values[k + 2];
            } else {
                dateFacet.to = isoDateStr;
            }
        } else {
            dateFacet.to = isoDateStr;
        }

        facetValues.push(dateFacet);
        facetValues.push(count);
    },

    formatIsoDateWithGap : function(inputDate, gapDays) {
        var isoDateStr = "";
        try {
            var date = ISODate.convert(inputDate);
            date.setDate(date.getDate() + gapDays);

            isoDateStr = date.format("isoDateTime") + "Z";
        } catch(ex) {
            isoDateStr = "Could not parse date: " + inputDate;
        }

        return isoDateStr;
    },

    convertIsoDate : function(inputDate, format) {
        var formattedDate = "";
        try {
            var date = ISODate.convert(inputDate);
            formattedDate = date.format(format);
        } catch(ex) {
            formattedDate = "Could not parse date: " + inputDate;
        }

        return formattedDate;
    },

    getGapAsDays : function(gap) {
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
    } 
});