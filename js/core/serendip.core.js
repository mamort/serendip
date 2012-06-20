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

Serendip.Core = Serendip.Class.extend({

    fieldConfig: [],
    fields: [],
	facets: [],
    highlightFields: [],
    queryParams: [],
    
	OnReadyListeners: [],
    OnRenderStartListeners: [],
    OnRenderFinishedListeners: [],

    // Private 
    core: new Serendip.Core({}),

    searchAllFields: false,
    timerId: 0,
    sortQuery: "",
    startDoc: 0,
    clickType: "",

    cplIndex: -1,
    lastHash: "",
    
    solrUrl: "",
    views: [],
    
    searchValue: "",
    
    // PageLoad function
    // This function is called when:
    // 1. after calling $.historyInit();
    // 2. after calling $.historyLoad();
    // 3. after pushing "Go Back" button of a browser
    pageload: function (hash) {

        // hash doesn't contain the first # character.
        if (hash) {
            // Do your thing
            if (hash.length > 0) {
                if (hash != this.lastHash) {
                    this.lastHash = hash;
                    this.initFromQueryStr(hash);
                }
            }

        } else {

            // Start page
            var queryParams = window.location.search;

            if (queryParams.length > 0)
                this.initFromQueryStr(queryParams);
        }
    },

    addFieldConfig: function (config) {
        this.fieldConfig.push(config);
        this.fields.push(config.name);
    },

    setSearchAllFields: function () {
        this.searchAllFields = true;
        this.addQueryParam("fl", "*");
    },

    updateFieldsQueryString: function () {

        if (this.searchAllFields == false) {
            var fieldsQueryStr = "";
            for (var i = 0; i < this.fields.length; i++) {
                fieldsQueryStr += this.fields[i];
                if (i != this.fields.length - 1) fieldsQueryStr += ",";
            }

            this.addQueryParam("fl", fieldsQueryStr);
        }
    },

    setHighlightFields: function (fields) {
        this.addQueryParam("hl.fl", fields.join(" "));
        this.highlightFields = fields;
    },

    addSortField: function (sortField) {
        this.sortFields.push(sortField);
    },

    addQueryParam: function (name, value) {
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

    addFacet: function (facet) {
        this.facets.push(facet);
        this.facetIdToFacetMap[facet.id] = facet;
    },
	
	onReady: function(listener){
		this.OnReadyListeners.push(listener);
	},

    OnRenderStart: function (listener) {
        this.OnRenderStartListeners.push(listener);
    },

    OnRenderFinished: function (listener) {
        this.OnRenderFinishedListeners.push(listener);
    },

    initFromQueryStr: function (queryStr) {

        queryStr = decodeURIComponent(queryStr);

        // Add postfix to map ids to avoid using "reserved" javascript words
        // ex paramsMap["sort"] will not work (sort is already funksjon on array)
        var paramsMap = this.core.parseQueryToMap(queryStr, "_param");

        for(var k in this.views){
          var view = this.views[k];
          view.initFromQueryStr(queryStr, paramsMap);
        }
		
		this.fireEvent(this.OnReadyListeners);

        this.doRequest(this);
    },
	
	fireEvent: function(listeners){
		for (var key in listeners) {
			var listener = listeners[key];
			listener();
		}	
	},

    sendRequest: function () {
        this.doRequest(this);
    },
    
    setSolrUrl : function(url){
      this.solrUrl = url;
    },
    
    addView : function(view){
      this.views.push(view);
    },

    init: function (pageName) {

        function fieldSort(a, b) {
            var x = a.header.toLowerCase();
            var y = b.header.toLowerCase();
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        var self = this;

        this.fieldConfig.sort(fieldSort);

        this.updateFieldsQueryString();

        for(var k in this.views){
          var view = this.views[k];
          view.init(this);
        }
        
        $.historyInit(pageloadPriv, pageName);
        
        function pageloadPriv(hash) {
            self.pageload(hash);
        }
    },

    saveHistoryItem: function () {
        var hash = "";
    
        for(var k in this.views){
          var view = this.views[k];
          hash = view.saveInQueryStr(hash);
        }
		
        $.historyLoad(hash);
    },

    setupEvents: function (req) {

    },
    
    search: function(){
      this.doRequest(this);
    },

    doRequest: function (req) {
        clearTimeout(req.timerId);
       
        for(var k in this.views){
          var view = this.views[k];
          view.renderInProgress();
        }

        req.saveHistoryItem();

        req.continueRequest(req);
    },
    
    renderInProgress: function(){
      
    },

    getFullQuery: function () {
        var request = "";
        
        for(var k in this.views){
          var view = this.views[k];
          request = view.buildRequest(request);
        }
        
        var params = this.core.getParamsAsQueryString(this.queryParams);

        var reqString = this.solrUrl + "?" + params;
        //reqString += this.sortQuery + this.getFacetQuery();
        reqString += request + "&wt=json";

        return reqString;
    },

    continueRequest: function (req) {

        var url = req.getFullQuery();

        $.ajax({
            scriptCharset: "utf-8",
            type: "GET",

            url: url,
            data: "",
            dataType: "json",
            contentType: "text/plain; charset=utf-8",

            success: handleResponse,

            error: function (httpReq, ajaxOpts, thrownError) {

                try {
                    if (thrownError.indexOf("<html") > -1) {
                        redirectToLogin();
                    }
                } catch (ex) {
                }

                alert(thrownError.toSource());
            }
        });

        function redirectToLogin() {
            //window.location = "../login.aspx?ReturnUrl=%2fOPF.KP.Web%2fSearch";
        }

        function handleResponse(data) {

            if (data == null) {
                redirectToLogin();
            }
            
            for (var key in req.OnRenderStartListeners) {
                var listener = req.OnRenderStartListeners[key];
                listener();
            }
            
            for(var k in req.views){
              var view = req.views[k];
              view.render(data);
            }
            
            for (key in req.OnRenderFinishedListeners) {
                listener = req.OnRenderFinishedListeners[key];
                listener();
            }
        }
    }
});

var serendip = new Serendip.Core({});

