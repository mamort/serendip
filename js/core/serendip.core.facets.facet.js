Serendip.Facet = (function (serendip) {
    var my = {};
    
    my.facetType = "text";
    my.name  = null;
    my.activeHeader  = null;
    my.header  = null;
    my.minFacetsToDisplay = null;
    my.maxFacetsToDisplay = null;
    my.facets = [];

    my.addSubFacet = function(facet) {
        my.facets.push(facet);
    };
    
    my.getActiveQuery = function(values){
        var query = "fq={!tag=" + my.id + "}" + my.name;
        var values = my.getActiveQueryValues(values);
        query += ":(" + values + ")";
        return query;
    };
    
    my.getActiveQueryValues = function(values){
        var query = "";
        for (var i = 0; i < values.length; i++) {
            var value = encodeURIComponent(values[i]);
            query += my.getActiveQueryValue(value);
        }
        return query;
    };        
    
    my.getActiveQueryValue = function(value){
        return "\"" + value + "\" ";
    };
    
    my.getQuery = function() {
        return "facet.field={!ex=" + my.id + "}" + my.name;
    };

    my.process = function(data) {
        var facetfields = data.facet_counts.facet_fields;
        var facetValues = facetfields[my.name];

        if ( typeof (facetValues != "undefined")) {
            return facetValues;
        }

        return [];
    },

    my.processActive = function(value) {
        var encodedValue = encodeURIComponent(value);
        var formattedValue = my.getFormattedValue(value);
        return my.processActiveField(encodedValue, formattedValue);
    };

    my.processActiveField = function(value, formattedValue) {
        var data = {
            "header" : my.activeHeader,
            "name" : my.id,
            "value" : value,
            "displayValue" : formattedValue,
            "isActive" : "true"
        };

        return data;
    };

    my.getFacetValue = function(value){
        return value;
    };
    
    my.getFormattedValue = function(value) {
        return value;
    };
    
    return my;
});
