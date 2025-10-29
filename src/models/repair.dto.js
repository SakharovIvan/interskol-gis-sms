import { Op } from "sequelize";
import { normalize_GIS_date } from "../../utils/formatters.js";
import {
  ASC_GIS_DB,
  Clients_GIS_DB,
  Organizations,
  Repairs_GIS_DB,
  Repairs_SP_GIS_DB,
  Tools,
  Work_DB,
} from "./gisCL3.js";

export const DATA_TYPES = {
  1: "xml",
  2: "DB",
};

export class Repair {
  ndk;
  asc;
  client;
  tool;
  vr;
  prin;
  dia;
  accept_1;
  accept_2;
  sp_wait_1;
  sp_wait_1;
  sp_wait_2;
  vipoln;
  vidach;
  SP_list = [];
  constructor({ data, GIS_VR_codes, type = DATA_TYPES[1] }) {
    switch (type) {
      case DATA_TYPES[1]:
        this.set_XML(data, { GIS_VR_codes });
    }
  }
  set_XML(el, { GIS_VR_codes }) {
    try {
      this.vr = GIS_VR_codes[Number(el.getAttribute("VR"))];
      this.ndk = Number(el.getAttribute("NDK"));
      this.prin = normalize_GIS_date(el.getAttribute("DATP"));
      this.dia = normalize_GIS_date(el.getAttribute("DATD"));
      this.accept_1 = normalize_GIS_date(el.getAttribute("DATYN"));
      this.accept_2 = normalize_GIS_date(el.getAttribute("DATYK"));
      this.sp_wait_1 = normalize_GIS_date(el.getAttribute("DATOZN"));
      this.sp_wait_2 = normalize_GIS_date(el.getAttribute("DATOZK"));
      this.vipoln = normalize_GIS_date(el.getAttribute("DATI"));
      this.vidach = normalize_GIS_date(el.getAttribute("DATW"));
      this.KSC = Number(el.getAttribute("KSC"));
      this.SKL = Number(el.getAttribute("SKL"));
      this.SN = el.getAttribute("SN");
      const records = el.querySelectorAll("RECORD");
      for (const el of records) {
        this.SP_list.push({
          Repair_id: null,
          spmatNo: el.getAttribute("NN"),
          work: Number(el.getAttribute("PRR")) === 1,
          qty: el.getAttribute("KOL"),
          price: el.getAttribute("CENAF"),
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async init() {
    this.asc = (
      await ASC_GIS_DB.findOne({
        where: {
          gis_code: this.KSC,
        },
      })
    ).dataValues;
    this.client = (
      await Clients_GIS_DB.findOne({
        where: { gis_code: this.SKL },
      })
    ).dataValues;
    this.tool = (
      await Tools.findOne({ where: { snno_tool: this.SN } })
    ).dataValues;
    const cur_work = this.SP_list.filter((el) => el.work);
    this.work = (
      await Work_DB.findOne({ where: { gis_code: cur_work[0].spmatNo } })
    ).dataValues;
  }

  async DB_upd() {
    try {
      Repairs_GIS_DB.findOne({
        where: { ndk: this.ndk, asc_id: this.asc.id },
      })
        .then((res) => {
          if (!res) {
            return Repairs_GIS_DB.create({
              ndk: this.ndk,
              asc_id: this.asc.id,
              work_id: this.work.gis_code,
              client_id: this.client.id,
              vr: this.vr,
              tool_id: this.tool.id,
              prin: this.prin,
              dia: this.dia,
              accept_1: this.accept_1,
              accept_2: this.accept_2,
              sp_wait_1: this.sp_wait_1,
              sp_wait_2: this.sp_wait_2,
              vipoln: this.vipoln,
              vidach: this.vidach,
            }).then((res) => {
              this.id = res.dataValues.id;
            });
          }
          return res
            .update({
              work_id: this.work.gis_code,
              client_id: this.client.id,
              vr: this.vr,
              tool_id: this.tool.id,
              prin: this.prin,
              dia: this.dia,
              accept_1: this.accept_1,
              accept_2: this.accept_2,
              sp_wait_1: this.sp_wait_1,
              sp_wait_2: this.sp_wait_2,
              vipoln: this.vipoln,
              vidach: this.vidach,
            })
            .then((res) => {
              this.id = res.dataValues.id;
            });
        })
        .catch((err) => {
          console.log(err);
          console.log(this);
        });
    } catch (error) {
      console.log(error);
      console.log(this);
    }
  }
  async SP_List_DB_upd() {
    try {
      const repair = await Repairs_GIS_DB.findOne({
        where: { ndk: this.ndk, asc_id: this.asc.id },
        raw: true,
      });
      if (repair) {
        await Repairs_SP_GIS_DB.destroy({
          where: { Repair_id: repair.id },
        });
      }
    } catch (error) {
      console.log(error);
    }

    const promises = this.SP_list.map(async (el) => {
      Repairs_SP_GIS_DB.create({
        Repair_id: this.id,
        spmatNo: el.spmatNo,
        qty: el.qty,
        price: el.price,
      });
    });
    Promise.all(promises).catch((err) => console.log(err));
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
    this.purchase_tool = normalize_GIS_date(el.getAttribute("DATAPRO"));
    this.nfc = el.getAttribute("NFC");
    this.ADRT = el.getAttribute("ADRT");
    this.manifacture_data = normalize_GIS_date(el.getAttribute("DTPR"));
  }
  async init() {
    const torgOrg = await Organizations.findOne({
      where: {
        gis_code: this.ADRT,
      },
      raw: true,
    });
    if (torgOrg) {
      this.organization_id = torgOrg.id;
      return;
    }
    const torgOrg_test = await Organizations.findOne({
      where: {
        gis_code: 4,
      },
      raw: true,
    });
    this.organization_id = torgOrg_test.id;
  }
  async DB_upd() {
    try {
      Tools.findOne({ where: { snno_tool: this.snno_tool } })
        .then((res) => {
          if (!res) {
            return Tools.create({
              snno_tool: this.snno_tool,
              matno_tool: this.matno_tool,
              purchase_tool: this.purchase_tool,
              nfc: this.nfc,
              manifacture_data: this.manifacture_data,
              organization_id: this.organization_id,
            });
          }
          return res.update({
            matno_tool: this.matno_tool,
            purchase_tool: this.purchase_tool,
            nfc: this.nfc,
            manifacture_data: this.manifacture_data,
            organization_id: this.organization_id,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }
}

export class Work {
  gis_code;
  name;
  constructor({ data, type = DATA_TYPES[1] }) {
    switch (type) {
      case DATA_TYPES[1]:
        this.set_XML(data);
    }
  }
  set_XML(el) {
    this.gis_code = Number(el.getAttribute("KOD"));
    this.name = el.getAttribute("NAME");
  }
  async DB_upd() {
    Work_DB.findOne({ where: { gis_code: this.gis_code } }).then((res) => {
      if (!res) {
        return Work_DB.create({
          gis_code: this.gis_code,
          name: this.name,
        });
      }
      return res.update({
        name: this.name,
      });
    });
  }
}
