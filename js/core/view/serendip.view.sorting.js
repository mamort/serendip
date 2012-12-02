Serendip.SortingView = (function(serendip, view) {
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
            save("SortBy", _sortValue, 5);
            save("OrderBy", _sortDir, 5);
        }
    });

    serendip.on("buildRequest", function(save) {
        if (_sortValue && _sortDir && _sortValue != "relevans") {
            save("&sort=" + _sortValue + " " + _sortDir);
        }
    }); 
    
    function initFromQueryStr(queryStr, params) {
        var sortValue = params["SortBy"];
        if (sortValue) {
            var direction = params["OrderBy"];
            if (!direction) {
                direction = "asc";
            }

            _sortQuery = "&sort=" + sortValue + " " + direction;
            _sortValue = sortValue;
            _sortDir = direction;
        }

        queryStr += _sortQuery;

        return queryStr;
    };
    
    function bindEvents() {
        view.find("th .sortfield a").off('click').on('click', function() {

            var id = $(this).attr("sort");
            var dir = $(this).attr("direction");

            var fieldname = serendip.getFieldNameForId(id);

            handleSortClick(fieldname, dir);

            // Return false to avoid the a:href executing
            return false;
        });
    };
    
    function renderFinished() {
        var sortField = _sortValue;

        var sortFieldId = serendip.getIdForFieldName(sortField);

        setSortFieldActive(sortFieldId, _sortDir);
        bindEvents();
    };
    
    function handleSortClick(sortValue, sortDirection) {

        if (sortValue && sortDirection && sortValue != "relevans") {
            _sortQuery = "&sort=" + sortValue + " " + sortDirection;
        } else {
            _sortQuery = "";
        }

        _sortValue = sortValue;
        _sortDir = sortDirection;

        serendip.search();
    };
    
    function setSortFieldActive(sortFieldId, sortDirection) {
        removeAllActiveSortfields();
        makeCurrentSortfieldActive(sortFieldId, sortDirection);
    };
    
    function removeAllActiveSortfields(){
        view.find(".sortfield .active").removeClass("active").addClass("inactive");
    };
    
    function makeCurrentSortfieldActive(sortFieldId, sortDirection){
        var cls = GetClassNameForRows(sortFieldId);
        var row = $("." + cls);

        var newSortDirection = ReverseSortDirection(sortDirection);

        var dirElement = row.find(".sortfield ." + sortDirection);
        dirElement.removeClass(sortDirection).addClass(newSortDirection);

        row.find(".sortfield .inactive").removeClass("inactive").addClass("active");
        row.find(".sortfield a").attr("direction", newSortDirection);
    }
    
    function GetSortField(value) {
        var values = value.split(" ");
        return values[0];
    };
    
    function GetSortDirection(sortValue) {
        var sortDirection = "asc";
        var values = sortValue.split(" ");
        if (values.length > 0) {
            var index = values.length - 1;
            if (values[index] == "desc")
                sortDirection = "desc";
        }

        return sortDirection;
    };
    
    function ReverseSortDirection(direction) {
        if (direction == "asc") {
            return "desc";
        } else {
            return "asc";
        }
    };
    
    function GetClassNameForRows(cls) {
        return cls + "Row";
    };
});
