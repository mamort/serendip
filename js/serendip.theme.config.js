/*!
 * Serendip Javascript Library v1.0
 * http://github.com/mamort/serendip
 *
 * Copyright 2010, Mats Mortensen
 * Licensed under the MIT license.
 * http://github.com/mamort/serendip/blob/master/License.txt
 *
 * Includes: 
 * jquery-1.4.min.js (http://jquery.com/)
 * date.format-1.2.3.js (http://blog.stevenlevithan.com/archives/date-time-format)
 */
 
var serendipTranslation = [];

/* Example translation of day and month names (example is in norwegian) */
serendipTranslation["Date:DayNames"] = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør",
		"Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
		
serendipTranslation["Date:MonthNames"] = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des",
		"Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
		
		
/* Maps fields displayed for each document to your Solr fields */
var serendipThemeFieldMap = [];

serendipThemeFieldMap["field:title"] = "title";
serendipThemeFieldMap["field:title:empty"] = "No title available for this document";

serendipThemeFieldMap["field:content"] = "contents";
serendipThemeFieldMap["field:content:empty"] = "No description available";

serendipThemeFieldMap["field:url"] = "url";
serendipThemeFieldMap["field:url:empty"] = "";

serendipThemeFieldMap["field:date"] = "date";
serendipThemeFieldMap["field:date:empty"] = "No date available";
serendipThemeFieldMap["field:date:format"] = "dd.mm.yyyy HH:MM";