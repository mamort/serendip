Serendip.Core = (function (ajax, history) {
    var my = {};
    
    my.fieldConfig = [];
    my.fields = [];
    my.facets = [];
    my.highlightFields = [];
    
    _queryParams = [];

    _enableAllFields = false;
    sortQuery = "";
    clickType = "";

    cplIndex = -1;

    solrUrl = "";
    
    Serendip.Utils.setupEvents(my);
    
    my.init = function(pageName) {
        my.trigger("views.init");
        
        my.fieldConfig.sort(fieldSort);
        updateFieldsQueryString();
  
        my.trigger("views.init.done");
        
        initHistory();
    };    
    
    my.addFacet = function(facet){
        my.facets.push(facet);
        
        if(facet.facets.length > 0){
            for(var i = 0; i < facet.facets.length;i++){
                var subFacet = facet.facets[i];
                my.addFacet(subFacet);
            }
        }
    };

    my.addFieldConfig = function(config) {
        my.fieldConfig.push(config);
        my.fields.push(config.name);
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
        highlightFields = fields;
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

    my.search = function(value) {
        my.trigger("search");
        doRequest(true);
    };

    function doRequest(saveHistoryItem) {
        my.trigger("wait");
        
        if(saveHistoryItem){
          my.saveHistoryItem();          
        }

        continueRequest();
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
    
    function handleError(error, shouldRedirectToLogin) {
        alert(error);

        if (shouldRedirectToLogin) {
            redirectToLogin();
        }
    };

    function handleResponse(data) {

        if (data == null) {
            redirectToLogin();
        }

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

    function parseParam(queryStr, name) {
        var startIndex = queryStr.indexOf(name);

        if (startIndex != -1) {
            var endIndex = queryStr.indexOf("&", startIndex);

            if (endIndex == -1) {
                endIndex = queryStr.length;
            }

            return queryStr.substring(startIndex + name.length, endIndex);
        }

        return "";
    };

    function parseQueryToMap(queryStr) {
        var split = queryStr.split("&");

        var queryParams = {};

        for (var i = 0; i < split.length; i++) {
            var params = split[i].split("=");
            queryParams[params[0]] = params[1];
        }
        
        split = queryStr.replace("!/", "").split("/");

        for (var i = 0; i < split.length-1; i+=2) {
            var key = split[i];
            var value = split[i+1];
            queryParams["" + key + ""] = value;
        }        

        return queryParams;
    }
    
    
    return my;
}(Serendip.Ajax, Serendip.History));

var serendip = Serendip.Core;





