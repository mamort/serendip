Example.SearchView = (function(serendip, view) {
    
    var my = Serendip.SearchView(serendip);
    
    var _input = null;
    
    serendip.on("views.init", function(){
        _input = view.find(".input");

        view.find(".button").click(function() {
            serendip.search(_input.val());

            return false;
        });
    });
    
    my.getSearchValue = function(){
        return _input.val();
    }
    
    my.setSearchValue = function(value){
        _input.val(value);
    }     
        
    return my;
});
