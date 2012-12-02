

$(document).ready(function(){

    // Add the url to you solr server
    serendip.setSolrUrl("http://localhost:8080/solr/Core1/select");

    // Add more available fields
    // name: specifies name of field in Solr schema
    // id: unique identifier for field
    // isEnabled: If true data for the field will be returned
    // You will want to keep name and id short if you want to support older browsers because some browsers (IE 7-) do not support arbitrarily long urls
    serendip.addFieldConfig({ name: "id", id: "id", header: "ID", isEnabled: false });
    serendip.addFieldConfig({ name: "Firstname", id: "Firstname", header: "Firstname", isEnabled: true });
    serendip.addFieldConfig({ name: "Lastname", id: "Lastname", header: "Lastname", isEnabled: true});
	serendip.addFieldConfig({ name: "Address", id: "Address", header: "Address", isEnabled: true});
	serendip.addFieldConfig({ name: "City", id: "City", header: "City", isEnabled: true});
	serendip.addFieldConfig({ name: "County", id: "County", header: "County", isEnabled: true});
	serendip.addFieldConfig({ name: "Zip", id: "Zip", header: "Zip", isEnabled: true});
	serendip.addFieldConfig({ name: "Phone", id: "Phone", header: "Phone", isEnabled: true});
	serendip.addFieldConfig({ name: "Email", id: "Email", header: "Email", isEnabled: true});
    serendip.addFieldConfig({ name: "Birthdate", id: "Birthdate", header: "Birthdate", isEnabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "Children", id: "Children", header: "Children", isEnabled: true });

    serendip.enableAllFields(true);

    serendip.init("index.html");
    
    $("#queryInput").focus();
});
   