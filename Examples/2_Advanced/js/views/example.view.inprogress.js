Example.InProgressView = (function(serendip, view) {

    serendip.on("views.init", function() {
        view.hide();
    });

    serendip.on("wait", function() {
        view.show();
    });

    serendip.on("render", function() {
        view.hide();
    });
}); 