Serendip.ActiveFacetsView = Serendip.Class.extend({
    configuredFacets : null,

    view : null,
    prototype : null,

    serendip : null,
    inactiveElement : null,

    init : function(serendip) {
        var self = this;
        this.serendip = serendip;

        this.inactiveElement = this.view.find(".inactive");
        this.inactiveElement.hide();
        
        this.serendip.on("render.facets.active", function(activeFacets){
            self.renderActiveFacets(activeFacets);
            self.bindEvents();
        });                   
    },

    bindEvents : function() {
        var self = this;

        this.view.find("span.remove").off('click').on('click', function() {
            var facet = $(this).parent().find("a");
            triggerFacetClick(facet);

            // Return false to avoid the a:href executing
            return false;
        });

        this.view.find("a").off('click').on('click', function() {
            triggerFacetClick($(this));

            // Return false to avoid the a:href executing
            return false;
        });

        function triggerFacetClick(facet) {
            var id = facet.attr("facetname");
            var value = facet.attr("facetvalue");

            self.serendip.trigger("facet.remove", {id : id, value : value});
            self.serendip.search();
        }

    },

    renderActiveFacets : function(activeFacets) {
        this.renderActiveFacet(activeFacets);

        if (activeFacets.length == 0) {
            this.view.html(this.inactiveElement.html());
        }
    },
    
    renderActiveFacet : function(facetFields) {
        if (facetFields && facetFields.length > 0) {

            var html = serendip.render(this.prototype, {"activeFacet" : facetFields});
            this.view.html(html);
        } else {
            this.view.html("");
        }
    }
});
