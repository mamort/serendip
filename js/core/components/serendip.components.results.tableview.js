var cookieFilters = null;
var cookieFields = null;

$(document).ready(function(){  
	serendip.onReady(initResultTableView);
	serendip.OnRenderStart(configureResultTableView);
});

function initResultTableView(){
	ConfigureTableView(serendip.fieldConfig);
}

function configureResultTableView(){
  var proto = $("#Results_Prototype_TableView table");

  ReconfigureTableElements(proto, "th");
  ReconfigureTableElements(proto, "td");
}


function GetVisibleColumns(elementType){
  var list = [];

  $("#ResultsTableView_Theme table " + elementType).each(function(){
      if($(this).css("display") != "none"){
         var cls = $(this).attr("class");
         list.push(cls);
      }
  });
  
  return list;
}

function GetClassNameForRows(cls){
    return cls + "Row";
}

function ReconfigureTableElements(proto, elementType){
  
  var list = GetVisibleColumns(elementType);
  list = list.reverse();
  
  RearrangeTablePrototypeColumns(proto, elementType, list);
}

function RearrangeTablePrototypeColumns(proto, elementType, list){
  for(var key in list){
    var cls = list[key];
    
    var row = proto.find(elementType + "." + cls);
    var parent = row.parent();
     
    parent.remove(row);
    parent.prepend(row);
  }
}

function ConfigureTableView(fields){
  var header = $("#Results_Prototype_TableView table th:first");
  var row = $("#Results_Prototype_TableView table td:first");
  
  var headerParent = header.parent();
  var rowParent = row.parent();
  
  headerParent.find("th").each(function(){
      $(this).remove();
  });

  var oldRowTmpls = rowParent.clone();
  
  rowParent.find("td").each(function(){
      $(this).remove();
  });

  for(var i = 0; i < fields.length; i++){
    var field = fields[i];
	if(field.selected == false) continue;
    var cls = GetClassNameForRows(field.id);

    var newHeader = header.clone();

    newHeader.attr("class", cls);

    newHeader.find(".sortfield a").each(function () {
        $(this).attr("sort", field.id);
    });

    newHeader.find(".header").each(function () {
        $(this).text(field.header);
    });
    
    headerParent.append(newHeader);
    
    var newRow = oldRowTmpls.find("td." + cls);
    
    if(newRow.length == 0){
        newRow = row.clone();
        newRow.append("<span class='" + field.id + "'></span>");
        newRow.attr("class", cls);
    }
    
    rowParent.append(newRow);
  }
}