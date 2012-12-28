Example.ResultInfoView = (function(serendip, view, prototype) {

    serendip.on("render", function(data) {
        var infodata = {
            numDocs : data.response.numFound,
            time : data.responseHeader.QTime
        };

        Example.TemplateHelper.render(view, prototype, infodata);
    });
});
