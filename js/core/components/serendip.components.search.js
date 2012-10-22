Serendip.SearchView = Serendip.Class.extend({
    view : null,
    serendip : null,

    input : null,

    init : function(serendip) {
        this.serendip = serendip;
        var self = this;

        this.input = $(this.view).find(".input");

        $(this.view).find(".button").click(function() {

            self.serendip.search(self.input.val());

            return false;
        });
    },

    initFromQueryStr : function(queryStr, params) {
        this.input.val(params["q_param"]);
    },

    saveInQueryStr : function(queryStr) {
        var value = this.input.val();
        value = encodeURIComponent(value);
        queryStr += "&q=" + value;

        return queryStr;
    },

    buildRequest : function(request) {
        var queryValue = this.input.val();

        // Illegal to start query with '*' or '?'
        if (queryValue[0] == '*' || queryValue[0] == '?') {
            queryValue = queryValue.substring(1, queryValue.length);
            this.input.val(queryValue);
        }

        if (queryValue == "") {
            queryValue = "*:*";
        }

        var query = encodeURIComponent(queryValue);

        request += "&q=" + query;

        return request;
    },

    render : function(data) {

    }
}); 