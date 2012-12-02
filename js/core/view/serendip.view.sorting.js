Serendip.SortingView = (function(serendip, view) {
    var my = {};
    
    my.sortValueName = "SortBy";
    my.sortDirectionName = "OrderBy";
    my.sortAscName = "asc";
    my.sortDescName = "desc";    
    
    var _sortQuery = "";
    var _sortValue = "";
    var _sortDir = "";
    var _sortFields = null;

    serendip.on("renderFinished", function() {
        renderFinished();
    });

    serendip.on("initFromQueryStr", function(queryStr, paramsMap) {
        initFromQueryStr(queryStr, paramsMap);
    });

    serendip.on("saveInQueryStr", function(save) {
        if (_sortValue && _sortDir && _sortValue != "relevans") {
            var direction = getSortDirectionName(_sortDir);
            
            save(my.sortValueName, _sortValue, 5);
            save(my.sortDirectionName, direction, 5);
        }
    });

    serendip.on("buildRequest", function(save) {
        if (_sortValue && _sortDir && _sortValue != "relevans") {
            save("&sort=" + _sortValue + " " + _sortDir);
        }
    }); 
    
    my.bindEvents = function(){
        // Implementations should override this method
    };
    
    my.removeAllActiveSortfields = function(){
        // Implementations should override this method
    };    
    
    my.makeCurrentSortfieldActive = function(sortFieldId, sortDirection){
        // Implementations should override this method
    }    
    
    my.sort = function(sortFieldId, sortDirection){   
        var sortValue = serendip.getFieldNameForId(sortFieldId);
        
        if (sortValue && sortDirection && sortValue != "relevans") {
            _sortQuery = "&sort=" + sortValue + " " + sortDirection;
        } else {
            _sortQuery = "";
        }

        _sortValue = sortValue;
        _sortDir = sortDirection;

        serendip.search();       
    };
    
    my.GetSortDirection = function(sortValue) {
        var sortDirection = "asc";
        var values = sortValue.split(" ");
        if (values.length > 0) {
            var index = values.length - 1;
            if (values[index] == "desc")
                sortDirection = "desc";
        }

        return sortDirection;
    };
    
    my.ReverseSortDirection = function(direction) {
        if (direction == "asc") {
            return "desc";
        } else {
            return "asc";
        }
    };    
    
    function initFromQueryStr(queryStr, params) {
        var sortValue = params[my.sortValueName];
        if (sortValue) {
            var direction = getSortDirection(params[my.sortDirectionName]);

            _sortQuery = "&sort=" + sortValue + " " + direction;
            _sortValue = sortValue;
            _sortDir = direction;
        }

        queryStr += _sortQuery;

        return queryStr;
    };
    
    function getSortDirection(sortDirectionParam){
        if(sortDirectionParam == my.sortDescName){
            return "desc";
        }else{
            return "asc";
        }
    }
    
    function getSortDirectionName(sortDirection){
        if(sortDirection == "desc"){
            return my.sortDescName;
        }else{
            return my.sortAscName;
        }
    }
    
    function renderFinished() {
        var sortFieldId = serendip.getIdForFieldName(_sortValue);

        my.removeAllActiveSortfields();
        my.makeCurrentSortfieldActive(sortFieldId, _sortDir);        
        my.bindEvents();
    };
    
    return my;
});
