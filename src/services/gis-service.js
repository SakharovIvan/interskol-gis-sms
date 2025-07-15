import fs from "fs";
import jsdom from "jsdom";
import { Repair_dto } from "../models/repair.dto.js";

function parseDataFromXML(data) {
  try {
    const parsed = [];
    const { JSDOM } = jsdom;
    const dom = new JSDOM(data.toString());
    const doc = dom.window.document;

    //    global.DOMParser = new JSDOM(data.toString())//.window.DOMParser;
    //    const parser = new DOMParser();
    //    const xmlDom = parser.parseFromString(data, "text/xml");
    const raw = doc.querySelectorAll("rem");
    for (const el of raw) {
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
      const gis_code = Number(el.getAttribute("gis_code"));
      const spareparts_array = [];
      spareparts.forEach((el) => {
        spareparts_array.push({
          spmatNo: el?.getAttribute("sp_matNo"),
          qty: Number(el?.getAttribute("sp_kol-vo")),
        });
      });

      parsed.push({
        asc_name,
        asc_gor,
        gis_code,
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
    }

    return parsed;
  } catch (error) {
    console.log(error);
  }
}

export async function GIS_SERVICE_FUNC(del = false) {
  const filename = "gis.xml";
  try {
    fs.readFile("./downloads/" + filename, "utf8", (err, res) => {
      if(!res){return}
      const parsed = parseDataFromXML(res);
      const promises = parsed.map(async (el) => {
        try {
          const rep_dto = new Repair_dto(el);
          await rep_dto.saveToDB();
          await rep_dto.saveSP();
          return rep_dto;
        } catch (error) {
          return error, rep_dto;
        }
      });
      Promise.all(promises).then((res) => {
        console.log("DB updated "+new Date());
      });
    });

    if (del) {
      setTimeout(() => {
        fs.unlink("./downloads/" + filename, (err) => {
          if (err) {
            return console.log(err);
          }
          console.log("path/file.txt was deleted");
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
}
