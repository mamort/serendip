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
            if (params["rows_param"]){
                self.resultsToDisplay = params["rows_param"]; 
            }
        });  
        
        this.serendip.on("saveInQueryStr", function(save){
            save("&rows=" + self.resultsToDisplay);
        });         
        
        this.serendip.on("buildRequest", function(save){
            save("&rows=" + self.resultsToDisplay);
        });                
    },

    render : function(data) {
        this.view.find("select").val(this.resultsToDisplay);
    }
}); 