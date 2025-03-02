import xml2json from "../../utils/xml2json.js";
import fs from "fs";
import jsdom from "jsdom";
import { GIS, smsStatus, ASCInfo } from "../sql/models.js";
import { Op } from "sequelize";

class GiS_Service {
  parseDataFromXML(filename, cb = () => {}) {
    let parsed = [];
    fs.readFile("./downloads/" + filename, "utf8", (err, data) => {
      if (err) {
        return console.log(err);
      }
      const { JSDOM } = jsdom;
      global.DOMParser = new JSDOM().window.DOMParser;
      const parser = new DOMParser();
      const xmlDom = parser.parseFromString(data, "text/xml");
      const raw = xmlDom.querySelectorAll("rem");

      raw.forEach((el) => {
        const asc_name = el.getAttribute("asc_name");
        const asc_gor = el.getAttribute("asc_gor");
        const asc_adr = el.getAttribute("asc_adr");
        const asc_telephone = el.getAttribute("asc_telephone");
        const asc_email = el.getAttribute("asc_email");
        const asc_ndk = Number(el.getAttribute("asc_ndk"));
        const cli_name = el.getAttribute("cli_name");
        const cli_telephone = el.getAttribute("cli_telephone");
        const cli_email = el.getAttribute("cli_email");
        const vr = el.getAttribute("vr");
        const snno_tool = el.getAttribute("snNo_tool");
        const matno_tool = el.getAttribute("matNo_tool");
        const dateofpurch_tool = el.getAttribute("dateofpurch_tool");
        const torgorg_tool = el.getAttribute("torgorg_tool");
        const date_prin = el.getAttribute("date_prin");
        const date_dia = el.getAttribute("date_dia");
        const date_sogl1 = el.getAttribute("date_sogl1");
        const date_sogl2 = el.getAttribute("date_sogl2");
        const date_vipoln = el.getAttribute("date_vipoln");
        const date_vidach = el.getAttribute("date_vidach");

        const rem_work = el.querySelector("work")?.getAttribute("rem_work");
        const spareparts = el.querySelectorAll("sparepart");
        let spareparts_array = [];
        spareparts.forEach((el) => {
          spareparts_array.push({
            sp_matNo: el?.getAttribute("sp_matNo"),
            sp_kol_vo: Number(el?.getAttribute("sp_kol-vo")),
          });
        });

        parsed.push({
          asc_name,
          asc_gor,
          asc_adr,
          asc_telephone,
          asc_email,
          asc_ndk,
          cli_name,
          cli_telephone,
          cli_email,
          vr,
          snno_tool,
          matno_tool,
          dateofpurch_tool,
          torgorg_tool,
          date_prin,
          date_dia,
          date_sogl1,
          date_sogl2,
          date_vipoln,
          date_vidach,
          rem_work,
          spareparts_array,
        });
      });
      cb(parsed);
    });
  }
  async firstUploadDB(data) {
    const promises = data.map((el) => {
      const asc_info = ASCInfo.findOne({
        where: { organization_name: { [Op.like]: "%" + el.asc_name + "%" } },
        raw: true,
      });
      return { ...el, asc_kod: asc_info.gis_code };
    });
    Promise.all(promises).then((data_with_asc_info) => {
      GIS.bulkCreate(data_with_asc_info);
    });
  }

  async upsertDB(data) {
    try {
      const promises = data.map((el) => {
        const { id, ...data_to_DB } = el;
        let asc_kod = 1408;
        ASCInfo.findOne({
          where: { organization_name: { [Op.like]: "%" + el.asc_name + "%" } },
          raw: true,
        })
          .then((asc_info) => {
            asc_kod = Number(asc_info?.gis_code) || 1408;
            return GIS.findOne({
              where: {
                [Op.and]: [{ asc_ndk: el.asc_ndk }, { asc_kod }],
              },
            });
          })
          .then(function (obj) {
            if (obj) {
              return obj.update({ asc_kod, ...data_to_DB });
            }
            GIS.create({ asc_kod, ...data_to_DB });
            return;
          });
      });

      return Promise.all(promises)
        .then(() => console.log("done"))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }
}

function upd(data) {
  try {
    const gisService = new GiS_Service();
    //console.log(data[0])
    if (!data[0]) {
      return;
    }
    return gisService
      .upsertDB(data[0])
      .then(() => {
        console.log(data.length + "data length");
        upd(data.slice(1));
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
}

export async function GIS_SERVICE_FUNC() {
  const filename = "gis.xml";
  try {
    const gisService = new GiS_Service();
    gisService.parseDataFromXML(filename, (res) => {
      if (res.length < 150) {
        gisService
          .upsertDB(res)
          .then(() => console.log("db updated"))
          .catch((err) => console.log(err));
      } else {
        let size = 150; //размер подмассива
        let subarray = []; //массив в который будет выведен результат.
        for (let i = 0; i < Math.ceil(res.length / size); i++) {
          subarray[i] = res.slice(i * size, i * size + size);
        }
        upd(subarray);
      }
    });
    setTimeout(() => {
      fs.unlink("./downloads/" + filename, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("path/file.txt was deleted");
      });
    });
  } catch (error) {
    console.log(error);
  }
}

export default new GiS_Service();
