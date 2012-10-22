Serendip.ActiveFacetsView = Serendip.Class.extend({
    configuredFacets : null,

    view : null,
    prototype : null,

    serendip : null,
    facetCore : null,
    inactiveElement : null,

    init : function(serendip, facetCore) {
        this.serendip = serendip;
        this.facetCore = facetCore;

        this.inactiveElement = this.view.find(".inactive");
        this.inactiveElement.hide();
    },

    initFromQueryStr : function(queryStr, params) {
        this.facetCore.initFromQueryStr(queryStr);
    },

    saveInQueryStr : function(queryStr) {
        var query = this.facetCore.getActiveFacetsQuery();
        queryStr += "&" + query;

        return queryStr;
    },

    buildRequest : function(request) {
        var query = this.facetCore.getActiveFacetsQuery();
        request += "&" + query;

        return request;
    },

    render : function(data) {
        this.renderActiveFacets();
        this.bindEvents();
    },

    bindEvents : function() {
        var self = this;

        this.view.find("span.remove").off('click').on('click', function() {
            var facet = $(this).parent().find("a");

            triggerFacetClick(facet);

            // Return false to avoid the a:href executing
            return false;
        });

        this.view.find("a").off('click').on('click', function() {
            triggerFacetClick($(this));

            // Return false to avoid the a:href executing
            return false;
        });

        function triggerFacetClick(facet) {
            var id = facet.attr("facetname");
            var value = facet.attr("facetvalue");

            var facet = {
                id : id,
                value : value
            };

            self.serendip.trigger("facet.remove", facet);
            self.serendip.search();
        }

    },

    renderActiveFacets : function() {
        var activeFacetData = [];

        var queries = this.facetCore.getActiveFacetsQueriesMap();
        var facetMap = this.facetCore.getActiveFacetsMap();

        for (var id in queries) {
            var facetQuery = queries[id];
            var facet = facetMap[id];

            // Skip non-active facets
            if (facetQuery.values.length == 0)
                continue;

            for (var i = 0; i < facetQuery.values.length; i++) {
                var val = facetQuery.values[i];

                var data = this.renderActiveFacetValue(facet, facet.facetType, val);
                activeFacetData.push(data);
            }
        }

        this.renderActiveFacet(activeFacetData);

        if (activeFacetData.length == 0) {
            this.view.html(this.inactiveElement.html());
        }

    },

    renderActiveFacetValue : function(facet, type, value) {

        if (type == "text") {
            return this.renderActiveTextFacet(facet, value);
        }

        if (type == "query") {
            return this.renderActiveQueryFacet(facet, value);
        }

        if (type == "date") {
            return this.renderActiveDateFacet(facet, value);
        }

        if (type == "customdate") {
            return this.renderActiveCustomDateFacet(facet, value);
        }
    },

    renderActiveTextFacet : function(facet, value) {
        var encodedValue = encodeURIComponent(value);
        return this.renderActiveFacetField(facet, encodedValue, value);
    },

    renderActiveQueryFacet : function(facet, field) {

        var formattedValue = field;
        for (var k in facet.queries) {
            var query = facet.queries[k];

            if (query.query == field) {
                formattedValue = query.header;
            }
        }

        var encodedValue = encodeURIComponent(field);
        return this.renderActiveFacetField(facet, encodedValue, formattedValue);
    },

    renderActiveDateFacet : function(facet, value) {
        var formattedValue = value;

        if (!facet.dateValue || facet.dateValue == "") {
            var facetDateStr = value.split(" TO ");
            var fromDate = facetDateStr[0];

            var date = ISODate.convert(fromDate);
            formattedValue = date.format(facet.dateFormat);
        } else {
            formattedValue = facet.dateValue;
        }

        var encodedValue = encodeURIComponent(value);
        return this.renderActiveFacetField(facet, encodedValue, formattedValue);
    },

    renderActiveCustomDateFacet : function(facet, value) {
        var formattedValue = value;

        var customFacetValues = facet.getFacetValues();
        for (var k = 0; k < customFacetValues.length; k++) {
            var customFacet = customFacetValues[k];

            if (customFacet.value == value) {
                formattedValue = customFacet.name;
                break;
            }
        }

        var encodedValue = encodeURIComponent(value);
        return this.renderActiveFacetField(facet, encodedValue, formattedValue);
    },

    renderActiveFacet : function(facetFields) {
        if (facetFields && facetFields.length > 0) {

            var data = {
                "activeFacet" : facetFields
            };

            var html = serendip.render(this.prototype, data);
            this.view.html(html);
        } else {
            this.view.html("");
        }
    },

    renderActiveFacetField : function(facet, value, formattedValue) {

        formattedValue = this.facetCore.convertFacetFieldValue(facet, formattedValue);

        var data = {
            "header" : facet.activeHeader,
            "name" : facet.id,
            "value" : value,
            "displayValue" : formattedValue,
            "isActive" : "true"
        };

        return data;
    }
});
