Serendip.FacetsRenderActive = Serendip.Class.extend({
    serendip : null,
    facetsCore : null,

    init : function(serendip) {
        var self = this;
        
        this.serendip = serendip;
  
        this.serendip.on("init.facets.core", function(facetsCore) {
            self.facetsCore = facetsCore;
        });    
  
        this.serendip.on("render", function(data) {
            var activeFacets = self.createActiveFacets();
            self.serendip.trigger("render.facets.active", activeFacets);
        });                
    },
    
    createActiveFacets : function() {
        var activeFacetData = [];

        var queries = this.facetsCore.getActiveFacetsQueriesMap();
        var facetMap = this.facetsCore.getActiveFacetsMap();

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
        
        return activeFacetData;
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
            var toDate = facetDateStr[1];

            var fromDateStr = convertIsoDate(fromDate, facet.dateFormat);
            var toDateStr = convertIsoDate(toDate, facet.dateFormat);
            
            formattedValue = fromDateStr + " - " + toDateStr;
        } else {
            formattedValue = facet.dateValue;
        }

        var encodedValue = encodeURIComponent(value);
        return this.renderActiveFacetField(facet, encodedValue, formattedValue);
    },

    renderActiveFacetField : function(facet, value, formattedValue) {
        this.serendip.trigger("facet.value.format", {facet: facet, value: value, formattedValue: formattedValue});

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