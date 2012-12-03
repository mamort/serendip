Example = {};

Example.TemplateHelper = ( function() {
    var my = {};

    my.render = function(view, prototype, data) {
        var $element = prototype.clone();

        $element = $element.find(".Placeholder").autoRender(data);
        var html = $element.html();

        view.html(html);
    };
    
    return my;
}());
