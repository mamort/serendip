

$(document).ready(function(){

    // Add the url to you solr server
    serendip.setSolrUrl("http://localhost:8080/solr/select");

    // Add more available fields
    serendip.addFieldConfig({ name: "id", id: "id", header: "ID", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "url_opf_s", id: "url", header: "Url", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "bda_opf_d", id: "bda", header: "Begynt dato", selected: false, enabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "sda_opf_d", id: "sda", header: "Sluttet dato", selected: false, enabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "pnr_opf_s", id: "pnr", header: "Postnr", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "pst_opf_s", id: "pst", header: "Poststed", selected: false, enabled: true });

    serendip.setSearchAllFields(true);
 
    serendip.init("index.html");     
    
    $("#queryInput").focus();
});
    