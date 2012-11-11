

$(document).ready(function(){

    // Add the url to you solr server
    serendip.setSolrUrl("http://localhost:8080/solr/Core1/select");

    // Add more available fields
    // name: specifies name of field in Solr schema
    // id: unique identifier for field
    // You will want to keep name and id short if you want to support older browsers because some browsers (IE 7-) do not support arbitrarily long urls
    serendip.addFieldConfig({ name: "id", id: "id", header: "ID", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "Firstname", id: "Firstname", header: "Firstname", selected: true, enabled: true });
    serendip.addFieldConfig({ name: "Lastname", id: "Lastname", header: "Lastname", selected: true, enabled: true});
	serendip.addFieldConfig({ name: "Address", id: "Address", header: "Address", selected: true, enabled: true});
	serendip.addFieldConfig({ name: "City", id: "City", header: "City", selected: true, enabled: true});
	serendip.addFieldConfig({ name: "County", id: "County", header: "County", selected: true, enabled: true});
	serendip.addFieldConfig({ name: "Zip", id: "Zip", header: "Zip", selected: true, enabled: true});
	serendip.addFieldConfig({ name: "Phone", id: "Phone", header: "Phone", selected: true, enabled: true});
	serendip.addFieldConfig({ name: "Email", id: "Email", header: "Email", selected: true, enabled: true});
    serendip.addFieldConfig({ name: "Birthdate", id: "Birthdate", header: "Birthdate", selected: true, enabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "Children", id: "Children", header: "Children", selected: true, enabled: true });

    serendip.setSearchAllFields(true);

    serendip.init("index.html");
    
    $("#queryInput").focus();
});
   