Example.InactiveFacetsShowMoreFacetsView = (function(serendip, view, prototype) {

    serendip.on("render.inactivefacets.done", function(facets){  
        view.find(".moreFacetsTxt").show();
        renderMoreFacets(facets);
        bindEvents();
    });
        
    function renderMoreFacets(facets){
        for (var i = 0; i < facets.length; i++) {
            var data = facets[i];
            var facet = data.facet;
            var values = getShowMoreFacetRowValues(facet, data.values);
            
            if(values.length > 0){
                var html = renderFacetRow(facet, values);
                view.find("." + facet.id + " .MoreFacetsValues").html(html).hide();                    
            }else{
                view.find("." + facet.id + " .moreFacetsTxt").hide();
            }
        }      
    };
    
    function renderFacetRow(facet, values){
        var facetRowData = {
            "facetRow" : values
        };
        var facetsElement = prototype.clone();
        var facetValues = facetsElement.find(".FacetValues");
        facetValues = facetValues.autoRender(facetRowData);   
        
        return facetValues.html();
    };
    
    function getShowMoreFacetRowValues(facet, values){
        var visibleValues = [];
        
        var start = facet.minFacetsToDisplay;
        var len = Math.min(facet.maxFacetsToDisplay + start, values.length);
        
        for(var i = start; i < len; i++){
            visibleValues.push(values[i]);
        }
        
        return visibleValues;
    };
    
    function bindEvents(){
        view.find("a.moreFacets").off('click').on('click', function() {
            handleShowMoreLess($(this));
            return false;
        });        
    };

    function handleShowMoreLess(element) {
        var id = element.attr("facetname");

        var selector = "." + id + " .MoreFacetsValues";
        var $moreFacets = view.find(selector);

        selector = "." + id + " .moreFacetsTxt";
        var $moreFacetsTxt = view.find(selector);

        selector = "." + id + " .lessFacetsTxt";
        var $lessFacetsTxt = view.find(selector);

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
    };
});
