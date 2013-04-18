Serendip.FacetsRenderInactive = (function(serendip){
    var my = {};
    
    var _facetsCore = null;
    
    init();

    function init(){
        serendip.on("init.facets.core", function(facetsCore) {
            _facetsCore = facetsCore;
        });        
       
        serendip.on("render", function(data){           
            var facets = processFacets(data);
            var visibleFacets = getOnlyVisibleFacetRowValues(facets);
            serendip.trigger("render.facets.inactive", facets, visibleFacets);
        });
    };
    
    function processFacets(data){
        var facetsData = [];
        if ( typeof (data.facet_counts) != "undefined") {
            var facets = getValidFacets(serendip.facets);

            for (var i = 0; i < facets.length; i++) {
                var facet = facets[i];
                var facetData = processFacetTypes(data, facet);
                
                if(facetData != ""){
                    facetsData.push(facetData);   
                }
            }
        }
        
        return facetsData;
    };
    
    function getValidFacets(facets){
                    
        var validFacets = [];
        for (var i = 0; i < facets.length; i++) {
            var facet = facets[i];
            
            if(isParentActive(facets, facet)){
                validFacets.push(facet);
            }
        }
        
        return validFacets;
    };
    
    function isParentActive(facets, facet){
        var parents = facet.parents;
        var queries = _facetsCore.getActiveFacetsQueriesMap();
        
        for(var i = 0; i < parents.length;i++){
            var parentFacet = parents[i];
            
            for (var id in queries) {
                if(id == parentFacet.id){
                    return true;    
                }   
            }
        }
        
        if(parents.length == 0){
            return true;
        }
        
        return false;
    };
    
    function processFacetTypes(data, facet) {
        var values = facet.process(data);
        
        if(values){
            return processFacet(data, facet, values);            
        }
        
        return "";
    };

    function processFacet(data, facet, facetArray) {
        var facetRow = [];

        facetArray = removeEmptyFacets(facetArray);

        var len = facetArray.length;

        for (var i = 0; i < len; i += 2) {
            var value = facetArray[i];
            var count = facetArray[i + 1];

            if (value == "")
                continue;

            var isActive = isFacetFieldActive(data, facet, value);

            var facetFieldData = processFacetField(facet, value, count, isActive);
            if (facetFieldData != ""){
                facetRow.push(facetFieldData);                
            }
        }
        
        var facetdata = {
            facet: facet,
            values : facetRow
        };
        
        return facetdata;
    };

    function removeEmptyFacets(facets) {
        var result = [];
        for (var i = 0; i < facets.length; i += 2) {
            var value = facets[i];
            var docCount = facets[i + 1];

            // -1 is sentinel value for facets that cannot have count
            if (docCount > 0 || docCount == -1) {
                result.push(value);
                result.push(docCount);
            }
        }

        return result;
    };

    function processFacetField(facet, value, count, isActive) {

        var formattedValue = facet.getFormattedValue(value);
        value = facet.getFacetValue(value); 
        value = encodeURIComponent(value);

        return processFacetFieldValue(facet, value, formattedValue, count, isActive);
    };

    function isFacetFieldActive(data, facet, value) {

        var header = data.responseHeader;
        if (!header.params) {
            return false;
        }

        if (!header.params.fq) {
            return false;
        }
        
        var activeFacets = header.params.fq;

        if (activeFacets) {

            // Might be single value and not an array...
            if (!Serendip.Utils.isArray(activeFacets) || activeFacets[0].length == 1) {
                if (isFacetMatch(activeFacets, facet, value)) {
                    return true;
                }
            } else {

                // If not previous match, we probably have an array with multiple active facets
                for (var i = 0; i < activeFacets.length; i++) {
                    if (isFacetMatch(activeFacets[i], facet, value)) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    function isFacetMatch(activeFacetValue, facet, value) {
        
        var facetValue = facet.getFacetValue(value);
        var activeValues = facet.parseActiveFacetValue(activeFacetValue);
        
        for(var i = 0; i < activeValues.length;i++){
            var active = activeValues[i];
            if(facetValue == active){
                return true;
            }
        }

        return false;
    };

    function processFacetFieldValue(facet, value, formattedValue, count, isActive) {
        if (isActive)
            return "";

        var facetFieldData = {
            "name" : facet.id,
            "value" : value,
            "displayValue" : formattedValue,
            "countValue" : count,
            "countValueCls" : "count" + count,
            "isActive" : "false"
        };

        return facetFieldData;
    };
    
    function getOnlyVisibleFacetRowValues(facets) {
        var facetRows = [];
        for (var i = 0; i < facets.length; i++) {
            var data = facets[i];
            var values = getVisibleFacetRowValues(data.facet, data.values);
            var row = {
                facet: data.facet,
                values: values
            };
            
            facetRows.push(row);
        }

        return facetRows;
    };

    function getVisibleFacetRowValues(facet, values) {
        var visibleValues = [];

        var len = Math.min(facet.minFacetsToDisplay, values.length);

        for (var i = 0; i < len; i++) {
            visibleValues.push(values[i]);
        }

        return visibleValues;
    };
    
    return my;
    
}(serendip));