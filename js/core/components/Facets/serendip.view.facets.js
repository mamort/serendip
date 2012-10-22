Serendip.FacetsView = Serendip.Class.extend({
    serendip : null,
    view : null,
    prototypes : null,

    maxFacetsToDisplay : 0,

    facetCore: null,
    activeFacetsView : null,
    inactiveFacetsView : null,

    init : function(serendip) {
        this.serendip = serendip;

        this.view.hide();

        initFacetCore(this);
        initActiveFacetsView(this);
        initInactiveFacetsView(this);

        function initFacetCore(self) {
            self.facetCore = new Serendip.FacetsCore({
                facets : self.serendip.facets
            });

            self.facetCore.init(self.serendip);
        }

        function initActiveFacetsView(self) {
            self.activeFacetsView = new Serendip.ActiveFacetsView({
                configuredFacets : self.serendip.facets,
                view : self.view.find("#ActiveFacets_Theme"),
                prototype : self.prototypes.find("#ActiveFacets_Prototype"),

                maxFacetsToDisplay : 5
            });

            self.activeFacetsView.init(self.serendip, self.facetCore);
        }

        function initInactiveFacetsView(self) {
            self.inactiveFacetsView = new Serendip.InactiveFacetsView({
                configuredFacets : self.serendip.facets,
                view : self.view.find("#InactiveFacets_Theme"),
                prototype : self.prototypes.find("#FacetRow_Prototype"),
                
                maxFacetsToDisplay : 5
            });

            self.inactiveFacetsView.init(self.serendip, self.facetCore);
        }

    },

    initFromQueryStr : function(queryStr, params) {
        this.activeFacetsView.initFromQueryStr(queryStr, params);
        this.inactiveFacetsView.initFromQueryStr(queryStr, params);
    },

    saveInQueryStr : function(queryStr) {
        queryStr = this.activeFacetsView.saveInQueryStr(queryStr);
        queryStr = this.inactiveFacetsView.saveInQueryStr(queryStr);
        return queryStr;
    },

    buildRequest : function(request) {
        request = this.activeFacetsView.buildRequest(request);
        request = this.inactiveFacetsView.buildRequest(request);
        return request;
    },

    render : function(data) {

        // Hide facet box if no facets
        if ( typeof (data.facet_counts) != "undefined") {
            this.view.fadeIn("slow");
        }

        this.activeFacetsView.render(data);
        this.inactiveFacetsView.render(data);
    }
});
