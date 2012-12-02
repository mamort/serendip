Serendip.FacetsView = (function(serendip, view, prototypes){
    var my = {};

    initActiveFacetsView();
    initInactiveFacetsView();

    serendip.on("views.init", function(){
        init();    
    });
    
    serendip.on("render", function(data){
        render(data);
    });    

    function init() {
        view.hide(); 
    };
    
    function initInactiveFacetsView(self) {
        var inactiveFacetsView = view.find("#InactiveFacets_Theme");
        var inactiveFacetsPrototype = prototypes.find("#FacetRow_Prototype");

        Serendip.InactiveFacetsView(serendip, inactiveFacetsView, inactiveFacetsPrototype);
    };
    
    function initActiveFacetsView(self) {
        var activeFacetsView = view.find("#ActiveFacets_Theme");
        var activeFacetsPrototype = prototypes.find("#ActiveFacets_Prototype");
        
        Serendip.ActiveFacetsView(serendip, activeFacetsView, activeFacetsPrototype);
    };

    function render(data) {
        // Hide facet box if no facets
        if ( typeof (data.facet_counts) != "undefined") {
            view.fadeIn("slow");
        }
    };
    
    return my;
});
