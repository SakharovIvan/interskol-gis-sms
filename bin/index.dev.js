import getPost from "../email/imap_readfile.js";
import gisService from "../src/services/gis-service.js";

try {
//  getPost();

  //setTimeout( () => {
    const filename = "gis.xml";
    gisService.parseDataFromXML(filename, (res) => {
      gisService.firstUploadDB(res);
    });
  //}, 0);
} catch (err) {
  console.log(err);
}
