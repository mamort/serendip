Serendip.ResultPrPageView = (function(serendip, view, prototype) {
    var resultsToDisplay = 10;
    
    serendip.on("views.init", function(){
        init();
    });

    function init() {
        
       view.find("select").change(function() {
            resultsToDisplay = $(this).val();
            serendip.search();
        }); 
        
        serendip.on("render", function(data){
            render(data);
        });  
        
        serendip.on("initFromQueryStr", function(queryStr, params){
            if (params["Results"]){
                resultsToDisplay = params["Results"]; 
                serendip.trigger("resultsPrPageChanged", resultsToDisplay);
            }
        });  
        
        serendip.on("saveInQueryStr", function(save){
            save("Results", resultsToDisplay, 2);
        });         
        
        serendip.on("buildRequest", function(save){
            save("&rows=" + resultsToDisplay);
        });                
    };

    function render(data) {
        view.find("select").val(resultsToDisplay);
    };
}); 