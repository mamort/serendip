Serendip.RangeFacet = (function (serendip) {
    var my = Serendip.Facet(serendip);
    
    my.facetType = "range";
    my.rangeStart = null;
    my.rangeEnd = null;
    my.rangeGap = null;

   my.getQuery = function() {
        var query = "facet.range={!ex=" + my.id + "}" + my.name;
        var key = "&f." + my.name + ".facet.range";
        query += key + ".start=" + encodeURIComponent(my.rangeStart);
        query += key + ".end=" + encodeURIComponent(my.rangeEnd);
        query += key + ".gap=" + encodeURIComponent(my.rangeGap);
        
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
    
    my.isFacetFieldActive = function(facetActiveValue, facetValue){

        
        return false;
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
        var ranges = facetRanges[my.name].counts;
        var gap = facetRanges[my.name].gap;
        
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
    
    return my;
}); 