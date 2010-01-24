/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * http://blog.stevenlevithan.com/archives/date-time-format
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};


var ISODate = {
    convert : function (input){
        if (!(typeof input === "string")) throw "ISODate, convert: input must be a string";
        var d = input.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(([+-])(\d{2}):(\d{2})))$/i);
        if (!d) throw "ISODate, convert: Illegal format";
        return new Date(
                Date.UTC(d[1],d[2]-1,d[3],d[4],d[5],d[6]|0,(d[6]*1000-((d[6]|0)*1000))|0,d[7]) +
                (d[7].toUpperCase() ==="Z" ? 0 : (d[10]*3600 + d[11]*60) * (d[9]==="-" ? 1000 : -1000))
        );
    }
};

/* General purpose functions */

String.prototype.trim = function() {return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};


var Serendip = function(){};

Serendip.Class = function () {};

Serendip.Class.extend = function (properties) {
  var klass = this; 
  var subClass = function (options) {
    Serendip.extend(this, new klass(options), properties, options);
  }
  subClass.extend = this.extend;
  return subClass;
};


Serendip.extend = function () {
  var target = arguments[0] || {}, i = 1, length = arguments.length, options;
  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (var name in options) {
        var src = target[name], copy = options[name];
        if (target === copy) {
          continue;
        }
        if (copy && typeof copy == 'object' && !copy.nodeType) {
          target[name] = Serendip.extend(src || (copy.length != null ? [] : {}), copy);
        }
        else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
};

Serendip.Core = Serendip.Class.extend({

  search: null,

  decode: function utf8decode(str) {

    // Converts a UTF-8 encoded string to ISO-8859-1  
    // 
    // version: 903.3016
    // discuss at: http://phpjs.org/functions/utf8_decode
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Norman "zEh" Fuchs
    // +   bugfixed by: hitwork
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brettz9.blogspot.com)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: utf8_decode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'
	    var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
	    
	    str += '';
	    
	    while ( i < str.length ) {
	        c1 = str.charCodeAt(i);
	        if (c1 < 128) {
	            tmp_arr[ac++] = String.fromCharCode(c1);
	            i++;
	        } else if ((c1 > 191) && (c1 < 224)) {
	            c2 = str.charCodeAt(i+1);
	            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
	            i += 2;
	        } else {
	            c2 = str.charCodeAt(i+1);
	            c3 = str.charCodeAt(i+2);
	            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	            i += 3;
	        }
	    }

	    return tmp_arr.join('');
	},
	
  encode: function utf8encode(string) {
		var utftext = ""; 
		for (var n = 0; n < string.length; n++) { 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return escape(utftext);
	},
	
  getParamsAsQueryString: function(params){
    var query = "";
    
    for(var i = 0; i < params.length; i++){
      query = query + params[i];
      if(i < params.length-1)
        query = query + "&";
    }
    
    return query;
  },
  
  getFacetsAsQueryString : function(facets){
    var query = "";
    
    for(var i = 0; i < facets.length; i++){
      var name = facets[i].name;
      var type = facets[i].facetType;
      
      if(type == "text"){
          query += "facet.field={!ex=" + facets[i].id + "}" + name;
      }else if(type == "date"){
          query += "facet.date={!ex=" + facets[i].id + "}" + name;
          var datekey = "&f." + name + ".facet.date";
          query += datekey + ".start=" + encodeURIComponent(facets[i].dateStart);
          query += datekey + ".end=" + encodeURIComponent(facets[i].dateEnd);
          query += datekey + ".gap=" + encodeURIComponent(facets[i].dateGap);
      }
      
      if(i < facets.length-1)
        query = query + "&";
    }
    
    return query;
  },
  
  parseFacets: function(queryStr, configFacets){
    
    var facets = [];
    for(var i = 0; i < configFacets.length; i++){
      var configFacet = configFacets[i];
      
      var paramName = "fq={!tag=" + configFacet.id + "}";
      
      if(queryStr.indexOf(paramName) > 0){
          var querySplit = queryStr.split(paramName);
          var value = querySplit[1];
          
          if(value.indexOf("&") > 0)
              value = value.split("&")[0];
              
          var facetArr = "";
          if(value.indexOf(":(") > 0)
              facetArr = value.split(":(");
          else
              facetArr = value.split(":[");
      
          var facet = new Object();
          
          facet.id = configFacet.id;
          facet.name = facetArr[0];

          facet.query = paramName + value;
          
          if(value.indexOf(":(") > 0){
              facet.values = [];
              
              var facetArrValues = facetArr[1].substring(0, facetArr[1].length-1);
              facetArrValues = facetArrValues.trim();

              var vals = "";    

              if(configFacet.facetType == "text"){
                  vals = facetArrValues.split(/\"\s/);
                  
                  for(var k = 0; k < vals.length; k++){
                    var val = vals[k].replace(/\"/g, "").trim();
                    facet.values.push(val);
                  }
                  
              }else{
                  vals = facetArrValues.split("]");
   
                  for(var k = 0; k < vals.length; k++){
                      var val = vals[k].replace(/\[/g, "");
                      val = val.replace(/]/g, "").trim();
                      
                      if(val.length > 0)
                          facet.values.push(val);
                  }
              }

          }else{
              facet.value = facetArr[1].substring(0, facetArr[1].length-1);
          }

          facets.push(facet);             
      }
          
    }
    
    return facets;
  },

	parseParam: function(queryStr, name){
    var startIndex = queryStr.indexOf(name);

    if (startIndex != -1) {
      var endIndex = queryStr.indexOf("&", startIndex);

      if (endIndex == -1) {
        endIndex = queryStr.length;
      }
      
      return queryStr.substring(startIndex+name.length, endIndex);      
    }
    
    return "";
	},
	
	parseQueryToMap: function(queryStr, postfix){
    var split = queryStr.split("&");
    
    var queryParams = [];
    
    for(var i = 0; i < split.length; i++)
    {
        var params = split[i].split("=");
        queryParams[params[0] + postfix] = params[1];
    }
    
    return queryParams;	
	},
	
  isArray: function(obj) {
    return obj.constructor == Array;
  }
	
});

Serendip.Theme = Serendip.Class.extend({
  
  init : function(data){},
  renderInProgress : function(){},
  renderHeader : function(numDocsFound, responseTimeInMillis, sortValue, sortFields, sortDirection){},
  renderDocuments : function(data){},
  renderDoc : function(data){},
  renderFacets : function(data, facets){},
  renderFacet : function(facet, html, facets, moreFacetsCount){},  
  renderFacetField : function(facet, value, formattedValue, count, isActive){},
  renderActiveFacet : function(facetFieldsHtml){},
  renderActiveFacetField : function(facet, value, formattedValue){},
  renderSpellSuggestions: function(suggestions){},
  renderEmptyResult : function(searchSuggestions){},
  renderPager : function(data){},
  renderAutocompleteTerms : function(terms){},
  renderComplete : function(data){},
  
  bindSortClickHandler : function(handler){},
  bindFacetClickHandler : function(handler){},
  bindShowMoreFacetsClickHandler : function(name){},
  bindPagingClickHandler: function(handler){}
  
});

Serendip.SortField = Serendip.Class.extend({
  name : null,
  header: null
});

Serendip.Term = Serendip.Class.extend({
  value : null,
  count: null
});

Serendip.Facet = Serendip.Class.extend({
  facetType : "text",
  name : null,
  activeHeader: null,
  header : null,
  minFacetsToDisplay : null,
  maxFacetsToDisplay : null
});

Serendip.DateFacet = Serendip.Facet.extend({
  facetType : "date",
  dateStart : null,
  dateEnd : null,
  dateGap : null,
  dateFormat: null
});

Serendip.CustomDateFacet = Serendip.Facet.extend({
  facetType : "customdate",
  getFacetValues: function(){}
});

Serendip.CustomDateFacetValue = Serendip.Class.extend({
  name: null,
  value: null
});

Serendip.SortClickHandler = Serendip.Class.extend({
  handleSortClick : function(sortField, direction){}
});

Serendip.FacetClickHandler = Serendip.Class.extend({
  handleFacetClick : function(name, value, isActive){}
});

Serendip.ShowMoreFacetsClickHandler = Serendip.Class.extend({
  handleShowMoreFacetsClick : function(name){}
});

Serendip.PagingClickHandler = Serendip.Class.extend({
  handlePagingClick : function(page){}
});

Serendip.SuggestClickHandler = Serendip.Class.extend({
  handleSuggestClick : function(suggestion){}
});

Serendip.Search = Serendip.Class.extend({

  solrBaseUrl : null,
  numResults : 10,
  maxFacetsToDisplay : 5,
  
  searchFieldId : null,
  searchBtnId : null,
  
  pagerWindowSize: 5,
  minPagerPages: 10,
  
  fields : [],
  highlightFields : [],
  queryParams : [],
  facets: [],
  sortFields: [],
  autocompleteField: null,
  facetIdToFacetMap: [],
  
  theme: null,
  
  // Private 
  core: new Serendip.Core({}),
  
  timerId: 0,
  facetQuery: "",
  facetQueries: [],
  sortQuery: "",
  startDoc: 0,
  
  sortValue: "",
  cplIndex: -1,
  
 	// PageLoad function
	// This function is called when:
	// 1. after calling $.historyInit();
	// 2. after calling $.historyLoad();
	// 3. after pushing "Go Back" button of a browser
	pageload: function(hash) {

		// hash doesn't contain the first # character.
		if(hash) {
			// restore ajax loaded state
			if($.browser.msie) {
				// jquery's $.load() function does't work when hash include special characters like aao.
				//hash = encodeURIComponent(hash);
			}
									
			// Do your thing
			if(hash.length > 0)
        this.initFromQueryStr(hash);
        
		} else {
		
			// Start page
			var queryParams = window.location.search;

      if(queryParams.length > 0)
        this.initFromQueryStr(queryParams);
		}
	},  
  
  setFields: function(fields){
    this.fields = fields;
    
    var fieldsQueryStr = "";
    for(var i = 0; i < fields.length;i++){
        fieldsQueryStr += fields[i];
        if(i != fields.length-1) fieldsQueryStr += ",";
    }
    
    this.addQueryParam("fl", fieldsQueryStr);
  },
  
  setHighlightFields: function(fields){
      this.addQueryParam("hl.fl", fields.join(" ")); 
      this.highlightFields = fields;
  },
  
  addSortField: function(sortField){
    this.sortFields.push(sortField);
  },
  
  setAutocompleteField: function(field){
    this.autocompleteField = field;
  },
  
  addQueryParam: function (name, value) {
    this.queryParams.push(name + "=" + value);
  },
  
  addFacet: function (facet) {
    this.facets.push(facet);
    this.facetIdToFacetMap[facet.id] = facet;
  },  
  
  initFromQueryStr: function(queryStr){
    
    // Add postfix to map ids to avoid using "reserved" javascript words
    // ex paramsMap["sort"] will not work (sort is already funksjon on array)
    var paramsMap = this.core.parseQueryToMap(queryStr, "_param");
    
    // Search value
    $(this.searchFieldId).val(unescape(paramsMap["q_param"]));
    
    // Facet values
    var facetsFilters = this.core.parseFacets(queryStr, this.facets);
    
    this.facetQueries = [];
    for(var i = 0; i < facetsFilters.length; i++){
      var id = facetsFilters[i].id;
      this.facetQueries[id] = facetsFilters[i];
    }
    
    // Start page
    if(paramsMap["start_param"])
        this.startDoc = paramsMap["start_param"];
    else
        this.startDoc = 0;
        
    // Sorting
    if(paramsMap["sort_param"]){
        this.sortQuery = "&sort=" + paramsMap["sort_param"];
        this.sortValue = paramsMap["sort_param"];
    }
                 
    this.doRequest(this);
  },
  
  init : function(pageName){
    var self = this;
    
    // Initialize history plugin.
    // The callback is called at once by present location.hash. 
    $.historyInit(pageloadPriv, pageName);      
    
    this.setupEvents(self); 
    
    function pageloadPriv(hash){
        self.pageload(hash);
    }  
  },
  
  saveHistoryItem: function (query, startDoc, sort, facets){
  
    query = encodeURIComponent(query);
  
    var hash = "q=" + query;
    hash += "&start=" + startDoc;
    hash += sort;
    hash += facets;
    
    $.historyLoad(hash);    
  },  
  
    getFacetQuery: function(useEscape){
      var facetQueryArr = [];

      for(var id in this.facetQueries){
      
          var facetConfig = this.facetIdToFacetMap[id];
          var facet = this.facetQueries[id];
          
          var query = "";
          var paramName = "fq={!tag=" + id + "}" + facetConfig.name;
          
          if(facet.values.length > 0){
              query = paramName + ":(";
              
              for(var i = 0; i < facet.values.length; i++){
			  
                  var value = "";
                  if(useEscape)
                    value = escape(facet.values[i]);
                  else
                    value = encodeURIComponent(facet.values[i]);
					
                  if(facetConfig.facetType == "text")
                      query += "\"" + value + "\" ";
                  else
                      query += "[" + value + "] ";
              }
              
              query += ")";
              
              facetQueryArr.push(query);
          }  
      }
      
      if(facetQueryArr.length > 0)
          return "&" + facetQueryArr.join("&");
      else
          return "";
    },
  
    setupEvents: function(req){
        handleSearchBtnClick(req);
        handleSortClick(req);      
        handleFacetClick(req);
        handleShowMoreFacetsClick(req);
        handlePagingClick(req);
        handleSuggestClick(req);
        
        setupAutocomplete();  
    
        function handleSearchBtnClick(self){
          $(self.searchBtnId).click(function () {

            var query = $(self.searchFieldId).val();

            self.saveHistoryItem(query, 0, self.sortQuery, self.getFacetQuery());
            return false;
          });
        }    
        
        function setupAutocomplete(){
          handleKeyPressOnSearchInputBox();
          handleKeyDownOnSearchInputBox();
        }
        
        function handleKeyDownOnSearchInputBox(){
          $(req.searchFieldId).unbind('keydown').bind('keydown', function (e) {
          
              var cplArray = $("li span", "#autocomplete");
              $(cplArray[req.cplIndex]).css("font-weight","normal");

              if (e.keyCode == 32) { // space
                if (req.cplIndex == -1) {
                  collapseAutocomplete();
                }
              }
              
              if (e.keyCode == 40) { // down arrow
                req.cplIndex++;
                req.cplIndex = Math.min(req.cplIndex, cplArray.length-1);
                
                $(cplArray[req.cplIndex]).css("font-weight","bold");
                
                $("#autocomplete").fadeIn(300);
              }
              
              if (e.keyCode == 38) { // up arrow
                req.cplIndex--;
                
                if (req.cplIndex < 0) {
                  collapseAutocomplete();
                } else {
                  $(cplArray[req.cplIndex]).css("font-weight","bold");
                }
              }

              if (e.keyCode == 8 || e.keyCode == 27) { // backspace or escape
                collapseAutocomplete();
              }

              if (e.keyCode == 13) { // enter
                    
                var value = $(req.searchFieldId).val();
                
                if (req.cplIndex > -1) {
                  value = $(cplArray[req.cplIndex]).text();              
                }
                
                req.saveHistoryItem(value, 0, req.sortQuery, req.getFacetQuery());
                collapseAutocomplete();
                
                return false;
              }

          });	
          
          $(req.searchFieldId).unbind("blur").bind("blur", function(){
              collapseAutocomplete();
          });
        }
        
        function collapseAutocomplete(){
            req.cplIndex = -1;
            $("#autocomplete").fadeOut(300);
        }
       
      
        function handleKeyPressOnSearchInputBox(){
          $(req.searchFieldId).unbind('keypress').bind('keypress', function (e) {
            if (e.which > 32) {
              clearTimeout(req.timerId);
              req.timerId = setTimeout(function() {
                q = $(req.searchFieldId).val();

                if ((q.indexOf("\"") == -1) && (q.indexOf("+") == -1) && (q.indexOf("-") == -1) ) {
                  getAutoCompletions(q);
                }
              }, 300);
            }
          });	
        }
        
        function getAutoCompletions(query) {

          $.getJSON(req.solrBaseUrl +"/terms/?terms=true&terms.fl=" + req.autocompleteField + "&terms.lower.incl=false&terms.lower=" + encodeURIComponent(query) + "&terms.prefix=" + encodeURIComponent(query) + "&terms.mincount=1&wt=json",
          
            function(data){

              var len = data.terms[1].length;
              
              var terms = [];
              
              var count = 0;
              for (var i=0; i<len; i+=2) {
                  terms[count] = new Serendip.Term({value: data.terms[1][i], count:data.terms[1][i+1]});
                  count++;
              }
              
              if(len > 0){
                req.theme.renderAutocompleteTerms(terms);
              }
            }
          )
        }
   
        function handleSuggestClick(self){

          self.theme.bindSuggestClickHandler(new Serendip.SuggestClickHandler({
          
            handleSuggestClick : function(suggestion){
      
                $(self.searchFieldId).val(suggestion);
                self.saveHistoryItem(suggestion, self.startDoc, self.sortQuery, self.getFacetQuery());
           
            }
            
          }));
        }     
        
        function handleSortClick(self){

          self.theme.bindSortClickHandler(new Serendip.SortClickHandler({
          
            handleSortClick : function(sortValue){
      
                self.sortValue = sortValue;
                self.sortQuery = "&sort=" + sortValue;
                
                var query = $(self.searchFieldId).val();
                self.saveHistoryItem(query, self.startDoc, self.sortQuery, self.getFacetQuery());
               
            }
            
          }));
        }     
        
        function handlePagingClick(self){
          
          self.theme.bindPagingClickHandler(new Serendip.PagingClickHandler({
          
            handlePagingClick : function(page){
                var query = $(self.searchFieldId).val();
                self.startDoc = page * self.numResults;
                self.saveHistoryItem(query, self.startDoc, self.sortQuery, self.getFacetQuery());
            }
            
          }));
        }
        
        function handleFacetClick(self){
        
          self.theme.bindFacetClickHandler(new Serendip.FacetClickHandler({
            handleFacetClick : function(id, value, isActive){

                var facet = self.facetIdToFacetMap[id];
                var facetQuery = self.facetQueries[id];
                
                if(!facetQuery){
                  facetQuery = new Object();
                  facetQuery.id = facet.id;
                  facetQuery.values = [];
                }
                                
                if(isActive){
                    facetQuery.values.push(value);
                }else{
                    var vals = [];

                    for(var i = 0; i < facetQuery.values.length; i++){
                        if(facetQuery.values[i] != value){
                            vals.push(facetQuery.values[i]);
                        }
                    }
                    
                    facetQuery.values = vals;
                }
                
                self.facetQueries[id] = facetQuery; 
                  
                self.startDoc = 0;
                
                var query = $(self.searchFieldId).val();
                
                self.saveHistoryItem(query, self.startDoc, self.sortQuery, self.getFacetQuery());
            }
          }));	
        }    
        
        function handleShowMoreFacetsClick(self){
        
          self.theme.bindShowMoreFacetsClickHandler(new Serendip.ShowMoreFacetsClickHandler({
          
            handleShowMoreFacetsClick : function(id, facet){
      
                return $("div.moreFacets." + id, facet);
            }
            
          }));
        } 
                
    },
  
  doRequest: function(req){      	
    clearTimeout(req.timerId);
    
    req.theme.renderInProgress();
    
    var query = encodeURIComponent($(req.searchFieldId).val());
    var params = req.core.getParamsAsQueryString(req.queryParams);
    var facetParams = req.core.getFacetsAsQueryString(req.facets);  
    
    if(query.length > 0){
              
      var reqString = req.solrBaseUrl + "/select/?" + params + "&q=" + query + "&rows=" + req.numResults + "&" + facetParams;
      reqString += req.sortQuery + "&wt=json" + req.getFacetQuery() + "&start=" + req.startDoc;
	  
      $.ajax({
			scriptCharset: "utf-8" , 
          type: "GET",
          url: reqString,
          data: "",
          dataType: "json",
          contentType:"text/plain; charset=utf-8",

          success: handleResponse,        
          
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
            alert("error: " + textStatus);
          }
      });
    }
    
    function handleResponse(data){
      var numDocs = data.response.numFound; 
	        
      req.theme.init(data);
      
      renderHeader(numDocs, data.responseHeader.QTime, req.sortValue, req.sortFields);
      
      if (numDocs > 0) {
        renderDocuments(data);         
      } else {
        renderEmptyResult(data);
      }
      
      renderPaging(data);      
      
      renderActiveFacets();
      renderFacets(data, req.facets);     
      renderSpellSuggestions(data); 
      
      req.theme.renderComplete(data);
      
      req.setupEvents(req);
    }
    
    function renderSpellSuggestions(data){
      var suggestions = getSpellSuggestions(data);
      req.theme.renderSpellSuggestions(suggestions);
    }
    
    function getSpellSuggestions(data){
      var suggestionsArr = [];
 
      if(data.spellcheck){
          var suggestions = data.spellcheck.suggestions;
          if (suggestions.length > 1) {
              var query = $(req.searchFieldId).val();

              var suggestion = suggestions[1].suggestion;
              suggestionsArr.push(suggestion);              
          }
      } 
      
      return suggestionsArr;
    }
    
    function renderHeader(numDocsFound, responseTimeInMillis, sortValue, sortFields){
        
        var sortDirection = "asc";
        var values = sortValue.split(" ");
        if(values.length > 0){
            var index = values.length-1;
            if(values[index] == "desc")
              sortDirection = "desc";
        }
        
        req.theme.renderHeader(numDocsFound, responseTimeInMillis, sortValue, sortFields, sortDirection);
    }
    
    function renderPaging(data){
      var numDocs = data.response.numFound;
      
      var totalPages = Math.ceil(numDocs / req.numResults);
      var currentPage = Math.ceil(req.startDoc / req.numResults);
	  
      var start = currentPage - req.pagerWindowSize;
      var end = currentPage + req.pagerWindowSize;
 
      if(start < 0) start = 0;
      if(end > totalPages) end = totalPages;
	  
      var dif = end - start;
      if(dif < req.minPagerPages)
          end += req.minPagerPages - dif;
      
      if(start < 0) start = 0;
      if(end > totalPages) end = totalPages;
      
      req.theme.renderPager(currentPage, totalPages, start, end);  
      
    }  
    
    function renderEmptyResult(data){      
      var suggestions = getSpellSuggestions(data);
      req.theme.renderEmptyResult(suggestions)      
    }
    
    function renderDocuments(data){
      var docs = data.response.docs;
      
      var docsHtml = "";
      for (i=0; i<docs.length; i++) {
        docsHtml += renderDoc(docs[i], data.highlighting);
      }
  
      req.theme.renderDocuments(docsHtml);      
    }
    
    function renderDoc(doc, highlight){
      
      var fieldsArr = [];
      for(var i = 0; i < req.fields.length; i++){
        fieldsArr[req.fields[i]] = getFieldValue(doc, highlight, req.fields[i]);
      }
      
      for(var i = 0; i < req.highlightFields.length; i++){
        fieldsArr[req.highlightFields[i]] = getFieldValue(doc, highlight, req.highlightFields[i]);
      }      
      
      return req.theme.renderDoc(fieldsArr);
    }
    
    
    function getFieldValue(doc, highlight, field){
      var value;
            
      if(typeof(highlight) == "undefined"){
          value = doc[field];
      }else{
          value = highlight[doc.id][field];
      }     
          
      if(typeof(value) == "undefined")
          value = doc[field];
          
      return value;      
    }  
    
    function renderActiveFacets(){      
      var html = [];
      
      for(var id in req.facetQueries){
          var facetQuery = req.facetQueries[id];
          var facet = req.facetIdToFacetMap[id];
          
          // Skip non-active facets
          if(facetQuery.values.length == 0)
            continue;
            
          for(var i = 0; i < facetQuery.values.length; i++){
              var val = facetQuery.values[i];
              
             var activeHtml = renderActiveFacetValue(facet, facet.facetType, val);
             html.push(activeHtml);
          }               
      }

      req.theme.renderActiveFacet(html.join(""));  
    }   
    
    function renderActiveFacetValue(facet, type, value){
    
      if(type == "text"){
          return renderActiveTextFacet(facet, value);
      }
    
      if(type == "date"){
          return renderActiveDateFacet(facet, value);
      }
      
      if(type == "customdate"){
          return renderActiveCustomDateFacet(facet, value);
      }  
    }
    
    function renderActiveTextFacet(facet, value){
      return req.theme.renderActiveFacetField(facet, value, value);
    }
    
    function renderActiveDateFacet(facet, value){
      var formattedValue = value;
      
      if(!facet.dateValue || facet.dateValue == ""){
          var facetDateStr = value.split(" TO ");
          var fromDate = facetDateStr[0];
      
          var date = ISODate.convert(fromDate);
          formattedValue = date.format(facet.dateFormat);
      }else{
          formattedValue = facet.dateValue;
      }    
      
      return req.theme.renderActiveFacetField(facet, value, formattedValue);
    }
    
    function renderActiveCustomDateFacet(facet, value){
      var formattedValue = value;
      
      var customFacetValues = facet.getFacetValues();
      for(var k = 0; k < customFacetValues.length; k++){
          var customFacet = customFacetValues[k];

          if(customFacet.value == value){
              formattedValue = customFacet.name;
              break;
          }
      } 
      
      return req.theme.renderActiveFacetField(facet, value, formattedValue);
    }    
    
    function renderFacets(data, facets){
      if(typeof(data.facet_counts) != "undefined"){
          
          var facetfields = data.facet_counts.facet_fields;
          var facetdates = data.facet_counts.facet_dates;
          
          var html = [];
          
          var facetCount = Math.min(facets.length, req.maxFacetsToDisplay);
            
          for (var i=0;i<facetCount;i++){
                
            var facetHtml = renderFacetTypes(data, facetfields, facetdates, facets[i]);    
            html.push(facetHtml);
          }
      
          req.theme.renderFacets(html.join(""), req.facets)
      }      
    }
    
    function renderFacetTypes(data, facetfields, facetdates, facet){
      var html = "";
      var type = facet.facetType;
      
      if(type == "text"){
           html = renderTextFacet(data, facetfields, facet);
      }else if(type == "date"){
          html = renderDateFacet(data, facetdates, facet);   
      }else if(type == "customdate"){
          html = renderCustomDateFacet(data, facet);
      }    
      
      return html;
    }
    
    function renderTextFacet(data, facetfields, facet){
      var facetValues = facetfields[facet.name];
                 
      if(typeof(facetValues != "undefined")){
          return renderFacet(data, facet, facetValues);
      }    
      
      return "";
    }
    
    function renderDateFacet(data, facetdates, facet){
      var dates = facetdates[facet.name];
      var values = [];
      
      for(var key in dates){
          if(key != "gap" && key != "end"){
              values.push(key);
              values.push(dates[key]);
          }
      }
      
      var facetValues = [];
      
      for (var k=0; k < values.length; k+=2) {   
          var value = values[k];
          var count = values[k+1];
          
          var dateFacet = new Object();
          dateFacet.from = value;
          
          if(k+2 < values.length){
              dateFacet.to = values[k+2];
          }else{
              dateFacet.to = dates["end"];
          }
          
          facetValues.push(dateFacet);
          facetValues.push(count);
      }
                    
      return renderFacet(data, facet, facetValues);    
    }
    
    function renderCustomDateFacet(data, facet){
      var facetValues = [];
      
      var customFacetValues = facet.getFacetValues();
      for(var k = 0; k < customFacetValues.length; k++){
          var split = customFacetValues[k].value.split(" TO ");
          var dateFacet = new Object();
          
          dateFacet.from = split[0];
          dateFacet.to = split[1];
          dateFacet.name = customFacetValues[k].name;
          
          facetValues.push(dateFacet);
          facetValues.push(-1);
      }
      
      return renderFacet(data, facet, facetValues);    
    }
    
    function renderFacet(data, facet, facetArray) {
        var html = [];
        
        facetArray = removeEmptyFacets(facetArray);
        
        var len = facetArray.length;
        if(len > (facet.minFacetsToDisplay*2)) len = facet.minFacetsToDisplay*2;
        
        var currentIndex = 0;
        for (var i=0; i < len; i+=2) {   
            var value = facetArray[i];
            var count = facetArray[i+1];
            
            var isActive = isFacetFieldActive(data, facet, value);
            
            var facetFieldHtml = renderFacetField(facet, value, count, isActive);
            html.push(facetFieldHtml);
            
            currentIndex = i; 
        }
        
        len = facetArray.length;
        var max = facet.maxFacetsToDisplay * 2;

        var moreFacetsCount = 0;
        if(len > currentIndex && max > currentIndex){
            var moreFacets = addMoreFacets(data, facet, facetArray, len, max, currentIndex);     
            html.push(moreFacets.html);   
            moreFacetsCount = moreFacets.count;
        }
        
        return req.theme.renderFacet(facet, html.join(""), req.facets, moreFacetsCount);  
    }
    
    function addMoreFacets(data, facet, facetArray, len, max, currentIndex){
        if(max < len) len = max;
        
        var htmlMoreFacets = [];
  
        var moreFacets = new Object();
        moreFacets.count = 0;
        moreFacets.html = "";
 
        htmlMoreFacets.push("<div class='moreFacets " + facet.id + "' style='display:none;'>");
        
        for (var i=currentIndex+2; i < len; i+=2) {  
          var value = facetArray[i];
          var count = facetArray[i+1];      
                
          var isActive = isFacetFieldActive(data, facet, value);
          var facetHtml = renderFacetField(facet, value, count, isActive);
          
          if(facetHtml != ""){
            htmlMoreFacets.push(facetHtml);
            moreFacets.count++;
          }
        }
        
        htmlMoreFacets.push("</div>");
                    
        if(moreFacets.count > 0){
          moreFacets.html = htmlMoreFacets.join("");
        }    
    
        return moreFacets;
    }
    
    function removeEmptyFacets(facets){
        var result = [];
        for (var i=0; i < facets.length; i+=2) {    
            var value = facets[i];
            var docCount = facets[i+1];
            
            // -1 is sentinel value for facets that cannot have count
            if(docCount > 0 || docCount == -1){
                result.push(value);
                result.push(docCount);
            }
        }
        
        return result;
    }
    
    function renderFacetField(facet, value, count, isActive){
      
      var formattedValue = "";
      if(facet.facetType == "date"){         
          if(!facet.dateValue || facet.dateValue == ""){
              var date = ISODate.convert(value.from);
              formattedValue = date.format(facet.dateFormat);
          }else{
              formattedValue = facet.dateValue;
          }      
                  
          value = value.from + " TO " + value.to;
          
      }else if(facet.facetType == "customdate"){
          formattedValue = value.name;
          value = value.from + " TO " + value.to;
      }else{
          formattedValue = value;
      }
      
      return req.theme.renderFacetField(facet, value, formattedValue, count, isActive);
    }
    
    function isFacetFieldActive(data, facet, value){
      var activeFacets = data.responseHeader.params.fq;
     
      if(activeFacets){
      
          // Might be single value and not an array...
          if(!isArray(activeFacets) || activeFacets[0].length == 1){
            if(isFacetMatch(activeFacets, facet, value)){
                return true;
            }
          }else{
          
              // If not previous match, we probably have an array with multiple active facets
              for(var i = 0; i < activeFacets.length; i++){
                  if(isFacetMatch(activeFacets[i], facet, value)){
                      return true;
                  }
              }  
          }
      }
      
      return false;
    }   
    
    function isArray(testObject) {   
    return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
    }       
    
    function isFacetMatch(activeFacet, facet, value){
      var facetValue = "";
      var prefix = "{!tag=" + facet.id + "}" + facet.name + ":(";
      
      var activePrefix = activeFacet.substring(0, prefix.length);

      if(prefix != activePrefix){
          return false;
      }
      
      var activeValue = activeFacet.substring(prefix.length, activeFacet.length-1);
      
      if(facet.facetType == "text"){
          var vals = activeValue.split(/\"\s/);
          for(var k = 0; k < vals.length; k++){
            var val = vals[k].replace(/\"/g, "").trim();

            if(val == value)
                return true;
          }
                  
      }else if(facet.facetType == "date" || facet.facetType == "customdate"){
          vals = activeValue.split("]");

          for(var k = 0; k < vals.length; k++){
              var val = vals[k].replace(/\[/g, "");
              val = val.replace(/]/g, "").trim();
              
              if(val.length > 0){
                  var facetValue = value.from + " TO " + value.to; 
                  
                  if(val == facetValue)
                      return true;
              }
                  
          }        
      }      

      return false;
    }
    
  }
});

