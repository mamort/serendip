serendip.on("render.view", function(view, prototype, data){
    var $element = prototype.clone();

    $element = $element.find(".Placeholder").autoRender(data);
    var html = $element.html();

    view.html(html);
})
