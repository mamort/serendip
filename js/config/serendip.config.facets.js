
$(document).ready(function(){

	var facets = [];

    facets.push(new Serendip.Facet({
        id: "pen",
        selected: true,
        name: "pen_opf_s",
        activeHeader: "Pensjonsordning",
        header: "Filtrer etter pensjonsordning",
        minFacetsToDisplay: 5,
        maxFacetsToDisplay: 30
    }));
	
    // Date facet [dynamic range]
    facets.push(new Serendip.DateFacet({
        id: "lmnd",
        selected: true,
        name: "lmnd_opf_d",
        activeHeader: "Lønnsmåned",
        header: "Filtrer etter lønnsmåned",

        minFacetsToDisplay: 5,
        maxFacetsToDisplay: 10,

        dateStart: "NOW/YEAR-10YEARS",
        dateEnd: "NOW/YEAR+1YEAR",
        dateGap: "+1MONTH",

        dateFormat: "mmmm yyyy",
        sortDir: "desc"
    }));
	
	serendip.facets = facets;
});