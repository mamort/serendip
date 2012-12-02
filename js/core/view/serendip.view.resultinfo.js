Serendip.ResultInfoView = (function(serendip, view, prototype) {

    serendip.on("render", function(data) {
        var infodata = {
            numDocs : data.response.numFound,
            time : data.responseHeader.QTime
        };

        Serendip.View.Render.render(view, prototype, infodata);
    });
});
