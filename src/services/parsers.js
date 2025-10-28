import { DATA_TYPES, Repair, Tool, Work } from "../models/repair.dto.js";
import { ASC, Client, Organization } from "../models/asc.js";

async function DB_upd_by_params({ doc, querySelector, classType }) {
  const List = doc.querySelector(querySelector).querySelectorAll("RECORD");
  const res = [];
  for (const el of List) {
    res.push(new classType({ data: el, type: DATA_TYPES[1] }));
  }
  const res_filterd = res.reduce((acc, el) => {
    if (!acc.includes(el)) {
      acc.push(el);
    }
    return acc;
  }, []);
  const promises = res_filterd.map(async (el) => {
    if (el.init) {
      await el.init();
    }
    return await el.DB_upd();
  });
  return Promise.all(promises);
}

export async function parseOrganizations(doc) {
  return DB_upd_by_params({
    doc,
    querySelector: "ADRT",
    classType: Organization,
  });
}

export async function parse_VR_fromXML(doc) {
  const GIS_VR = doc.querySelector("LVR").querySelectorAll("RECORD");
  let GIS_VR_codes = {};
  for (const el of GIS_VR) {
    GIS_VR_codes[Number(el.getAttribute("VR"))] = el.getAttribute("NAME");
  }
  return GIS_VR_codes;
}

export async function parse_Work(doc) {
  return DB_upd_by_params({ doc, querySelector: "SRB", classType: Work });
}

export async function parse_tool_fromXML(doc) {
  return DB_upd_by_params({ doc, querySelector: "KIN", classType: Tool });
}

export async function parse_ASC_fromXML(doc) {
  return DB_upd_by_params({ doc, querySelector: "SSC", classType: ASC });
}

export async function parse_Clients(doc) {
  return DB_upd_by_params({ doc, querySelector: "SKL", classType: Client });
}

export async function parse_Repairs_fromXML(doc, GIS_VR_codes) {
  const raw = doc.querySelector("DOCS").querySelectorAll("DOC");
  const res = [];
  for (const el of raw) {
    res.push(new Repair({ data: el, GIS_VR_codes, type: DATA_TYPES[1] }));
  }
  const res_filterd = res.reduce((acc, el) => {
    if (!acc.includes(el)) {
      acc.push(el);
    }
    return acc;
  }, []);
  const promises = res_filterd.map(async (el) => {
    await el.init();
    return await el.DB_upd();
  });
  return Promise.all(promises);
}
