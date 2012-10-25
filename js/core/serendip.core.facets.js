Serendip.Facets = Serendip.Class.extend({
    configuredFacets: null,
    serendip: null,
    init : function(serendip){
        var self = this;
        this.serendip = serendip;
        this.configuredFacets = serendip.facets;
        
        serendip.on("render", function(data){
            var facets = self.processFacets(data);
            var visibleFacets = self.getOnlyVisibleFacetRowValues(facets);
            serendip.trigger("render.facets", facets, visibleFacets);
        });
    },
    
    processFacets : function(data){
        var facetsData = [];
        if ( typeof (data.facet_counts) != "undefined") {
            var facets = this.configuredFacets;
            var facetCount = facets.length;

            for (var i = 0; i < facetCount; i++) {
                var facetData = this.processFacetTypes(data, facets[i]);
                if(facetData != ""){
                    facetsData.push(facetData);   
                }
            }
        }
        
        return facetsData;
    },
    
    processFacetTypes : function(data, facet) {

        var values = this.getFacetValues(data, facet);
        
        if(values){
            return this.processFacet(data, facet, values);            
        }
        
        return "";
    },
    
    getFacetValues : function(data, facet){
        var type = facet.facetType;
        
        if (type == "text") {
            return this.processTextFacet(data, facet);
        } else if (type == "date") {
            var dateFacet = new Serendip.DateFacetCore({});
            return dateFacet.processDateFacet(data, facet);
        } else if (type == "query") {
            return this.processQueryFacet(data, facet);
        }
        
        return [];
    },

    processTextFacet : function(data, facet) {
        var facetfields = data.facet_counts.facet_fields;
        var facetValues = facetfields[facet.name];

        if ( typeof (facetValues != "undefined")) {
            return facetValues;
        }

        return [];
    },

    processQueryFacet : function(data, facet) {
        var facetqueries = data.facet_counts.facet_queries;
        var facetValues = [];

        for (var k = 0; k < facet.queries.length; k++) {
            var query = facet.queries[k];
            var id = facet.id + "range[" + k + "]";
            var count = facetqueries[id];

            facetValues.push({
                formattedValue : query.header,
                value : query.query
            });
            
            facetValues.push(count);
        }

        return facetValues;
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

        var formattedValue = "";
        if (facet.facetType == "date") {
            formattedValue = facet.getFormattedValue(value);
            value = value.from + " TO " + value.to;
        } else if (facet.facetType == "query") {
            formattedValue = value.formattedValue;
            value = value.value;
        } else {
            formattedValue = value;
        }

        value = encodeURIComponent(value);

        return this.processFacetFieldValue(facet, value, formattedValue, count, isActive);
    },

    isFacetFieldActive : function(data, facet, value) {
        var activeFacets = data.responseHeader.params.fq;

        if (activeFacets) {

            // Might be single value and not an array...
            if (!isArray(activeFacets) || activeFacets[0].length == 1) {
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

        formattedValue = this.convertFacetFieldValue(facet, formattedValue);
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
    
    convertFacetFieldValue : function(facet, value) {
        var converted = value;

        if (facet.id == "contenttype") {
            converted = this.convertContentTypeFacetValue(value);
        }

        return converted;
    },

    convertContentTypeFacetValue : function(value) {
        var convertedValue = value;

        value = value.toLowerCase();
        var convertionList = this.getFacetContentTypeConvertions();

        for (var key in convertionList) {
            if (value.indexOf(key) > -1) {
                convertedValue = convertionList[key];
                break;
            }
        }

        return convertedValue;
    },

    getFacetContentTypeConvertions : function() {
        var list = new Object();

        list["text/html"] = "Html";
        list["pdf"] = "PDF";
        list["text/plain"] = "Text";
        list["application/msword"] = "Word";

        return list;
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