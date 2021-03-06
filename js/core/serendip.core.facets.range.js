Serendip.RangeFacet = (function (serendip) {
    var my = Serendip.Facet(serendip);
    
    my.facetType = "range";
    my.rangeStart = null;
    my.rangeEnd = null;
    my.rangeGap = null;

   my.getQuery = function() {
        var query = "facet.range={!ex=" + my.id + ", key=" + my.id + "}" + my.name;

        query = my.applyOption(query, "range.start", my.rangeStart);
        query = my.applyOption(query, "range.end", my.rangeEnd);
        query = my.applyOption(query, "range.gap", my.rangeGap);
       
        query = my.applyOptions(query);
       
        return query;
    };
    
    my.getActiveQueryValue = function(value){
        return "[" + value + "] ";
    };   
    
    my.getFacetValue = function(value){
        return value.from + " TO " + value.to;
    };     

    my.getFormattedValue = function(value) {
        return value.from + " - " + value.to;
    };
    
    my.parseActiveFacetValue = function(activeValue){
        var value = my.parseActiveValue(activeValue);
        if(value != ""){
            return Serendip.Utils.splitSolrMultiValue(value);
        }
        
        return [];
    };

    my.processActive = function(value) {
        var range = value.split(" TO ");
        var from = range[0];
        var to = range[1];

        var rangeValue = {
            from : from,
            to : to
        };
        
        var formattedValue = my.getFormattedValue(rangeValue);

        var encodedValue = encodeURIComponent(value);
        return my.processActiveField(encodedValue, formattedValue);
    };

    my.process = function(data) {
        var facetRanges = data.facet_counts.facet_ranges;
        var ranges = facetRanges[my.id].counts;
        var gap = facetRanges[my.id].gap;
        
        var facetValues = [];
        
        for(var i = 0; i < ranges.length; i+=2){
            var value = parseInt(ranges[i]);
            var count = ranges[i + 1];
            
            var range = {from: value};
            
            if (i + 2 < ranges.length) {
                range.to = value + gap;   
            } else {
                range.to = value + gap;  
            }
            
            facetValues.push(range);
            facetValues.push(count);       
        }
        
        return facetValues;
    }
    
    return my;
}); 