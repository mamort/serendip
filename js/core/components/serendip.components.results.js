Serendip.ResultView = Serendip.Class.extend({
  selector: "#ResultView",
  prototypeSelector: "#Result_Prototype",
  inProgressSelector: "",
  resultsToDisplay: 10,
  
  $resultsView: null,
  $prototypeView: null,
  $inProgress: null,
  
  manager: null,
  
  init : function(manager){
      this.manager = manager;
      this.$resultsView = $(this.selector);
      this.$prototypeView = $(this.prototypeSelector);
      this.$inProgress = $(this.inProgressSelector);
      
      this.$inProgress.hide();
  },
  
  initFromQueryStr: function(queryStr, params){
      
  },  
  
  saveInQueryStr: function(queryStr){
      return queryStr;
  },
  
  buildRequest : function(request){
      request += "&rows=" + this.resultsToDisplay; 
      
      return request;
  },   
  
  renderInProgress: function(){
      this.renderInProgressIcon(this.$resultsView, this.$inProgress);
  },  
  
  renderInProgressIcon: function(element, $inProgress){
      var height = element.height();
      if(height > 0){
          $inProgress.height(height);
      }
      element.hide();
      $inProgress.show();   
  },  
  
  render : function(data) {
      this.$inProgress.hide();
      this.$resultsView.show();
            
      var docs = data.response.docs;

      var fieldConfig = this.manager.fieldConfig;
         
      var docsDataArr = [];
      for (i = 0; i < docs.length; i++) {
          var docData = this.processDoc(docs[i], data.highlighting);
          docsDataArr.push(docData)
      }

      this.renderDocumentsWithPure(docsDataArr);
  },
  
  processDoc : function(doc, highlight) {

      var fieldConfig = this.manager.fieldConfig;
      var fields = this.manager.fields;
      var highlightFields = this.manager.highlightFields;
      
      var fieldsArr = {};
      for (var i = 0; i < fields.length; i++) {
          fieldsArr[fields[i]] = this.getFieldValue(doc, highlight, fields[i]);
      }

      for (var i = 0; i < highlightFields.length; i++) {
          fieldsArr[highlightFields[i]] = this.getFieldValue(doc, highlight, highlightFields[i]);
      }

      return this.processDocData(fieldsArr, fields, fieldConfig);
  },
  
  processDocData: function (fields, fieldNames, fieldConfig) {

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

  renderDocumentsWithPure : function(docsData){
      
      var data = {docs: docsData};
      
      var $element = this.$prototypeView.clone();
      $element = $element.find(".Placeholder").autoRender(data);
      
      this.$resultsView.html($element.html());
  },
  
  getFieldValue : function(doc, highlight, field) {
        var value;

        if (typeof (highlight) == "undefined") {
            value = doc[field];
        } else {
            value = highlight[doc.id][field];
        }

        if (typeof (value) == "undefined")
            value = doc[field];

        return value;
  },
  
  getParam: function(fields, param, defaultValue){
      var value = defaultValue;
      
      if(fields[param])
          value = fields[param];   
          
      if(isArray(value)){
          value = value.join("");
      }
          
       return value;
  }

});