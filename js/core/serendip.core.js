/*!
 * Serendip Javascript Library v1.0
 * http://github.com/mamort/serendip
 *
 * Copyright 2010, Mats Mortensen
 * Licensed under the MIT license.
 * http://github.com/mamort/serendip/blob/master/License.txt
 *
 * Includes:
 * jquery-1.4.min.js (http://jquery.com/)
 * date.format-1.2.3.js (http://blog.stevenlevithan.com/archives/date-time-format)
 * pure_packed.js (http://beebole.com/pure/)
 */

Serendip.Ajax = Serendip.Class.extend({

    get : function(url, succHandler, errorHandler) {

        $.ajax({
            scriptCharset : "utf-8",
            type : "GET",

            url : url,
            data : "",
            dataType : "json",
            contentType : "text/plain; charset=utf-8",
            timeout : 5000,

            success : succHandler,

            error : function(httpReq, ajaxOpts, thrownError) {
                var shouldRedirectToLogin = false;
                try {
                    if (thrownError.indexOf("<html") > -1) {
                        shouldRedirectToLogin = true;
                    }
                } catch (ex) {
                    if (console) {
                        console.log(ex.toSource());
                    }
                }

                var response = jQuery.parseJSON(httpReq.responseText);

                if (console) {
                    console.log(response);
                    console.log(thrownError.toSource());
                }

                if ( response = "") {
                    response = "Unable to contact server.";
                }

                errorHandler(response, shouldRedirectToLogin);
            }
        });
    }
});

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

        $.historyInit(pageloadPriv, pageName);

        function fieldSort(a, b) {
            var x = a.header.toLowerCase();
            var y = b.header.toLowerCase();
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        function pageloadPriv(hash) {
            self.pageload(hash);
        }
    },    
    
    // PageLoad function
    // This function is called when:
    // 1. after calling $.historyInit();
    // 2. after calling $.historyLoad();
    // 3. after pushing "Go Back" button of a browser
    pageload : function(hash) {

        // hash doesn't contain the first # character.
        if (hash) {
            // Do your thing
            if (hash.length > 0) {
               this.initFromQueryStr(hash);  
            }

        } else {

            // Start page
            var queryParams = window.location.search;

            if (queryParams.length > 0) {
                this.initFromQueryStr(queryParams);
            }

        }
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

        $.historyLoad("!" + hash);
        
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

    },

    render : function(prototype, data) {
        var $element = prototype.clone();

        $element = $element.find(".Placeholder").autoRender(data);
        var html = $element.html();

        return html;
    }
});

var ajax = new Serendip.Ajax({});
var serendip = new Serendip.Core({
    ajax : ajax,
    facetCore: new Serendip.Facets({}),
    facetRenderActive: new Serendip.FacetsRenderActive({}),
    facetRenderInactive: new Serendip.FacetsRenderInactive({})
});





