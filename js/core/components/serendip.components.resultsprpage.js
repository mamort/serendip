Serendip.ResultPrPageView = Serendip.Class.extend({
    view : null,
    resultsToDisplay : 10,
    serendip : null,

    init : function(serendip) {
        var self = this;
        this.serendip = serendip;
        
       this.view.find("select").change(function() {
            self.resultsToDisplay = $(this).val();
            self.serendip.search();
        }); 
        
        this.serendip.on("render", function(data){
            self.render(data);
        });  
        
        this.serendip.on("initFromQueryStr", function(queryStr, params){
            if (params["Results_param"]){
                self.resultsToDisplay = params["Results_param"]; 
                self.serendip.trigger("resultsPrPageChanged", self.resultsToDisplay);
            }
        });  
        
        this.serendip.on("saveInQueryStr", function(save){
            save("Results", self.resultsToDisplay, 2);
        });         
        
        this.serendip.on("buildRequest", function(save){
            save("&rows=" + self.resultsToDisplay);
        });                
    },

    render : function(data) {
        this.view.find("select").val(this.resultsToDisplay);
    }
}); 