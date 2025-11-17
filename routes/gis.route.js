import { Router } from "express";
import {
  Repairs_SP_GIS_DB,
  Repairs_GIS_DB,
  Clients_GIS_DB,
  Tools,
} from "../src/models/gisCL3.js";
const GisRoute = new Router();

GisRoute.get("", async (req, res) => {
  const options = req.query;
  const { spmatNo, gis_code, asc_ndk, cli_telephone, snno_tool, tool_id } =
    options;
  //search by cli tlf
  if (!(spmatNo || gis_code || asc_ndk || cli_telephone || snno_tool)) {
    return res.json({
      status: 404,
      msg: "There is no paramteres to search",
    });
  }
  if (cli_telephone) {
    const client = await Clients_GIS_DB.findOne({
      where: { telephone: cli_telephone },
      raw: true,
    });
    if (!client) {
      return res.json({
        status: 404,
        msg: "There is no info by client telephone" + cli_telephone,
      });
    }
    const repairList = await Repairs_GIS_DB.findAll({
      where: { client_id: client.id },
      raw: true,
    });
    return res.json(repairList);
  }
  //search by snno_tool
  if (snno_tool ) {
    const search = {};
    if (snno_tool ) {
      search.snno_tool = snno_tool;
    }
    if (tool_id ) {
      search.id = tool_id;
    }
    const tool = await Tools.findOne({ where: snno_tool, raw: true });
    if (!tool) {
      return res.json({
        status: 404,
        msg: "There is no info by snno_tool" + snno_tool,
      });
    }

    const repairList = await Repairs_GIS_DB.findAll({
      where: { tool_id: tool.id },
      raw: true,
    });
    return res.json(repairList);
  }
  //search by gis_code
  if (gis_code && asc_ndk) {
    const asc = await ASC_GIS_DB.findOne({ where: { gis_code }, raw: true });
    const repair = await Repairs_GIS_DB.findAll({
      where: { asc_id: asc.id, ndk: asc_ndk },
      raw: true,
    });
    if (!repair) {
      return res.json({
        status: 404,
        msg: "There is no info by gis_code and ndk " + gis_code + " " + asc_ndk,
      });
    }
    return res.json(repair);
  }
  if (gis_code) {
    const asc = await ASC_GIS_DB.findOne({ where: { gis_code }, raw: true });
    const repairList = await Repairs_GIS_DB.findAll({
      where: { asc_id: asc.id },
      raw: true,
    });
    const promises = repairList.map(async (el) => {
      const sp_list = await Repairs_SP_GIS_DB.findAll({
        where: { Repair_id: el.id },
        raw: true,
      });
      if (spmatNo && el.spmatNo === spmatNo) {
        return { el, sp_list };
      }
      return { el, sp_list };
    });

    return Promise.all(promises).then((result) => {
      return res.json(result);
    });
  }
});

GisRoute.get("/check", async (req, res) => {
  const options = req.query;
  const { asc_ndk, gis_code, spmatNo } = options;
  if (!asc_ndk || !gis_code || !spmatNo) {
    const param = asc_ndk
      ? ""
      : `${asc_ndk} ` + gis_code
      ? ""
      : `${gis_code} ` + spmatNo
      ? ""
      : `${spmatNo} `;
    return res.json({ msg: `Set ${param} for your request`, status: 400 });
  }
  const asc = await ASC_GIS_DB.findOne({ where: { gis_code }, raw: true });
  const repair_List = await Repairs_GIS_DB.findAll({
    where: { asc_id: asc.id, ndk: asc_ndk },
    raw: true,
  });
  if (!repair_List) {
    return res.json({ status: 404 });
  }

  return gis_repair_sp
    .findAll({
      where: { asc_ndk: Number(asc_ndk), gis_code: Number(gis_code), spmatNo },
      raw: true,
    })
    .then((gis_with_sp) => {
      if (gis_with_sp.length !== 0) {
        res.json({ status: 200 });
      } else {
        res.json({ status: 404 });
      }
    });
});

export { GisRoute };
