Serendip.Core = Serendip.Class.extend({

    fieldConfig : [],
    fields : [],
    facets : [],
    highlightFields : [],
    queryParams : [],

    // Private
    core : new Serendip.Core({}),

    searchAllFields : false,
    sortQuery : "",
    clickType : "",

    cplIndex : -1,

    solrUrl : "",
    views : [],
    
    facetCore: null,
    
    init : function(pageName) {
        var self = this;

        this.facetCore.init(this);  
        this.facetRenderActive.init(this);
        this.facetRenderInactive.init(this);
        
        this.fieldConfig.sort(fieldSort);
        this.updateFieldsQueryString();

        for (var k in this.views) {
            var view = this.views[k];
            view.init(this);
        }
        
        this.trigger("views.init.done");
        
        this.initHistory();

        function fieldSort(a, b) {
            var x = a.header.toLowerCase();
            var y = b.header.toLowerCase();
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
    },    
    
    initHistory : function(){
        var self = this;
        
        this.history.on("history.change", function(queryParams){
             self.initFromQueryStr(queryParams);
        });
                
        this.history.init();
    },
    
    addFacet : function(facet){
        this.facets.push(facet);
        
        if(facet.facets.length > 0){
            for(var i = 0; i < facet.facets.length;i++){
                var subFacet = facet.facets[i];
                this.addFacet(subFacet);
            }
        }
    },

    addFieldConfig : function(config) {
        this.fieldConfig.push(config);
        this.fields.push(config.name);
    },

    setSearchAllFields : function() {
        this.searchAllFields = true;
        this.addQueryParam("fl", "*");
    },

    updateFieldsQueryString : function() {

        if (this.searchAllFields == false) {
            var fieldsQueryStr = "";
            for (var i = 0; i < this.fields.length; i++) {
                fieldsQueryStr += this.fields[i];
                if (i != this.fields.length - 1)
                    fieldsQueryStr += ",";
            }

            this.addQueryParam("fl", fieldsQueryStr);
        }
    },

    setHighlightFields : function(fields) {
        this.addQueryParam("hl.fl", fields.join(" "));
        this.highlightFields = fields;
    },

    addQueryParam : function(name, value) {
        var param = name + "=" + value;

        var found = false;
        for (var key in this.queryParams) {
            var p = this.queryParams[key];
            if (p.indexOf(name) != -1) {
                this.queryParams[key] = param;
                found = true;
            }
        }

        if (!found) {
            this.queryParams.push(name + "=" + value);
        }

    },

    initFromQueryStr : function(queryStr) {

        queryStr = decodeURIComponent(queryStr);

        // Add postfix to map ids to avoid using "reserved" javascript words
        // ex paramsMap["sort"] will not work (sort is already funksjon on array)
        var paramsMap = this.core.parseQueryToMap(queryStr, "_param");
        this.trigger("initFromQueryStr", queryStr, paramsMap);

        this.doRequest(this, false);
    },

    setSolrUrl : function(url) {
        this.solrUrl = url;
    },

    addView : function(view) {
        this.views.push(view);
    },

    saveHistoryItem : function() {
        var hash = "";
        
        var params = [];
        

        this.trigger("saveInQueryStr", function(id, value, sortIndex){
                var item = {id: id, value: value, sortIndex: sortIndex};
                params.push(item);
            }
        );
        
        params = params.sort(sortQueryParam);
        
        for(var i = 0; i < params.length; i++){
            var param = params[i];

            hash = hash + "/" + param.id + "/" + param.value;
        }

        this.history.load("!" + hash);
        
        function sortQueryParam(a, b) {
            var x = a.sortIndex;
            var y = b.sortIndex;
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }
    },

    search : function(value) {
        this.trigger("search");
        this.doRequest(this, true);
    },

    doRequest : function(req, saveHistoryItem) {
        req.trigger("wait");
        
        if(saveHistoryItem){
          req.saveHistoryItem();          
        }

        req.continueRequest(req);
    },

    getFullQuery : function() {
        var request = "";

        this.trigger("buildRequest", function(data){
            request = request + data;
        });        

        var params = this.core.getParamsAsQueryString(this.queryParams);

        var reqString = this.solrUrl + "?" + params;
        reqString += request + "&wt=json";

        return reqString;
    },

    continueRequest : function(req) {

        var url = req.getFullQuery();

        ajax.get(url, handleResponse, handleError);

        function handleError(error, shouldRedirectToLogin) {
            alert(error);

            if (shouldRedirectToLogin) {
                redirectToLogin();
            }
        }

        function handleResponse(data) {

            if (data == null) {
                redirectToLogin();
            }

            req.trigger("renderStart");
            req.trigger("render", data);
            req.trigger("renderFinished");
        }

    }
});

var ajax = new Serendip.Ajax({});
var serendip = new Serendip.Core({
    ajax : ajax,
    history : new Serendip.History({}),
    facetCore: new Serendip.Facets({}),
    facetRenderActive: new Serendip.FacetsRenderActive({}),
    facetRenderInactive: new Serendip.FacetsRenderInactive({})
});





