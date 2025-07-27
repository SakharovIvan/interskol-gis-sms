import { Router } from "express";
import { GIS, gis_repair_sp } from "../src/models/models.js";

const GisRoute = new Router();

GisRoute.get("", (req, res) => {
  const options = req.query;
  const { data, limit, offset, spmatNo, gis_code } = options;
  const gisSearch = { ...data };
  if (gis_code) {
    gisSearch.asc_ndk = gis_code;
  }
  if (spmatNo) {
    return gis_repair_sp
      .findAll({ where: { spmatNo }, raw: true })
      .then((sp_list) => {
        const promises = sp_list.map((el) => {
          return GIS.findAll({
            where: { asc_ndk: el.asc_ndk, asc_ndk: el.gis_code },
            raw: true,
          });
        });
        return Promise.all(promises);
      })
      .then((gis_with_sp) => {
        res.json({ gis_with_sp });
      });
  }
  return GIS.findAll({
    where: { ...gisSearch },
    limit,
    offset,
    raw: true,
  })
    .then((gis) => {
      const promises = gis.map((el) => {
        return gis_repair_sp
          .findAll({
            where: { gis_code: el.asc_kod, asc_ndk: el.asc_ndk },
            raw: true,
          })
          .then((sp_list) => {
            {
              return { ...el, sp_list };
            }
          });
      });
      return Promise.all(promises);
    })
    .then((gis_with_sp) => {
      res.json({ gis_with_sp });
    });
});
GisRoute.get("/check", (req, res) => {
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
  return gis_repair_sp
    .findAll({ where: { asc_ndk:Number(asc_ndk), gis_code:Number(gis_code), spmatNo }, raw: true })
    .then((gis_with_sp) => {
      if (gis_with_sp.length!==0) {
        res.json({ status: 200 });
      } else {
        res.json({ status: 404 });
      }
    });
});

export { GisRoute };
