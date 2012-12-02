Serendip.PagerView = (function(serendip, view, prototype) {
    var _windowSize = 5;
    var _pages = 10;
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
        if (params["Page"])
            _startDoc = (params["Page"] - 1) * _resultsPrPage;
        else
            _startDoc = 0;
    });

    serendip.on("saveInQueryStr", function(save) {
        var page = (_startDoc / _resultsPrPage) + 1;
        save("Page", page, 2);
    });

    serendip.on("buildRequest", function(save) {
        save("&start=" + _startDoc);
    });

    serendip.on("resultsPrPageChanged", function(resultsPrPage) {
        _resultsPrPage = resultsPrPage;
    });

    function bindEvents() {
        var $pagingHrefs = view.find("li a");

        $pagingHrefs.off('click').on('click', function() {
            var page = $(this).attr("page");

            page = page - 1;
            _startDoc = page * _resultsPrPage;
            _isTrigger = true;
            serendip.search();
            _isTrigger = false;

            // Return false to avoid the a:href executing
            return false;
        });
    };

    function render(data) {
        _startDoc = data.response.start;
        var numDocs = data.response.numFound;

        var totalPages = Math.ceil(numDocs / _resultsPrPage);
        var currentPage = Math.ceil(_startDoc / _resultsPrPage) + 1;

        var start = (currentPage - _windowSize) + 1;
        var end = (currentPage + _windowSize) + 1;

        if (start < 1){
           start = 1; 
        }
            
        if (end > totalPages){
            end = totalPages + 1;    
        }

        var dif = end - start;

        if (dif < _pages) {
            end += _pages - dif + 1;
        }

        if (start < 1) {
            start = 1;
        }

        if (end > totalPages) {
            end = totalPages + 1;
        }

        renderPagerImpl(currentPage, totalPages, start, end);

        bindEvents();
    };

    function renderPagerImpl(currentPage, totalPages, windowStart, windowEnd) {
        var pagingRowsData = [];

        // Render previous page
        if (currentPage > 1) {
            var prevPage = currentPage - 1;

            var pageData = createPageData(prevPage, "inactive", "inactive", "inactive", "active");
            pagingRowsData.push(pageData);
        }

        // Render pages
        for (var i = windowStart; i < windowEnd; i++) {
            var rowHtml = "";

            var currentPageActive = "inactive";
            var regularPageActive = "active";
            if (i == currentPage) {
                currentPageActive = "active";
                regularPageActive = "inactive";
            }

            var pageData = createPageData(i, regularPageActive, currentPageActive, "inactive", "inactive");
            pagingRowsData.push(pageData);
        }

        // Render next page
        if (currentPage < totalPages) {
            var nextPage = currentPage + 1;

            var pageData = createPageData(nextPage, "inactive", "inactive", "active", "inactive");
            pagingRowsData.push(pageData);
        }

        var data = {
            "pageRow" : pagingRowsData
        };

        if (totalPages > 1) {
            Serendip.View.Render.render(view, prototype, data);
        } else {
            view.html("");
        }
    };

    function createPageData(page, regularPageActive, currentPageActive, nextPageActive, prevPageActive) {
        var pageData = {
            "page" : page,
            "regularPageActive" : regularPageActive,
            "currentPageActive" : currentPageActive,
            "nextPageActive" : nextPageActive,
            "prevPageActive" : prevPageActive
        };

        return pageData;
    };
});
