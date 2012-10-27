Serendip.SortingView = Serendip.Class.extend({
    view : null,
    serendip : null,

    sortQuery : "",
    sortValue : "",
    sortDir : "",
    sortFields : null,

    init : function(serendip) {
        this.serendip = serendip;
        var self = this;

        this.serendip.on("renderFinished", function() {
            self.renderFinished(self);
        });
        
        this.serendip.on("initFromQueryStr", function(queryStr, paramsMap){
            self.initFromQueryStr(queryStr, paramsMap);
        });  
        
        this.serendip.on("saveInQueryStr", function(save){
            if (self.sortValue && self.sortDir && self.sortValue != "relevans") {
                var value = "&sort=" + self.sortValue + " " + self.sortDir;
                save(value);
            }    
        });  
        
        this.serendip.on("buildRequest", function(save){
            if (self.sortValue && self.sortDir && self.sortValue != "relevans") {
                save("&sort=" + self.sortValue + " " + self.sortDir);
            }  
        });                           
    },

    initFromQueryStr : function(queryStr, params) {
        var sortParam = params["sort_param"];
        if (sortParam) {
            this.sortQuery = "&sort=" + sortParam;
            this.sortValue = this.GetSortField(sortParam);
            this.sortDir = this.GetSortDirection(sortParam);
        }

        queryStr += this.sortQuery;

        return queryStr;
    },

    bindEvents : function() {
        var self = this;
        
        this.view.find("th .sortfield a").off('click').on('click', function() {

            var id = $(this).attr("sort");
            var dir = $(this).attr("direction");

            var fieldname = self.GetFieldNameForId(id);

            self.handleSortClick(fieldname, dir);

            // Return false to avoid the a:href executing
            return false;
        });
    },   

    renderFinished : function(self) {
        var sortField = this.sortValue;

        var sortFieldId = this.GetIdForFieldName(sortField);

        this.setSortFieldActive(sortFieldId, this.sortDir);
        this.bindEvents();
    },
    
    handleSortClick : function(sortValue, sortDirection) {

        if (sortValue && sortDirection && sortValue != "relevans") {
            this.sortQuery = "&sort=" + sortValue + " " + sortDirection;
        } else {
            this.sortQuery = "";
        }

        this.sortValue = sortValue;
        this.sortDir = sortDirection;

        this.serendip.search();
    },    

    setSortFieldActive : function(sortFieldId, sortDirection) {
        var cls = this.GetClassNameForRows(sortFieldId);

        // Remove all active sortfields
        this.view.find(".sortfield .active").removeClass("active").addClass("inactive");

        // Make current sortfield active
        var row = $("." + cls);

        var newSortDirection = this.ReverseSortDirection(sortDirection);

        var dirElement = row.find(".sortfield ." + sortDirection);
        dirElement.removeClass(sortDirection).addClass(newSortDirection);

        row.find(".sortfield .inactive").removeClass("inactive").addClass("active");
        row.find(".sortfield a").attr("direction", newSortDirection);
    },

    GetSortField : function(value) {
        var values = value.split(" ");
        return values[0];
    },

    GetSortDirection : function(sortValue) {
        var sortDirection = "asc";
        var values = sortValue.split(" ");
        if (values.length > 0) {
            var index = values.length - 1;
            if (values[index] == "desc")
                sortDirection = "desc";
        }

        return sortDirection;
    },

    ReverseSortDirection : function(direction) {
        if (direction == "asc") {
            return "desc";
        } else {
            return "asc";
        }
    },

    GetFieldNameForId : function(id) {
        var fieldConfig = serendip.fieldConfig;

        for (var i = 0; i < fieldConfig.length; i++) {
            var config = fieldConfig[i];
            if (config.id == id) {
                return config.name;
            }
        }

        return "";
    },

    GetIdForFieldName : function(name) {
        var fieldConfig = serendip.fieldConfig;

        for (var i = 0; i < fieldConfig.length; i++) {
            var config = fieldConfig[i];
            if (config.name == name) {
                return config.id;
            }
        }

        return "";
    },

    GetClassNameForRows : function(cls) {
        return cls + "Row";
    }
}); 