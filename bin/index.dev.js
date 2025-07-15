import getPost from "../email/imap_readfile.js";
import { GIS_SERVICE_FUNC } from "../src/services/gis-service.js";

try {
  const filename = "gis.xml";
  await GIS_SERVICE_FUNC();
} catch (err) {
  console.log(err);
}
