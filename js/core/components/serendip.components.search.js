Serendip.SearchView = Serendip.Class.extend({
    view : null,
    serendip : null,

    input : null,

    init : function(serendip) {
        this.serendip = serendip;
        var self = this;

        this.input = this.view.find(".input");

        this.view.find(".button").click(function() {

            self.serendip.search(self.input.val());

            return false;
        });

        this.serendip.on("initFromQueryStr", function(queryStr, params) {
            self.input.val(params["q_param"]);
        });

        this.serendip.on("saveInQueryStr", function(save) {
            var value = self.input.val();
            value = encodeURIComponent(value);
            if (value && value != "") {
                save("&q=" + value);
            }
        });

        this.serendip.on("buildRequest", function(save) {
            var req = self.buildRequest();
            save(req);
        });
    },

    buildRequest : function() {
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
        return "&q=" + query;
    }
});
