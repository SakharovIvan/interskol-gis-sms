import fs from "fs";
import jsdom from "jsdom";
import {
  parse_ASC_fromXML,
  parse_Repairs_fromXML,
  parse_VR_fromXML,
  parse_tool_fromXML,
  parseOrganizations,
  parse_Work,
  parse_Clients,
} from "./parsers.js";

async function parseDataFromXML(data) {
  try {
    const dom = new jsdom.JSDOM("");
    const DOMParser = dom.window.DOMParser;
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/xml");

    const GIS_VR_codes = await parse_VR_fromXML(doc);
    await parse_ASC_fromXML(doc);
    await parseOrganizations(doc);
    await parse_Work(doc);
    await parse_Clients(doc);
    await parse_tool_fromXML(doc);
    await parse_Repairs_fromXML(doc, GIS_VR_codes);
    return repairs;
  } catch (error) {
    console.log(error);
  }
}

export async function GIS_SERVICE_FUNC(del = false) {
  const filename = "gis.xml";
  try {
    fs.readFile("./downloads/" + filename, "utf8", (err, res) => {
      if (!res) {
        return;
      }
      const parsed = parseDataFromXML(res);
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
