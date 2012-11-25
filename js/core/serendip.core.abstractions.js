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

                if ( response == "") {
                    response = "Unable to contact server.";
                }

                errorHandler(response, shouldRedirectToLogin);
            }
        });
    }
});

Serendip.History = Serendip.Class.extend({
    init : function(){
        var self = this;
        
        $.historyInit(pageLoad, "index.html");
        
        // This function is called when:
        // 1. after calling $.historyInit();
        // 2. after calling $.historyLoad();
        // 3. after pushing "Go Back" button of a browser
        function pageLoad(hash) {

            // hash doesn't contain the first # character.
            if (hash) {
                // Do your thing
                if (hash.length > 0) {
                   self.trigger("history.change", hash);
                }
    
            } else {
    
                // Start page
                var queryParams = window.location.search;
    
                if (queryParams.length > 0) {
                    self.trigger("history.change", queryParams);
                }
    
            }
        }
    },
    
    load : function(hash){
        $.historyLoad(hash);
    }
});



