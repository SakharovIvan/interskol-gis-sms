import { Op } from "sequelize";
import { normalize_GIS_date } from "../../utils/formatters.js";

export const DATA_TYPES = {
  1: "xml",
  2: "DB",
};

export class Repair {
  ndk;
  asc_id;
  client_id;
  tool_id;
  vr;
  prin;
  dia;
  accept_1;
  accept_2;
  sp_wait_1;
  sp_wait_2;
  vipoln;
  vidach;
  SP_list = [];
  constructor({ data, GIS_VR_codes, tool, type = DATA_TYPES[1] }) {
    switch (type) {
      case DATA_TYPES[1]:
        this.set_XML(data, { GIS_VR_codes, tool });
    }
  }
  set_XML(el, { GIS_VR_codes, tool }) {
    try {
      this.vr = GIS_VR_codes[Number(el.getAttribute("VR"))];
      this.ndk = Number(el.getAttribute("NDK"));

      this.client_gis = el.getAttribute("SKL");
      this.prin = normalize_GIS_date(el.getAttribute("DATP"));
      this.dia = normalize_GIS_date(el.getAttribute("DATD"));
      this.accept_1 = normalize_GIS_date(el.getAttribute("DATYN"));
      this.accept_2 = normalize_GIS_date(el.getAttribute("DATYK"));
      this.sp_wait_1 = normalize_GIS_date(el.getAttribute("DATOZN"));
      this.sp_wait_2 = normalize_GIS_date(el.getAttribute("DATOZK"));
      this.vipoln = normalize_GIS_date(el.getAttribute("DATI"));
      this.vidach = normalize_GIS_date(el.getAttribute("DATW"));
      const records = el.querySelectorAll("RECORD");
      for (const el of records) {
        this.SP_list.push({
          Repair_id: null,
          spmatNo: el.getAttribute("NN"),
          work:el.getAttribute("PRR"),
          qty:el.getAttribute("KOL"),
          price:el.getAttribute("CENAF"),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export class Tool {
  constructor({ data, type = DATA_TYPES[1] }) {
    switch (type) {
      case DATA_TYPES[1]:
        this.set_XML(data);
    }
  }
  set_XML(el) {
    this.snno_tool = el.getAttribute("SN");
    this.matno_tool = el.getAttribute("NN");
    this.purchase_tool = el.getAttribute("DATAPRO");
    this.torgorg_tool = el.getAttribute("ADRT");
    this.nfc = el.getAttribute("NFC");
    this.ADRT = el.getAttribute("ADRT");
    this.DATE_MANIFACTURE = el.getAttribute("DTPR");
  }
}

export class Client {
  set_XML() {}
}

export class ASC {
  gis_code;
  C1_code;
  organization_name;
  Indeks;
  addres;
  Tlf;
  email;
  Raschet_schet_bank;
  Korr_schet_bank;
  BIK_bank;
  Name_bank;
  organization_INN;
  OKPO;
  email_2;
  skid;
  contract_DSO;
  contract_DSO_date;
  contract_shipment;
  contract_shipment_date;
  DSO_region;
  KPP;
  constructor({ data, type = DATA_TYPES[1] }) {
    switch (type) {
      case DATA_TYPES[1]:
        this.set_XML(data);
    }
  }
  set_XML(el) {
    this.gis_code = el.getAttribute("KSC");
    this.C1_code = el.getAttribute("KODKA");
    this.organization_name = el.getAttribute("NAME");
    this.Indeks = el.getAttribute("");
    this.addres = el.getAttribute("");
    this.Tlf = el.getAttribute("");
    this.email = el.getAttribute("");
    this.Raschet_schet_bank = el.getAttribute("");
    this.Korr_schet_bank = el.getAttribute("");
    this.BIK_bank = el.getAttribute("");
    this.Name_bank = el.getAttribute("");
    this.organization_INN = el.getAttribute("INN");
    this.OKPO = el.getAttribute("");
    this.email_2 = el.getAttribute("");
    this.skid = el.getAttribute("");
    this.contract_DSO = el.getAttribute("");
    this.contract_DSO_date = el.getAttribute("");
    this.contract_shipment = el.getAttribute("");
    this.contract_shipment_date = el.getAttribute("");
    this.DSO_region = el.getAttribute("");
    this.KPP = el.getAttribute("");
  }
}
