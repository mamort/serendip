Serendip.PagerView = (function(serendip) {
    var my = {};
    
    my.pageName = "Page";
    my.windowSize = 5;
    my.pages = 10;
    
    var _resultsPrPage = 10;
    var _startDoc = 0;
    var _isTrigger = false;

    serendip.on("search", function() {
        if (!_isTrigger) {
            _startDoc = 0;
        }
    });

    serendip.on("render", function(data) {
        render(data);
    });

    serendip.on("initFromQueryStr", function(queryStr, params) {
        if (params[my.pageName])
            _startDoc = (params[my.pageName] - 1) * _resultsPrPage;
        else
            _startDoc = 0;
    });

    serendip.on("saveInQueryStr", function(save) {
        var page = (_startDoc / _resultsPrPage) + 1;
        save(my.pageName, page, 2);
    });

    serendip.on("buildRequest", function(save) {
        save("&start=" + _startDoc);
    });

    serendip.on("resultsPrPageChanged", function(resultsPrPage) {
        _resultsPrPage = resultsPrPage;
    });
    
    my.setPage = function(page){
        page = page - 1;
        _startDoc = page * _resultsPrPage;
        _isTrigger = true;
        serendip.search();
        _isTrigger = false;
    };

    my.bindEvents = function() {
        // Implementations need to override this method
    };
    
    my.render = function(currentPage, totalPages, start, end){
        // Implementations need to override this method      
    };

    function render(data) {
        _startDoc = data.response.start;
        var numDocs = data.response.numFound;

        var totalPages = Math.ceil(numDocs / _resultsPrPage);
        var currentPage = Math.ceil(_startDoc / _resultsPrPage) + 1;

        var start = (currentPage - my.windowSize) + 1;
        var end = (currentPage + my.windowSize) + 1;

        if (start < 1){
           start = 1; 
        }
            
        if (end > totalPages){
            end = totalPages + 1;    
        }

        var dif = end - start;

        if (dif < my.pages) {
            end += my.pages - dif + 1;
        }

        if (start < 1) {
            start = 1;
        }

        if (end > totalPages) {
            end = totalPages + 1;
        }

        my.render(currentPage, totalPages, start, end);

        my.bindEvents();
    };
    
    return my;
});
