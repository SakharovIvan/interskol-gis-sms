import fs from "fs";
import jsdom from "jsdom";
import { ASC, DATA_TYPES, Repair, Tool } from "../models/repair.dto.js";

function parse_VR_fromXML(doc) {
  const GIS_VR = doc.querySelector("LVR").querySelectorAll("RECORD");
  let GIS_VR_codes = {};
  for (const el of GIS_VR) {
    GIS_VR_codes[Number(el.getAttribute("VR"))] = el.getAttribute("NAME");
  }
  return GIS_VR_codes;
}
function parse_tool_fromXML(doc) {
  const TOOL_list = doc.querySelector("KIN").querySelectorAll("RECORD");
  const res = [];
  for (const el of TOOL_list) {
    res.push(new Tool({ data: el, type: DATA_TYPES[1] }));
  }
  return res;
}
function parse_ASC_fromXML(doc) {
  const ASC_list = doc.querySelector("SSC").querySelectorAll("RECORD");
  const res = [];
  for (const el of ASC_list) {
    res.push(new ASC({ data: el, type: DATA_TYPES[1] }));
  }
  return res;
}
function parse_Repairs_fromXML(doc, tools, GIS_VR_codes) {
  const raw = doc.querySelector("DOCS").querySelectorAll("DOC");
  const res = [];
  for (const el of raw) {
    const tool = tools.filter(
      (toolel) => toolel.snno_tool === el.getAttribute("SN")
    )[0];
    res.push(new Repair({ data: el, GIS_VR_codes, tool, type: DATA_TYPES[1] }));
  }
  return res;
}

function parseDataFromXML(data) {
  try {
    const dom = new jsdom.JSDOM("");
    const DOMParser = dom.window.DOMParser;
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/xml");

    const GIS_VR_codes = parse_VR_fromXML(doc);
    const ASC_list = parse_ASC_fromXML(doc);
    const tools = parse_tool_fromXML(doc);
    const repairs = parse_Repairs_fromXML(doc, tools, GIS_VR_codes);
    console.log(repairs[10].SP_list);

    return repairs;
  } catch (error) {
    console.log(error);
  }
}

try {
  const filename = "gis.xml";
  fs.readFile("./downloads/" + filename, "utf8", (err, res) => {
    if (!res) {
      return;
    }

    parseDataFromXML(res);
  });
} catch (error) {}

export async function GIS_SERVICE_FUNC(del = false) {
  const filename = "gis.xml";
  try {
    fs.readFile("./downloads/" + filename, "utf8", (err, res) => {
      if (!res) {
        return;
      }
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
        console.log("DB updated " + new Date());
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
