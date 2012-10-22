Serendip.PagerView = Serendip.Class.extend({
    view : null,
    prototype : null,

    windowSize : 5,
    pages : 10,
    resultsPrPage : 10,
    startDoc : 0,
    isTrigger : false,
    serendip : null,

    init : function(serendip) {
        var self = this;
        this.serendip = serendip;
        
        this.serendip.on("search", function(){
            if(!self.isTrigger){
                self.startDoc = 0;
            }
        });
    },

    initFromQueryStr : function(queryStr, params) {
        if (params["start_param"])
            this.startDoc = params["start_param"];
        else
            this.startDoc = 0;
    },

    saveInQueryStr : function(queryStr) {
        queryStr += "&start=" + this.startDoc;

        return queryStr;
    },

    buildRequest : function(request) {
        request += "&start=" + this.startDoc;
        return request;
    },

    bindEvents : function() {
        var self = this;
        var $pagingHrefs = this.view.find("li a");

        $pagingHrefs.off('click').on('click', function() {
            var page = $(this).attr("page");

            page = page - 1;
            self.startDoc = page * self.resultsPrPage;
            self.isTrigger = true;
            self.serendip.search();
            self.isTrigger = false;

            // Return false to avoid the a:href executing
            return false;
        });
    },

    render : function(data) {
        this.startDoc = data.response.start;
        var numDocs = data.response.numFound;

        var totalPages = Math.ceil(numDocs / this.resultsPrPage);
        var currentPage = Math.ceil(this.startDoc / this.resultsPrPage) + 1;

        var start = (currentPage - this.windowSize) + 1;
        var end = (currentPage + this.windowSize) + 1;

        if (start < 1)
            start = 1;
        if (end > totalPages)
            end = totalPages + 1;

        var dif = end - start;

        if (dif < this.pages) {
            end += this.pages - dif + 1;
        }

        if (start < 1)
            start = 1;
        if (end > totalPages)
            end = totalPages + 1;

        this.renderPagerImpl(currentPage, totalPages, start, end);

        this.bindEvents();
    },

    renderPagerImpl : function(currentPage, totalPages, windowStart, windowEnd) {
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
            var html = this.serendip.render(this.prototype, data);
            this.view.html(html);
        } else {
            this.view.html("");
        }

        function createPageData(page, regularPageActive, currentPageActive, nextPageActive, prevPageActive) {
            var pageData = {
                "page" : page,
                "regularPageActive" : regularPageActive,
                "currentPageActive" : currentPageActive,
                "nextPageActive" : nextPageActive,
                "prevPageActive" : prevPageActive
            };

            return pageData;
        }

    }
}); 