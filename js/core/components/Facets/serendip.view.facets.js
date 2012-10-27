Serendip.FacetsView = Serendip.Class.extend({
    serendip : null,
    view : null,
    prototypes : null,

    maxFacetsToDisplay : 0,

    activeFacetsView : null,
    inactiveFacetsView : null,

    init : function(serendip) {
        var self = this;
        this.serendip = serendip;

        this.view.hide();

        initActiveFacetsView(this);
        initInactiveFacetsView(this);
        
        this.serendip.on("render", function(data){
            self.render(data);
        }); 

        function initActiveFacetsView(self) {
            self.activeFacetsView = new Serendip.ActiveFacetsView({
                configuredFacets : self.serendip.facets,
                view : self.view.find("#ActiveFacets_Theme"),
                prototype : self.prototypes.find("#ActiveFacets_Prototype"),

                maxFacetsToDisplay : 5
            });

            self.activeFacetsView.init(self.serendip);
        }

        function initInactiveFacetsView(self) {
            self.inactiveFacetsView = new Serendip.InactiveFacetsView({
                configuredFacets : self.serendip.facets,
                view : self.view.find("#InactiveFacets_Theme"),
                prototype : self.prototypes.find("#FacetRow_Prototype"),
                
                maxFacetsToDisplay : 5
            });

            self.inactiveFacetsView.init(self.serendip);
        }

    },

    render : function(data) {
        // Hide facet box if no facets
        if ( typeof (data.facet_counts) != "undefined") {
            this.view.fadeIn("slow");
        }
    }
});
