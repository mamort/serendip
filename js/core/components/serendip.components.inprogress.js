Serendip.InProgressView = (function(serendip, view) {

    serendip.on("views.init", function() {
        init();
    });

    serendip.on("wait", function() {
        view.show();
    });

    serendip.on("render", function() {
        view.hide();
    });

    function init() {
        view.hide();
    };

}); 