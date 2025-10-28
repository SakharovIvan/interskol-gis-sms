import { ASC_GIS_DB, Clients_GIS_DB, Organizations } from "./gisCL3.js";
import { DATA_TYPES } from "./repair.dto.js";

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
    this.gis_code = Number(el.getAttribute("KSC"));
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
  async DB_upd() {
    return ASC_GIS_DB.findOne({ where: { gis_code: this.gis_code } }).then(
      (res) => {
        if (!res) {
          return ASC_GIS_DB.create({
            gis_code: this.gis_code,
            C1_code: this.C1_code,
            organization_name: this.organization_name,
            Indeks: this.Indeks,
            addres: this.addres,
            Tlf: this.Tlf,
            email: this.email,
            Raschet_schet_bank: this.Raschet_schet_bank,
            Korr_schet_bank: this.Korr_schet_bank,
            BIK_bank: this.BIK_bank,
            Name_bank: this.Name_bank,
            organization_INN: this.organization_INN,
            OKPO: this.OKPO,
            email_2: this.email_2,
            skid: this.skid,
            contract_DSO: this.contract_DSO,
            contract_DSO_date: this.contract_DSO_date,
            contract_shipment: this.contract_shipment,
            contract_shipment_date: this.contract_shipment_date,
            DSO_region: this.DSO_region,
            KPP: this.KPP,
          });
        }
        return res.update({
          C1_code: this.C1_code,
          organization_name: this.organization_name,
          Indeks: this.Indeks,
          addres: this.addres,
          Tlf: this.Tlf,
          email: this.email,
          Raschet_schet_bank: this.Raschet_schet_bank,
          Korr_schet_bank: this.Korr_schet_bank,
          BIK_bank: this.BIK_bank,
          Name_bank: this.Name_bank,
          organization_INN: this.organization_INN,
          OKPO: this.OKPO,
          email_2: this.email_2,
          skid: this.skid,
          contract_DSO: this.contract_DSO,
          contract_DSO_date: this.contract_DSO_date,
          contract_shipment: this.contract_shipment,
          contract_shipment_date: this.contract_shipment_date,
          DSO_region: this.DSO_region,
          KPP: this.KPP,
        });
      }
    );
  }
}

export class Client {
  name;
  gis_code;
  telephone;
  fiz;
  constructor({ data, type = DATA_TYPES[1] }) {
    switch (type) {
      case DATA_TYPES[1]:
        this.set_XML(data);
    }
  }
  set_XML(el) {
    try {
      this.gis_code = Number(el.getAttribute("KOD"));
      this.name = el.getAttribute("NAME");
      this.telephone = el.getAttribute("TLF");
      this.fiz = Number(el.getAttribute("PFIZ")) === 0;
    } catch (error) {
      console.log(error);
    }
  }
  async DB_upd() {
    Clients_GIS_DB.findOne({ where: { gis_code: this.gis_code } }).then(
      (res) => {
        if (!res) {
          return Clients_GIS_DB.create({
            gis_code: this.gis_code,
            name: this.name,
            telephone: this.telephone,
            fiz: this.fiz,
          });
        }
        return res.update({
          name: this.name,
          telephone: this.telephone,
          fiz: this.fiz,
        });
      }
    );
  }
}

export class Organization {
  name;
  addres;
  gis_code;
  telephone;
  constructor({ data, type = DATA_TYPES[1] }) {
    switch (type) {
      case DATA_TYPES[1]:
        this.set_XML(data);
    }
  }
  set_XML(el) {
    try {
      this.gis_code = Number(el.getAttribute("KOD"));
      this.name = el.getAttribute("NAME");
      this.addres=el.getAttribute("ADR")
      this.telephone = el.getAttribute("TLF");
    } catch (error) {
      console.log(error);
    }
  }
  async DB_upd() {
    Organizations.findOne({ where: { gis_code: this.gis_code } }).then(
      (res) => {
        if (!res) {
         return Organizations.create({
            gis_code: this.gis_code,
            name: this.name,
            addres: this.addres,
            telephone: this.telephone,
          })
        }
       return res.update({
          name: this.name,
          addres: this.addres,
          telephone: this.telephone,
        });
      }
    );
  }
}
