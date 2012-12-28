Example = {};

Example.TemplateHelper = ( function() {
    var my = {};

    my.render = function(view, data) {
        
        var html = "<table>";
        for(var i = 0; i < data.docs.length; i++){
            var doc = data.docs[i];
            
            html += "<tr>";
            html += "<td>" + doc.Firstname + "</td>";
            html += "<td>" + doc.Lastname + "</td>";
            html += "<td>" + doc.Address + "</td>";
            html += "<td>" + doc.Email + "</td>";
            html += "</tr>";
        }
        html += "</table>";


        view.html(html);
    };
    
    return my;
}());
