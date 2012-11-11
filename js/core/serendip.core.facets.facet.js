Serendip.Facet = Serendip.Class.extend({
    facetType : "text",
    name : null,
    activeHeader : null,
    header : null,
    minFacetsToDisplay : null,
    maxFacetsToDisplay : null,

    facets : [],

    addSubFacet : function(facet) {
        this.facets.push(facet);
    },
    
    getActiveQuery : function(values){
        var query = "fq={!tag=" + this.id + "}" + this.name;
        var values = this.getActiveQueryValues(values);
        query += ":(" + values + ")";
        return query;
    },
    
    getActiveQueryValues : function(values){
        var query = "";
        for (var i = 0; i < values.length; i++) {
            var value = encodeURIComponent(values[i]);
            query += this.getActiveQueryValue(value);
        }
        return query;
    },        
    
    getActiveQueryValue : function(value){
        return "\"" + value + "\" ";
    },
    
    getQuery : function() {
        return "facet.field={!ex=" + this.id + "}" + this.name;
    },

    process : function(data) {
        var facetfields = data.facet_counts.facet_fields;
        var facetValues = facetfields[this.name];

        if ( typeof (facetValues != "undefined")) {
            return facetValues;
        }

        return [];
    },

    processActive : function(value) {
        var encodedValue = encodeURIComponent(value);
        var formattedValue = this.getFormattedValue(value);
        return this.processActiveField(encodedValue, formattedValue);
    },

    processActiveField : function(value, formattedValue) {
        var data = {
            "header" : this.activeHeader,
            "name" : this.id,
            "value" : value,
            "displayValue" : formattedValue,
            "isActive" : "true"
        };

        return data;
    },

    getFacetValue : function(value){
        return value;
    },
    
    getFormattedValue : function(value) {
        return value;
    }
});
