Example = {};

Example.TemplateHelper = ( function() {
    var my = {};

    my.render = function(view, prototype, data, directive) {
        var $element = prototype.clone();
        

        if(directive){
            $element = $element.find(".Placeholder").render(data, directive);
        }else{
            $element = $element.find(".Placeholder").autoRender(data);
        }
        
        var html = $element.html();

        view.html(html);
    };
    
    return my;
}());
