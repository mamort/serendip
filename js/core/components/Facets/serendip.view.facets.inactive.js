Serendip.InactiveFacetsView = Serendip.Class.extend({
    configuredFacets : null,

    serendip : null,
    facetCore : null,

    view : null,
    prototype : null,

    maxFacetsToDisplay : 5,
    showMoreFacetsView : null,

    init : function(serendip, facetCore) {
        var self = this;

        this.serendip = serendip;
        this.facetCore = facetCore;
        
        this.showMoreFacetsView = new Serendip.ShowMoreFacetsView({
            view : this.view,
            prototype : this.prototype
        });
        
        this.showMoreFacetsView.init(serendip);

        this.serendip.on("render.facets", function(facets, visibleFacets) {
            var html = self.renderAllFacets(visibleFacets);
            self.view.html(html);
            
            serendip.trigger("render.facets.showmore", facets);
            self.bindEvents();
        });
    },
   
    renderAllFacets : function(facets){
        var facetHtmlRows = [];
        for (var i = 0; i < facets.length; i++) {
            var data = facets[i];
            var html = this.renderFacet(data.facet, data.values);
            facetHtmlRows.push(html);
        }

        return facetHtmlRows.join("");
    },

    initFromQueryStr : function(queryStr, params) {
    },

    saveInQueryStr : function(queryStr) {
        return queryStr;
    },

    buildRequest : function(request) {
        var query = this.facetCore.getFacetsAsQueryString(this.configuredFacets);

        request += "&facet=true&" + query;
        return request;
    },

    render : function(data) {

    },

    bindEvents : function() {
        var self = this;

        this.view.find(".facetRow a").off('click').on('click', function() {
            var facet = $(this);

            var id = facet.attr("facetname");
            var value = facet.attr("facetvalue");
            var isActive = facet.attr("active");

            var facet = {
                id : id,
                value : value
            };

            self.serendip.trigger("facet.add", facet);
            self.serendip.search();

            // Return false to avoid the a:href executing
            return false;
        });
    },

    renderFacet : function(facet, facetFieldsData) {
        if (facetFieldsData == "")
            return "";

        var facets = this.configuredFacets;

        var facetData = {
            "facetName" : facet.id,
            "facetHeader" : facet.header
        };

        var facetRowData = {
            "facetRow" : facetFieldsData
        };

        var facetsElement = this.prototype.clone();
        facetsElement = facetsElement.find(".Placeholder").autoRender(facetData);
        var facetValues = facetsElement.find(".FacetValues");
        facetValues.autoRender(facetRowData);

        return facetsElement.html();
    }
});
