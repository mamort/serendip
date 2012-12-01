Serendip.Facet = (function (serendip) {
    var my = {};
    
    my.facetType = "text";
    my.name  = null;
    my.activeHeader  = null;
    my.header  = null;
    my.minFacetsToDisplay = null;
    my.maxFacetsToDisplay = null;
    my.facets = [];
    //my.parents = [];

    my.addSubFacet = function(facet) {
        my.facets.push(facet);
        facet.addParent(my);
    };
    
    my.addParent = function(parent){
        //my.parents.push(parent); Wont work until .extend is removed completely
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
    
    my.parseActiveValue = function(activeValue){
        var prefix = "{!tag=" + my.id + "}" + my.name + ":(";

        var activePrefix = activeValue.substring(0, prefix.length);

        if (prefix != activePrefix) {
            return "";
        }
        
        return activeValue.substring(prefix.length, activeValue.length - 1);
    };    
    
    my.parseActiveFacetValue = function(activeValue){
        var parsedValues = [];
        
        var value = my.parseActiveValue(activeValue);
        if(value != ""){
            var vals = value.split(/\"\s/);
            for (var k = 0; k < vals.length; k++) {
                var val = vals[k].replace(/\"/g, "");
                val = Serendip.Utils.trim(val);

                parsedValues.push(val);
            }
        }         
        
        return parsedValues;
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
