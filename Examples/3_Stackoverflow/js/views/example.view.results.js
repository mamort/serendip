Example.ResultView = (function(serendip, view, prototype) {
    
    var minRowHeight = 62;
    var maxRowHeight = minRowHeight * 4;

    var my = Serendip.ResultView(jQuery, serendip, view, prototype);
    
    my.render = function(data){
        modifyData(data);
        renderData(data);
        updateShowMore();
        bindEvents();
    };
    
    function modifyData(data){
        for(var i = 0; i < data.length; i++){
            var doc = data[i];
            data[i].Url = "http://stackoverflow.com/questions/" + doc.Id;
        }
    };
    
    function renderData(data){
        
        var directive = {
            '.docs': {
                'doc<-docs': { // "for doc in docs"
                    '.Title': 'doc.Title_hl',
                    '.Title@href': 'doc.Url',
                    '.Body': 'doc.Body_hl',
                    '.CreationDate': 'doc.CreationDate',
                    '.AnswerCount': 'doc.AnswerCount',
                    '.VoteCount': 'doc.VoteCount',
                    '.ViewCount': 'doc.ViewCount',
                    '.Tag li': {
                        'tag<-doc.Tag': { // "for tag in doc.Tags"
                            '.value': 'tag.value'
                        }
                    }
                }
            }
        };
        
        Example.TemplateHelper.render(view, prototype, { docs: data}, directive);
    };
    
    function updateShowMore(){
        view.find(".ShowLess").hide();
        
        view.find(".docs").each(function(){
            var body = $(this).find(".Body");
            var contentHeight = body.addClass('expand').height();
            body.removeClass('expand');
            
            if(contentHeight <= minRowHeight){
                $(this).find(".ShowMore").hide();
            }
        });
    };
    
    function bindEvents(){

        view.find(".ShowMore").on("click", function(){
            var content = $(this).parent();
            var body = content.find(".Body");

            var contentHeight = body.addClass('expand').height();

            if(contentHeight > maxRowHeight){
                contentHeight = maxRowHeight;
            }
            
            body.removeClass('expand').animate({ 
                height: contentHeight
            }, 500);
            
            $(this).hide();
            content.find(".ShowLess").show();
            return false;
        });
        
        view.find(".ShowLess").on("click", function(){
            var content = $(this).parent();
            var body = content.find(".Body");
            
            body.removeClass('expand').animate({ 
                height: minRowHeight
            }, 500);
            
            $(this).hide();
            content.find(".ShowMore").show();
            return false;
        }); 
    }
}); 