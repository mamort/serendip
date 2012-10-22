Serendip.ShowMoreFacetsView = Serendip.Class.extend({
    view : null,

    renderRow : function(view, html, data) {
        view.find(".MoreFacetsValues").html(html).autoRender(data).hide();
    },

    render : function(data) {
        var self = this;

        this.view.find("a.moreFacets").off('click').on('click', function() {
            self.handleShowMoreLess($(this));
            return false;
        });
    },

    handleShowMoreLess : function(element) {
        var id = element.attr("facetname");

        var selector = "." + id + " .MoreFacetsValues";
        var $moreFacets = this.view.find(selector);

        selector = "." + id + " .moreFacetsTxt";
        var $moreFacetsTxt = this.view.find(selector);

        selector = "." + id + " .lessFacetsTxt";
        var $lessFacetsTxt = this.view.find(selector);

        if ($moreFacets.css("display") == "none") {

            $moreFacets.slideDown("slow", function() {
                $(this).show();
            });

            $moreFacetsTxt.hide();
            $lessFacetsTxt.show();

        } else {

            $moreFacets.slideUp("slow", function() {
                $(this).hide();
            });

            $lessFacetsTxt.hide();
            $moreFacetsTxt.show();
        }
    }
});
