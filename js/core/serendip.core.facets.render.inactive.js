Serendip.FacetsRenderInactive = Serendip.Class.extend({
    configuredFacets: null,
    serendip: null,
    facetCore: null,
    
    init : function(serendip){
        var self = this;
        this.serendip = serendip;
        this.configuredFacets = serendip.facets;
        
        this.serendip.on("init.facets.core", function(facetsCore) {
            self.facetsCore = facetsCore;
        });        
       
        serendip.on("render", function(data){           
            var facets = self.processFacets(data);
            var visibleFacets = self.getOnlyVisibleFacetRowValues(facets);
            serendip.trigger("render.facets.inactive", facets, visibleFacets);
        });
    },
    
    processFacets : function(data){
        var facetsData = [];
        if ( typeof (data.facet_counts) != "undefined") {
            var facets = this.getValidFacets(this.configuredFacets);

            for (var i = 0; i < facets.length; i++) {
                var facet = facets[i];
                var facetData = this.processFacetTypes(data, facet);
                
                if(facetData != ""){
                    facetsData.push(facetData);   
                }
            }
        }
        
        return facetsData;
    },
    
    getValidFacets : function(facets){
                    
        var validFacets = [];
        for (var i = 0; i < facets.length; i++) {
            var facet = facets[i];
            
            if(this.isParentActive(facets, facet)){
                validFacets.push(facet);
            }
        }
        
        return validFacets;
    },
    
    isParentActive : function(facets, facet){
        var parents = this.getParents(facets, facet);
        var queries = this.facetsCore.getActiveFacetsQueriesMap();
        
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
    },
    
    getParents : function(facets, childFacet){
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
            
            var subParents = this.getParents(facet.facets, childFacet);
            for(var k = 0; k < subParents.length; k++){
                var subParent = subParents[k];
                parents.push(subParent);
            }
        }
        
        return parents;
    },
    
    processFacetTypes : function(data, facet) {

        var values = facet.process(data);
        
        if(values){
            return this.processFacet(data, facet, values);            
        }
        
        return "";
    },

    processFacet : function(data, facet, facetArray) {
        var facetRow = [];

        facetArray = this.removeEmptyFacets(facetArray);

        var len = facetArray.length;

        var currentIndex = 0;
        for (var i = 0; i < len; i += 2) {
            var value = facetArray[i];
            var count = facetArray[i + 1];

            if (value == "")
                continue;

            var isActive = this.isFacetFieldActive(data, facet, value);

            var facetFieldData = this.processFacetField(facet, value, count, isActive);
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
    },

    addMoreFacets : function(data, facet, facetArray, len, max, currentIndex) {
        if (max < len)
            len = max;

        var moreFacetsData = [];

        var moreFacets = new Object();
        moreFacets.count = 0;
        moreFacets.data = "";

        for (var i = currentIndex + 2; i < len; i += 2) {
            var value = facetArray[i];
            var count = facetArray[i + 1];

            var isActive = this.isFacetFieldActive(data, facet, value);
            var facetData = this.processFacetField(facet, value, count, isActive);

            if (facetData != "") {
                moreFacetsData.push(facetData);
                moreFacets.count++;
            }
        }

        if (moreFacets.count > 0) {
            moreFacets.data = moreFacetsData;
        }

        return moreFacets;
    },

    removeEmptyFacets : function(facets) {
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
    },

    processFacetField : function(facet, value, count, isActive) {

        var formattedValue = facet.getFormattedValue(value);
        value = facet.getFacetValue(value); 
        value = encodeURIComponent(value);

        return this.processFacetFieldValue(facet, value, formattedValue, count, isActive);
    },

    isFacetFieldActive : function(data, facet, value) {
        var activeFacets = data.responseHeader.params.fq;

        if (activeFacets) {

            // Might be single value and not an array...
            if (!Serendip.Utils.isArray(activeFacets) || activeFacets[0].length == 1) {
                if (this.isFacetMatch(activeFacets, facet, value)) {
                    return true;
                }
            } else {

                // If not previous match, we probably have an array with multiple active facets
                for (var i = 0; i < activeFacets.length; i++) {
                    if (this.isFacetMatch(activeFacets[i], facet, value)) {
                        return true;
                    }
                }
            }
        }

        return false;
    },

    isFacetMatch : function(activeFacet, facet, value) {
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
                var val = vals[k].replace(/\"/g, "").trim();

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
                val = val.replace(/]/g, "").trim();

                if (val.length > 0) {
                    var facetValue = value.from + " TO " + value.to;

                    if (val == facetValue)
                        return true;
                }

            }
        }

        return false;
    },

    processFacetFieldValue : function(facet, value, formattedValue, count, isActive) {
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
    },
    
    getOnlyVisibleFacetRowValues : function(facets) {
        var facetRows = [];
        for (var i = 0; i < facets.length; i++) {
            var data = facets[i];
            var values = this.getVisibleFacetRowValues(data.facet, data.values);
            var row = {
                facet : data.facet,
                values : values
            }
            facetRows.push(row);
        }

        return facetRows;
    },

    getVisibleFacetRowValues : function(facet, values) {
        var visibleValues = [];

        var len = Math.min(facet.minFacetsToDisplay, values.length);

        for (var i = 0; i < len; i++) {
            visibleValues.push(values[i]);
        }

        return visibleValues;
    }
});