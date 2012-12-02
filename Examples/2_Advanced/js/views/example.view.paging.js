Example.PagerView = (function(serendip, view, prototype) {
    var my = Serendip.PagerView(serendip);
    
    my.bindEvents = function() {
        var $pagingHrefs = view.find("li a");

        $pagingHrefs.off('click').on('click', function() {
            var page = $(this).attr("page");

            my.setPage(page);
            
            // Return false to avoid the a:href executing
            return false;
        });
    };
    
    my.render = function(currentPage, totalPages, startPage, endPage){
        var pagingRowsData = [];

        // Render previous page
        if (currentPage > 1) {
            var prevPage = currentPage - 1;

            var pageData = createPageData(prevPage, "inactive", "inactive", "inactive", "active");
            pagingRowsData.push(pageData);
        }

        // Render pages
        for (var i = startPage; i < endPage; i++) {
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
            Example.TemplateHelper.render(view, prototype, data);
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
