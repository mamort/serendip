Example.ResultPrPageView = (function(serendip, view) {
    var my = Serendip.ResultPrPageView(serendip);
    
    my.resultsToDisplay = 10;
    my.resultsToDisplayName = "Results";
    
    serendip.on("views.init", function(){
       view.find("select").change(function() {
            my.resultsToDisplay = $(this).val();
            serendip.search();
        });  
    });
    
    my.render = function(){
        view.find("select").val(my.resultsToDisplay);
    };
    
    return my;
}); 