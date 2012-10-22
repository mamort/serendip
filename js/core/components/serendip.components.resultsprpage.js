Serendip.ResultPrPageView = Serendip.Class.extend({
    view : null,
    numResults : 10,
    serendip : null,

    init : function(serendip) {
        var self = this;
        this.serendip = serendip;
        
       this.view.find("select").change(function() {
            self.numResults = $(this).val();
            self.serendip.search();
        }); 
    },

    initFromQueryStr : function(queryStr, params) {

    },

    saveInQueryStr : function(queryStr) {
        return queryStr;
    },

    buildRequest : function(request) {
        request += "&rows=" + this.numResults;
        return request;
    },

    render : function(data) {
        this.view.find("select").val(this.numResults);
    }
}); 