Serendip.Core = (function (ajax, history) {
    var my = {};
    
    my.fieldConfig = [];
    my.fields = [];
    my.facets = [];
    my.highlightFields = [];
    
    var _queryParams = [];
    var _enableAllFields = false;

    var solrUrl = "";
    
    Serendip.Utils.setupEvents(my);
    
    my.init = function () {
        initFacets();
        
        my.trigger("views.init");
        
        my.fieldConfig.sort(fieldSort);
        updateFieldsQueryString();
  
        my.trigger("views.init.done");
        
        initHistory();
    };    
    
    my.addFacet = function(facet){
        my.facets.push(facet);
    };

    my.addFieldConfig = function(config) {
        my.fieldConfig.push(config);
        my.fields.push(config.name);
    };

    my.getFieldConfigForField = function(field) {
        for (var i = 0; i < my.fieldConfig.length; i++) {
            var config = my.fieldConfig[i];
            if (config.name == field) {
                return config;
            }
        }

        return null;
    };

    my.enableAllFields = function(enable) {
        _enableAllFields = enable;
        if(enable){
            my.addQueryParam("fl", "*");
        }else{
            my.removeQueryParam("fl");
        }
        
        updateFieldsQueryString();
    };

    my.setHighlightFields = function(fields) {
        addQueryParam("hl.fl", fields.join(" "));
        my.highlightFields = fields;
    };
    
    my.removeQueryParam = function(key){
        delete _queryParams[key];
    };

    my.addQueryParam = function(name, value) {
        var param = name + "=" + value;

        var found = false;
        for (var key in _queryParams) {
            var p = _queryParams[key];
            if (p.indexOf(name) != -1) {
                _queryParams[key] = param;
                found = true;
            }
        }

        if (!found) {
            _queryParams.push(name + "=" + value);
        }

    };

    my.setSolrUrl = function(url) {
        solrUrl = url;

        var currentUrlParsed = Serendip.Utils.parseUri(document.URL);
        var solrUrlParsed = Serendip.Utils.parseUri(url);
        
        if (currentUrlParsed.host != solrUrlParsed.host || currentUrlParsed.port != solrUrlParsed.port) {
            console.warn("The hostname and port of the solr url does not match the hostname and port of the page url. " +
                "This is likely a bug since you will (likely) experience crossite scripting errors when " +
                "making ajax requests to Solr.");
            console.warn("Solr host/port: " + solrUrlParsed.host + ":" + solrUrlParsed.port
                + " Page host/port: " + currentUrlParsed.host + ":" + currentUrlParsed.port);
        }
    };

    my.saveHistoryItem = function() {
        var hash = "";
        
        var params = [];
        
        my.trigger("saveInQueryStr", function(id, value, sortIndex){
                var item = {id: id, value: value, sortIndex: sortIndex};
                params.push(item);
            }
        );
        
        params = params.sort(sortQueryParam);
        
        for(var i = 0; i < params.length; i++){
            var param = params[i];

            hash = hash + "/" + param.id + "/" + param.value;
        }

        history.load("!" + hash);
    };
    
    my.getIdForFieldName = function(field) {
        var config = my.getFieldConfigForField(field);
        if(config != null){
            return config.id;    
        }
        
        return null;
    };    
    
    my.getFieldNameForId = function(id) {
        for (var i = 0; i < my.fieldConfig.length; i++) {
            var config = my.fieldConfig[i];
            if (config.id == id) {
                return config.name;
            }
        }

        return "";
    };

    my.search = function () {
        my.trigger("search");
        doRequest(true);
    };
    
    function initFacets() {
        for (var i = 0; i < my.facets.length; i++) {
            var facet = my.facets[i];

            if (facet.facets.length > 0) {
                for (var k = 0; k < facet.facets.length; k++) {
                    var subFacet = facet.facets[k];
                    my.addFacet(subFacet);
                }
            }
        }
    };

    function initHistory(){
        history.on("history.change", function(queryParams){
             initFromQueryStr(queryParams);
        });
                
        history.init();
    };
    
    function initFromQueryStr(queryStr) {

        queryStr = decodeURIComponent(queryStr);

        // Add postfix to map ids to avoid using "reserved" javascript words
        // ex paramsMap["sort"] will not work (sort is already funksjon on array)
        var paramsMap = parseQueryToMap(queryStr, "");
        my.trigger("initFromQueryStr", queryStr, paramsMap);

        doRequest(false);
    };    
    
    function updateFieldsQueryString() {
        if (_enableAllFields == false) {
            var enabledFields = [];
            for(var i = 0; i < my.fieldConfig.length; i++){
                var config = my.fieldConfig[i];
                if(config.isEnabled){
                    enabledFields.push(config.name);
                }
            }
            
            my.removeQueryParam("fl");
            my.addQueryParam("fl", enabledFields.join(","));
        }
    };
    
    
    function fieldSort(a, b) {
        var x = a.header.toLowerCase();
        var y = b.header.toLowerCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    };    
        
    
    function sortQueryParam(a, b) {
        var x = a.sortIndex;
        var y = b.sortIndex;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }    

    function doRequest(saveHistoryItem) {
        my.trigger("wait");
        
        if(saveHistoryItem){
            my.saveHistoryItem();          
        }else{
            continueRequest();
        }
    };

    function getFullQuery() {
        var request = "";

        my.trigger("buildRequest", function(data){
            request = request + data;
        });        

        var params = getParamsAsQueryString(_queryParams);

        var reqString = solrUrl + "?" + params;
        reqString += request + "&wt=json";

        return reqString;
    };

    function continueRequest() {

        var url = getFullQuery();
        ajax.get(url, handleResponse, handleError);
    };
    
    function handleError(statusCode, msg) {
        my.trigger("error.request", statusCode, msg);
    };

    function handleResponse(data) {
        my.trigger("renderStart");
        my.trigger("render", data);
        my.trigger("renderFinished");
    };
    
   function getParamsAsQueryString(params) {
        var query = "";

        for (var i = 0; i < params.length; i++) {
            query = query + params[i];
            if (i < params.length - 1)
                query = query + "&";
        }

        return query;
    };

    function parseQueryToMap(queryStr) {
        var split = queryStr.split("&");

        var queryParams = {};

        for (var i = 0; i < split.length; i++) {
            var params = split[i].split("=");
            queryParams[params[0]] = params[1];
        }
        
        split = queryStr.replace("!/", "").split("/");

        for (i = 0; i < split.length-1; i+=2) {
            var key = split[i];
            var value = split[i+1];
            queryParams["" + key + ""] = value;
        }        

        return queryParams;
    }
    
    
    return my;
}(Serendip.Ajax, Serendip.History));

var serendip = Serendip.Core;





