Example.FacetsView = (function(serendip, view){
    serendip.on("views.init", function(){
        view.hide();  
    });
    
    serendip.on("render", function(data){
        if ( typeof (data.facet_counts) != "undefined") {
            view.fadeIn("slow");
        }
    });    
});
