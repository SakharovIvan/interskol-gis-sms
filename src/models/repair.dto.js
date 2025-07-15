import { Op } from "sequelize";
import { GIS, smsStatus, ASCInfo, gis_repair_sp } from "../models/models.js";

export class Repair_dto {
  constructor(data) {
    this.asc_name = data.asc_name;
    this.asc_gor = data.asc_gor;
    this.asc_adr = data.asc_adr;
    this.asc_telephone = data.asc_telephone;
    this.asc_email = data.asc_email;
    this.asc_ndk = data.asc_ndk;
    this.cli_name = data.cli_name;
    this.cli_telephone = data.cli_telephone;
    this.cli_email = data.cli_email;
    this.vr = data.vr;
    this.gis_code = data.gis_code;
    this.snno_tool = data.snno_tool;
    this.matno_tool = data.matno_tool;
    this.dateofpurch_tool = data.dateofpurch_tool;
    this.torgorg_tool = data.torgorg_tool;
    this.date_prin = data.date_prin;
    this.date_dia = data.date_dia;
    this.date_sogl1 = data.date_sogl1;
    this.date_sogl2 = data.date_sogl2;
    this.date_vipoln = data.date_vipoln;
    this.date_vidach = data.date_vidach;
    this.rem_work = data.rem_work;
    this.spareparts_array = data.spareparts_array;
  }
  _repairInfo() {
    return {
      asc_name: this.asc_name,
      asc_gor: this.asc_gor,
      asc_adr: this.asc_adr,
      asc_telephone: this.asc_telephone,
      asc_email: this.asc_email,
      asc_ndk: this.asc_ndk,
      cli_name: this.cli_name,
      cli_telephone: this.cli_telephone,
      cli_email: this.cli_email,
      vr: this.vr,
      asc_kod: this.gis_code,
      snno_tool: this.snno_tool,
      matno_tool: this.matno_tool,
      dateofpurch_tool: this.dateofpurch_tool,
      torgorg_tool: this.torgorg_tool,
      date_prin: this.date_prin,
      date_dia: this.date_dia,
      date_sogl1: this.date_sogl1,
      date_sogl2: this.date_sogl2,
      date_vipoln: this.date_vipoln,
      date_vidach: this.date_vidach,
    };
  }
  _spInfo() {
    const sp = this.spareparts_array.map((el) => {
      return {
        ...el,
        gis_code: this.gis_code,
        asc_ndk: this.asc_ndk,
      };
    });
    return sp;
  }
  async saveToDB() {
    return GIS.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              {
                asc_name: { [Op.like]: "%" + this.asc_name + "%" },
              },
              { asc_ndk: this.asc_ndk },
            ],
          },
          {
            [Op.and]: [
              {
                asc_kod: this.gis_code,
              },
              { asc_ndk: this.asc_ndk },
            ],
          },
        ],
      },
    }).then((currRep) => {
      if (currRep) {
        return currRep.update(this._repairInfo());
      }
      return GIS.create(this._repairInfo());
    });
  }
  async saveSP() {
    try {
      gis_repair_sp
        .destroy({
          where: { gis_code: this.gis_code, asc_ndk: this.asc_ndk },
        })
        .then(() => {
          gis_repair_sp.bulkCreate(this._spInfo());
        });
    } catch {
      (err) => console.log(err);
    }
  }
}
