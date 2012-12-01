Serendip.ResultInfoView = (function(serendip, view, prototype) {

    serendip.on("render", function(data) {
        var infodata = {
            numDocs : data.response.numFound,
            time : data.responseHeader.QTime
        };

        serendip.trigger("render.view", view, prototype, infodata);
    });
});
