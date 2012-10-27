Serendip.InactiveFacetsView = Serendip.Class.extend({
    configuredFacets : null,

    serendip : null,
    view : null,
    prototype : null,

    maxFacetsToDisplay : 5,
    showMoreFacetsView : null,

    init : function(serendip) {
        var self = this;

        this.serendip = serendip;  
        this.showMoreFacetsView = this.createMoreFacetsView();

        this.serendip.on("render.facets.inactive", function(facets, visibleFacets) {
            var html = self.renderAllFacets(visibleFacets);
            self.view.html(html);
            
            serendip.trigger("render.facets.showmore", facets);
            self.bindEvents();
        });             
    },
   
    createMoreFacetsView : function(){
        var showMoreFacetsView = new Serendip.ShowMoreFacetsView({
            view : this.view,
            prototype : this.prototype
        });
        
        showMoreFacetsView.init(this.serendip);    
        
        return showMoreFacetsView;
    },

    bindEvents : function() {
        var self = this;

        this.view.find(".facetRow a").off('click').on('click', function() {
            var facet = $(this);

            var id = facet.attr("facetname");
            var value = facet.attr("facetvalue");
            var isActive = facet.attr("active");

            self.serendip.trigger("facet.add", {id: id, value: value});
            self.serendip.search();

            // Return false to avoid the a:href executing
            return false;
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
