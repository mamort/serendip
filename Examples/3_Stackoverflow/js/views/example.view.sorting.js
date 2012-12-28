Example.SortingView = (function(serendip, view) {

    var my = Serendip.SortingView(serendip, view);
    
    my.sortValueName = "SortBy";
    my.sortDirectionName = "Order";
    my.sortAscName = "Low to high";
    my.sortDescName = "High to low";
    
    my.bindEvents = function(){

        view.find(".sortfield").off('change').on('change', function() {

            var selected = $(this).find(':selected');
            var id = selected.data('field');
            var dir = selected.data('direction')
            
            try{
                my.sort(id, dir);
            }catch(ex){
                alert(ex.message);
            }
            
            // Return false to avoid the a:href executing
            return false;
        });
    };
    
    my.removeAllActiveSortfields = function(){
    };
    
    my.makeCurrentSortfieldActive = function(sortFieldId, sortDirection){
        var value = sortFieldId + "-" + sortDirection;
        view.find(".sortfield").val(value);
    };
}); 