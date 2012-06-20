

$(document).ready(function(){

    // Add the url to you solr server
    serendip.setSolrUrl("http://localhost:8080/solr/select");

    // Add more available fields
    // name: specifies name of field in Solr schema
    // id: unique identifier for field
    // You will want to keep name and id short if you want to support older browsers because some browsers (IE 7-) do not support arbitrarily long urls
    serendip.addFieldConfig({ name: "id", id: "id", header: "ID", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "url_s", id: "url", header: "Url", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "bda_d", id: "bda", header: "Begynt dato", selected: false, enabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "sda_d", id: "sda", header: "Sluttet dato", selected: false, enabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "pnr_s", id: "pnr", header: "Postnr", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "pst_s", id: "pst", header: "Poststed", selected: false, enabled: true });

    serendip.setSearchAllFields(true);
 
    serendip.init("index.html");     
    
    $("#queryInput").focus();
});
    