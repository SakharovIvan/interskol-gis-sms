import {
  Tools,
  Organizations,
  Work_DB,
  ASC_GIS_DB,
  Repairs_GIS_DB,
  Repairs_SP_GIS_DB,
  Clients_GIS_DB,
} from "../src/models/gisCL3.js";
try {
  await Tools.sync({ force: true, alter: true });
  await Organizations.sync({ force: true, alter: true });
  await Work_DB.sync({ force: true, alter: true });
  await ASC_GIS_DB.sync({ force: true, alter: true });
  await Repairs_GIS_DB.sync({ force: true, alter: true });
  await Repairs_SP_GIS_DB.sync({ force: true, alter: true });
  await Clients_GIS_DB.sync({ force: true, alter: true });
} catch (error) {
  console.log(error);
}
