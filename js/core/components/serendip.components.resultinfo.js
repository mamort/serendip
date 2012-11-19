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
        
        this.serendip.trigger("render.view", this.view, this.prototype, infodata);
    }
}); 