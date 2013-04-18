Serendip.Ajax = (function(){
    var my = {};

    my.get = function(url, succHandler, errorHandler) {

        $.ajax({
            scriptCharset: "utf-8",
            type: "GET",

            url: url,
            data: "",
            dataType: "json",
            contentType: "text/plain; charset=utf-8",
            timeout: 5000,

            success: succHandler,

            error: function(httpReq, ajaxOpts, thrownError) {
                var response = httpReq.responseText;
                try {
                    response = jQuery.parseJSON(httpReq.responseText);
                } catch(ex) {
                    // ignore
                }

                console.log(response);
                console.log(thrownError);

                if (response == "") {
                    response = "Unable to contact server.";
                }
                
                if (!response) {
                    response = "Failed to execute XMLHTTPRequest.";
                } else if (response.error) {
                    response = response.error.msg;
                } else {
                    response = "Unknown error. Please debug with Chrome or Firefox.";
                }

                errorHandler(httpReq.status, response);
            }
        });
    };
    
    return my;
}());

Serendip.History = (function(){
    var my = {};
    
    Serendip.Utils.setupEvents(my);
    
    my.init = function(){
        $.historyInit(pageLoad, "index.html");
    };
    
    my.load = function(hash){
        $.historyLoad(hash);
    };
    
    // This function is called when:
    // 1. after calling $.historyInit();
    // 2. after calling $.historyLoad();
    // 3. after pushing "Go Back" button of a browser
    function pageLoad(hash) {

        // hash doesn't contain the first # character.
        if (hash) {
            // Do your thing
            if (hash.length > 0) {
               my.trigger("history.change", hash);
            }

        } else {

            // Start page
            var queryParams = window.location.search;

            if (queryParams.length > 0) {
                my.trigger("history.change", queryParams);
            }

        }
    }    
    
    return my;
}());




