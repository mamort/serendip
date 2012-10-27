Serendip.ResultView = Serendip.Class.extend({
    view : null,
    prototype : null,
    serendip : null,

    init : function(serendip) {
        var self = this;
        this.serendip = serendip;
        
        this.serendip.on("render", function(data){
            self.render(data);
        });        
    },
    
    render : function(data) {
        var docs = data.response.docs;

        var fieldConfig = this.serendip.fieldConfig;

        var docsDataArr = [];
        for ( i = 0; i < docs.length; i++) {
            var docData = this.processDoc(docs[i], data.highlighting);
            docsDataArr.push(docData)
        }

        this.renderDocuments(docsDataArr);
    },

    processDoc : function(doc, highlight) {

        var fieldConfig = this.serendip.fieldConfig;
        var fields = this.serendip.fields;
        var highlightFields = this.serendip.highlightFields;

        var fieldsArr = {};
        for (var i = 0; i < fields.length; i++) {
            fieldsArr[fields[i]] = this.getFieldValue(doc, highlight, fields[i]);
        }

        for (var i = 0; i < highlightFields.length; i++) {
            fieldsArr[highlightFields[i]] = this.getFieldValue(doc, highlight, highlightFields[i]);
        }

        return this.processDocData(fieldsArr, fields, fieldConfig);
    },

    processDocData : function(fields, fieldNames, fieldConfig) {

        var data = {};

        for (var k in fieldConfig) {

            var config = fieldConfig[k];

            var value = this.getParam(fields, config.name);

            if (config.isDate && value) {
                try {
                    var date = ISODate.convert(value);
                    value = date.format(config.dateFormat);
                } catch (ex) {
                    if (value == "1-01-01T00:00:00Z") {
                        value = "Ingen verdi";
                    } else {
                        value = "Warning: expected date value, but got: " + value;
                    }
                }
            }

            data[config.id] = value;
        }

        return data;
    },

    renderDocuments : function(docsData) {

        var data = {
            docs : docsData
        };
        
        var html = this.serendip.render(this.prototype, data);
        this.view.html(html);

    },

    getFieldValue : function(doc, highlight, field) {
        var value;

        if ( typeof (highlight) == "undefined") {
            value = doc[field];
        } else {
            value = highlight[doc.id][field];
        }

        if ( typeof (value) == "undefined")
            value = doc[field];

        return value;
    },

    getParam : function(fields, param, defaultValue) {
        var value = defaultValue;

        if (fields[param])
            value = fields[param];

        if (isArray(value)) {
            value = value.join("");
        }

        return value;
    }
}); 