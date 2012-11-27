Serendip.FacetsRenderInactive = (function(serendip){
    var my = {};
    
    var _facetsCore = null;
    
    init(serendip);

    function init(serendip){
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
        var parents = getParents(facets, facet);
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
    
    function getParents(facets, childFacet){
        var parents = [];
        
        for(var i = 0; i < facets.length;i++){
            var facet = facets[i];
            for(var k = 0; k < facet.facets.length;k++){
                var child = facet.facets[k];
                if(child.id == childFacet.id){
                    parents.push(facet);
                    break;
                }
            }
            
            var subParents = getParents(facet.facets, childFacet);
            for(var k = 0; k < subParents.length; k++){
                var subParent = subParents[k];
                parents.push(subParent);
            }
        }
        
        return parents;
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

        var currentIndex = 0;
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

            currentIndex = i;
        }
        
        var facetdata = {
            facet: facet,
            values : facetRow
        };
        
        return facetdata;
    };

    function addMoreFacets(data, facet, facetArray, len, max, currentIndex) {
        if (max < len)
            len = max;

        var moreFacetsData = [];

        var moreFacets = {};
        moreFacets.count = 0;
        moreFacets.data = "";

        for (var i = currentIndex + 2; i < len; i += 2) {
            var value = facetArray[i];
            var count = facetArray[i + 1];

            var isActive = isFacetFieldActive(data, facet, value);
            var facetData = processFacetField(facet, value, count, isActive);

            if (facetData != "") {
                moreFacetsData.push(facetData);
                moreFacets.count++;
            }
        }

        if (moreFacets.count > 0) {
            moreFacets.data = moreFacetsData;
        }

        return moreFacets;
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
        var activeFacets = data.responseHeader.params.fq;

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

    function isFacetMatch(activeFacet, facet, value) {
        var facetValue = "";
        var prefix = "{!tag=" + facet.id + "}" + facet.name + ":(";

        var activePrefix = activeFacet.substring(0, prefix.length);

        if (prefix != activePrefix) {
            return false;
        }

        var activeValue = activeFacet.substring(prefix.length, activeFacet.length - 1);

        if (facet.facetType == "text") {
            var vals = activeValue.split(/\"\s/);
            for (var k = 0; k < vals.length; k++) {
                var val = vals[k].replace(/\"/g, "");
                val = Serendip.Utils.trim(val);

                if (val == value)
                    return true;
            }

        } else if (facet.facetType == "query") {

            if (value.value == activeValue) {
                return true;
            }

        } else if (facet.facetType == "date" || facet.facetType == "customdate") {
            vals = activeValue.split("]");

            for (var k = 0; k < vals.length; k++) {
                var val = vals[k].replace(/\[/g, "");
                val = val.replace(/]/g, "");
                val = Serendip.Utils.trim(val);

                if (val.length > 0) {
                    var facetValue = value.from + " TO " + value.to;

                    if (val == facetValue)
                        return true;
                }

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
                facet : data.facet,
                values : values
            }
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