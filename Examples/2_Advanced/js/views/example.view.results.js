Example.ResultView = (function(serendip, view, prototype) {

    var my = Serendip.ResultView(serendip, view, prototype);
    
    my.render = function(data){
        Example.TemplateHelper.render(view, prototype, { docs: data});
    };
}); 