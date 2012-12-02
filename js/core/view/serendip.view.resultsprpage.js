Serendip.ResultPrPageView = (function(serendip, view) {
    var my = {};
    
    my.resultsToDisplay = 10;
    my.resultsToDisplayName = "Results";
        
    serendip.on("render", function(data){
        my.render();
    });  
    
    serendip.on("initFromQueryStr", function(queryStr, params){
        if (params[my.resultsToDisplayName]){
            my.resultsToDisplay = params[my.resultsToDisplayName]; 
            serendip.trigger("resultsPrPageChanged", my.resultsToDisplay);
        }
    });  
    
    serendip.on("saveInQueryStr", function(save){
        save(my.resultsToDisplayName, my.resultsToDisplay, 2);
    });         
    
    serendip.on("buildRequest", function(save){
        save("&rows=" + my.resultsToDisplay);
    }); 

    my.render = function(){
        // Implementations should override this method
    }
    
    return my;
}); 