

$(document).ready(function(){
    serendip.setSolrUrl("http://localhost:8080/solr/select");

    serendip.addFieldConfig({ name: "id", id: "id", header: "ID", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "indexdate_opf_s", id: "indexdate", header: "", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "validationresultid_opf_s", id: "validationresultid", header: "", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "allcount_opf_i", id: "allcount", header: "", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "indexdate_opf_d", id: "indexdate", header: "Indeks dato", selected: false, enabled: false , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "url_opf_s", id: "url", header: "Url", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "lnr_opf_i", id: "lnr", header: "Linjenr", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "mode_opf_s", id: "mode", header: "Mode", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "akt_opf_s", id: "akt", header: "Er aktiv", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "sta_opf_s", id: "sta", header: "Status", selected: true, enabled: true });
    serendip.addFieldConfig({ name: "ena_opf_s", id: "ena", header: "Enhetsnavn", selected: true, enabled: true });
    serendip.addFieldConfig({ name: "enr_opf_s", id: "enr", header: "Enhetsnr", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "iva_opf_s", id: "iva", header: "Er validert", selected: false, enabled: false });
    serendip.addFieldConfig({ name: "fru_opf_ms", id: "fru", header: "Regelfeil", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "frt_opf_ms", id: "frt", header: "Regel type feil", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "frf_opf_ms", id: "frf", header: "Felt feil", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "fnr_opf_s", id: "fnr", header: "Fødselsnr", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "ast_opf_i", id: "ast", header: "Arbeidssted", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "asn_opf_s", id: "asn", header: "Arbeidsstedsnavn", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "alo_opf_i", id: "alo", header: "Årslønn", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "nvn_opf_s", id: "nvn", header: "Navn", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "sko_opf_s", id: "sko", header: "Stillingskode", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "eko_opf_s", id: "eko", header: "Endringskode", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "reg_opf_s", id: "reg", header: "Regulativ", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "pen_opf_s", id: "pen", header: "Pensjonsordning", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "sln_opf_i", id: "sln", header: "Stillingsløpenr", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "ekd_opf_d", id: "ekd", header: "Endringskode dato", selected: false, enabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "hekd_opf_d", id: "hekd", header: "Historisk endringskodedato", selected: false, enabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "lmnd_opf_d", id: "lmnd", header: "Lønnsmåned", selected: false, enabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "uths_opf_deci", id: "uths", header: "Uketimer i helstilling", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "sty_opf_s", id: "sty", header: "Stillingstype", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "afo_opf_s", id: "afo", header: "Ansettelsesforhold", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "orl_opf_s", id: "orl", header: "Organisasjonsledd", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "fst1_opf_s", id: "fst1", header: "Faste tillegg1", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "fst2_opf_s", id: "fst2", header: "Faste tillegg2", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "bda_opf_d", id: "bda", header: "Begynt dato", selected: false, enabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "sda_opf_d", id: "sda", header: "Sluttet dato", selected: false, enabled: true , isDate: true, dateFormat: "dd.mmm.yyyy"});
    serendip.addFieldConfig({ name: "bnr_opf_s", id: "bnr", header: "Bedriftsnr", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "anr_opf_i", id: "anr", header: "ArbeidsgiverNr", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "agr_opf_i", id: "agr", header: "Aldersgrense", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "dpr_opf_deci", id: "dpr", header: "Deltidsprosent", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "adtp_opf_deci", id: "adtp", header: "Akkumulert deltidsprosent", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "brnr_opf_s", id: "brnr", header: "BrukerNr", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "adr_opf_s", id: "adr", header: "Adresse", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "coadr_opf_s", id: "coadr", header: "c/o Adresse", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "pnr_opf_s", id: "pnr", header: "Postnr", selected: false, enabled: true });
    serendip.addFieldConfig({ name: "pst_opf_s", id: "pst", header: "Poststed", selected: false, enabled: true });

    serendip.setSearchAllFields(true);
 
    serendip.init("index.html");     
    
    $("#queryInput").focus();
});
    