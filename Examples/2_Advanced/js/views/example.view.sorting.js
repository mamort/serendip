Example.SortingView = (function(serendip, view) {

    var my = Serendip.SortingView(serendip, view);
    
    my.sortValueName = "SortBy";
    my.sortDirectionName = "Order";
    my.sortAscName = "Low to high";
    my.sortDescName = "High to low";
    
    my.bindEvents = function(){
        view.find("th .sortfield a").off('click').on('click', function() {
            var id = $(this).attr("sort");
            var dir = $(this).attr("direction");

            my.sort(id, dir);

            // Return false to avoid the a:href executing
            return false;
        });
    };
    
    my.removeAllActiveSortfields = function(){
        view.find(".sortfield .active").removeClass("active").addClass("inactive");
    };
    
    my.makeCurrentSortfieldActive = function(sortFieldId, sortDirection){
        var cls = getClassNameForRows(sortFieldId);
        var row = $("." + cls);

        var newSortDirection = my.ReverseSortDirection(sortDirection);

        var dirElement = row.find(".sortfield ." + sortDirection);
        dirElement.removeClass(sortDirection).addClass(newSortDirection);

        row.find(".sortfield .inactive").removeClass("inactive").addClass("active");
        row.find(".sortfield a").attr("direction", newSortDirection);
    };    
    
    function getClassNameForRows(cls) {
        return cls + "Row";
    };    
    
}); 