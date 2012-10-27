Serendip.ShowMoreFacetsView = Serendip.Class.extend({
    view : null,
    prototype: null,
    
    init : function(serendip){
        var self = this;
        
        serendip.on("render.facets.showmore", function(facets){  
            self.view.find(".lessFacetsTxt").hide();
            self.renderMoreFacets(facets);
            self.bindEvents();
        });
        
    },
    
    renderMoreFacets : function(facets){
        for (var i = 0; i < facets.length; i++) {
            var data = facets[i];
            var facet = data.facet;
            var values = this.getShowMoreFacetRowValues(facet, data.values);
            
            if(values.length > 0){
                var html = this.renderFacetRow(facet, values);
                this.view.find("." + facet.id + " .MoreFacetsValues").html(html).hide();                    
            }else{
                this.view.find("." + facet.id + " .moreFacetsTxt").hide();
            }
        }      
    },
    
    renderFacetRow : function(facet, values){
        var facetRowData = {
            "facetRow" : values
        };
        var facetsElement = this.prototype.clone();
        var facetValues = facetsElement.find(".FacetValues");
        facetValues = facetValues.autoRender(facetRowData);   
        
        return facetValues.html();
    },
    
    getShowMoreFacetRowValues : function(facet, values){
        var visibleValues = [];
        
        var start = facet.minFacetsToDisplay;
        var len = Math.min(facet.maxFacetsToDisplay + start, values.length);
        
        for(var i = start; i < len; i++){
            visibleValues.push(values[i]);
        }
        
        return visibleValues;
    },
    
    bindEvents : function(){
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
