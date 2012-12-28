Example.InProgressView = (function(serendip, view) {

    serendip.on("wait", function() {
        view.show();
    });

    serendip.on("render", function() {
        view.hide();
    });
}); 