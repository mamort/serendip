Serendip.SearchView = (function(serendip) {
    var my = {};
    
    my.getSearchValue = function(){
        // Implementations must override this method
        return "";
    }
    
    my.setSearchValue = function(value){
        // Implementations must override this method
    }    
    
    serendip.on("initFromQueryStr", function(queryStr, params) {
        my.setSearchValue(params["query"]);
    });

    serendip.on("saveInQueryStr", function(save) {
        var value = my.getSearchValue();
        value = encodeURIComponent(value);
        if (value && value != "") {
            save("query", value, 1);
        }
    });

    serendip.on("buildRequest", function(save) {
        var req = buildRequest();
        save(req);
    });

    function buildRequest() {
        var queryValue = my.getSearchValue();

        // Illegal to start query with '*' or '?'
        if (queryValue[0] == '*' || queryValue[0] == '?') {
            queryValue = queryValue.substring(1, queryValue.length);
            my.setSearchValue(queryValue);
        }

        if (queryValue == "") {
            queryValue = "*:*";
        }

        var query = encodeURIComponent(queryValue);
        return "&q=" + query;
    };
    
    return my;
});
