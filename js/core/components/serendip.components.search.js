Serendip.SearchView = (function(serendip, view, prototype) {
    var input = null;
    
    serendip.on("views.init", function(){
        init();
    });
    
    serendip.on("initFromQueryStr", function(queryStr, params) {
        input.val(params["query"]);
    });

    serendip.on("saveInQueryStr", function(save) {
        var value = input.val();
        value = encodeURIComponent(value);
        if (value && value != "") {
            save("query", value, 1);
        }
    });

    serendip.on("buildRequest", function(save) {
        var req = buildRequest();
        save(req);
    });

    function init() {
        input = view.find(".input");

        view.find(".button").click(function() {
            serendip.search(input.val());

            return false;
        });
    };

    function buildRequest() {
        var queryValue = input.val();

        // Illegal to start query with '*' or '?'
        if (queryValue[0] == '*' || queryValue[0] == '?') {
            queryValue = queryValue.substring(1, queryValue.length);
            input.val(queryValue);
        }

        if (queryValue == "") {
            queryValue = "*:*";
        }

        var query = encodeURIComponent(queryValue);
        return "&q=" + query;
    };
});
