Serendip.ResultView = (function(serendip, view, prototype) {
    var my = {};
    
    serendip.on("render", function(data){
        render(data);
    });
    
    my.render = function(){
        // Implementations should override this method
    };
    
    function render(data) {
        var docs = data.response.docs;

        var fieldConfig = serendip.fieldConfig;

        var docsDataArr = [];
        for ( i = 0; i < docs.length; i++) {
            var docData = processDoc(docs[i], data.highlighting);
            docsDataArr.push(docData)
        }

        my.render(docsDataArr);
    };

    function processDoc(doc, highlight) {

        var fieldConfig = serendip.fieldConfig;
        var fields = serendip.fields;
        var highlightFields = serendip.highlightFields;

        var fieldsArr = {};
        for (var i = 0; i < fields.length; i++) {
            fieldsArr[fields[i]] = getFieldValue(doc, highlight, fields[i]);
        }

        for (var i = 0; i < highlightFields.length; i++) {
            fieldsArr[highlightFields[i]] = getFieldValue(doc, highlight, highlightFields[i]);
        }

        return processDocData(fieldsArr, fields, fieldConfig);
    };

    function processDocData(fields, fieldNames, fieldConfig) {

        var data = {};

        for (var k in fieldConfig) {

            var config = fieldConfig[k];

            var value = getParam(fields, config.name);

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
        }

        return data;
    };

    function getFieldValue(doc, highlight, field) {
        var value;

        if ( typeof (highlight) == "undefined") {
            value = doc[field];
        } else {
            value = highlight[doc.id][field];
        }

        if ( typeof (value) == "undefined")
            value = doc[field];

        return value;
    };

    function getParam(fields, param, defaultValue) {
        var value = defaultValue;

        if (fields[param])
            value = fields[param];

        if (Serendip.Utils.isArray(value)) {
            value = value.join("");
        }

        return value;
    };
    
    return my;
}); 