Serendip.ResultInfoView = Serendip.Class.extend({
    view : null,
    prototype: null,
    serendip: null,

    init : function(serendip) {
        this.serendip = serendip;
    },

    initFromQueryStr : function(queryStr, params) {

    },

    saveInQueryStr : function(queryStr) {
        return queryStr;
    },

    buildRequest : function(request) {
        return request;
    },

    render : function(data) {
        var infodata = {
            numDocs : data.response.numFound,
            time : data.responseHeader.QTime
        };
        
        var html = this.serendip.render(this.prototype, infodata);
        this.view.html(html);
    }
}); 