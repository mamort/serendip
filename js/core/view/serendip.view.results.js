Serendip.ResultView = (function(jquery, serendip, view, prototype) {
    var my = {};
    
    serendip.on("render", function(data){
        render(data);
    });
    
    my.render = function(data){
        // Implementations should override this method
    };
    
    function render(data) {
        var docs = data.response.docs;

        var fieldConfig = serendip.fieldConfig;

        var docsDataArr = [];
        for ( i = 0; i < docs.length; i++) {
            var doc = docs[i];
            var docData = processDoc(doc, data.highlighting);
            docsDataArr.push(docData)
        }

        my.render(docsDataArr);
    };

    function processDoc(doc, highlight) {

        var fieldConfig = serendip.fieldConfig;
        var fields = serendip.fields;

        var fieldsArr = {};
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            fieldsArr[field] = doc[field];
            
            var key = getHightlightName(field);
            fieldsArr[key] = getHighlightFieldValue(doc, highlight, field);
        }

        return processDocData(fieldsArr, fields, fieldConfig);
    };

    function processDocData(fields, fieldNames, fieldConfig) {

        var data = {};

        for (var k in fieldConfig) {

            var config = fieldConfig[k];

            var value = getParam(fields, config);

            if (config.isDate && value) {
                try {
                    var date = Serendip.Utils.convertISOFormatToDate(value);
                    value = date.format(config.dateFormat);
                } catch (ex) {
                    if (value == "1-01-01T00:00:00Z") {
                        value = "";
                    } else {
                        value = "Warning: expected date value, but got: " + value;
                    }
                }
            }

            data[config.id] = value;
            
            var key = getHightlightName(config.name);
            var idKey = getHightlightName(config.id);
            data[idKey] = fields[key];
            
            if(config.decodeContent){
                data[idKey] = decodeContent(fields[key]);
            }
        }

        return data;
    };
    
    function getHighlightFieldValue(doc, highlight, field){
        if ( typeof (highlight) != "undefined") {
            var docHighlight = highlight[doc.id];
            if(typeof(docHighlight[field]) != "undefined"){
                return highlight[doc.id][field];        
            }
        }
 
        return "";
    }

    function getParam(fields, config, defaultValue) {
        var value = defaultValue;

        if (fields[config.name]){
            value = fields[config.name];            
        }

        if (Serendip.Utils.isArray(value)) {
            if(config.isMultivalue){
                var valueStr = value + '';
                var values = valueStr.split(config.separator);    
                value = [];
                for(var i = 0; i < values.length; i++){
                    var val = values[i];
                    
                    if(config.decodeContent){
                        val = decodeContent(val);
                    }
                    
                    value.push({value: val});
                }
                
            }else{
                value = value.join("");
                
                if(config.decodeContent){
                    value = decodeContent(value);
                }
            }
        }else{
            if(config.decodeContent){
                value = decodeContent(value);
            }
        }
  

        
        if(typeof(config.defaultValue) != "undefined" && (!value || value == "")){
            value = config.defaultValue;
        }

        return value;
    };
    
    function getHightlightName(field){
        return field + "_hl";
    }
    
    function decodeContent(content){
        return jquery('<div/>').html(content).text();
    };
    
    return my;
}); 