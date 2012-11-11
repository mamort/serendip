Serendip.RangeFacet = Serendip.Facet.extend({
    facetType : "range",
    rangeStart : null,
    rangeEnd : null,
    rangeGap : null,

   getQuery : function() {
        var query = "facet.range={!ex=" + this.id + "}" + this.name;
        var key = "&f." + this.name + ".facet.range";
        query += key + ".start=" + encodeURIComponent(this.rangeStart);
        query += key + ".end=" + encodeURIComponent(this.rangeEnd);
        query += key + ".gap=" + encodeURIComponent(this.rangeGap);
        
        return query;
    },
    
    getActiveQueryValue : function(value){
        return "[" + value + "] ";
    },   
    
    getFacetValue : function(value){
        return value.from + " TO " + value.to;
    },     

    getFormattedValue : function(value) {
        return value.from + " - " + value.to;
    },

    processActive : function(value) {
        var range = value.split(" TO ");
        var from = range[0];
        var to = range[1];

        var rangeValue = {
            from : from,
            to : to
        };
        
        var formattedValue = this.getFormattedValue(rangeValue);

        var encodedValue = encodeURIComponent(value);
        return this.processActiveField(encodedValue, formattedValue);
    },

    process : function(data) {
        var facetRanges = data.facet_counts.facet_ranges;
        var ranges = facetRanges[this.name].counts;
        var gap = facetRanges[this.name].gap;
        
        var facetValues = [];
        
        for(var i = 0; i < ranges.length; i+=2){
            var value = parseInt(ranges[i]);
            var count = ranges[i + 1];
            
            var range = {from: value};
            
            if (i + 2 < ranges.length) {
                range.to = value + gap - 1;   
            } else {
                // TODO: Add support for last range being all additional values
                range.to = value + gap - 1;  
            }
            
            facetValues.push(range);
            facetValues.push(count);       
        }
        
        return facetValues;
    }
}); 