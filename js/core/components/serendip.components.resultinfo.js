Serendip.ResultInfoView = Serendip.Class.extend({
    view : null,
    prototype: null,
    serendip: null,

    init : function(serendip) {
        var self = this;
        this.serendip = serendip;
        
        this.serendip.on("render", function(data){
            self.render(data);
        }); 
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