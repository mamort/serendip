Example.ResultView = (function(serendip, view) {

    var my = Serendip.ResultView(serendip, view);
    
    my.render = function(data){
        Example.TemplateHelper.render(view, { docs: data});
    };
}); 