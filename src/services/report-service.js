import { GIS, smsStatus, ASCInfo } from "../sql/models.js";
import { Op } from "sequelize";
import { datedif } from "../../utils/formatters.js";
import { createXLSXfromJSON } from "../../utils/formatters.js";
class Report_service {
  async ThisYearList() {
    const data = await GIS.findAll({
      where: { date_vipoln: { [Op.like]: "%2025%" } },
      raw: true,
    });
    return data;
  }

  async Filter() {
    const data = await this.ThisYearList();
    const newdata = data
      .map((el) => {
        el.srok_vip =
          datedif(el.date_vidach, el.date_prin) -
          datedif(el.date_sogl2, el.date_sogl1);
        if (el.date_sogl2 === "") {
          el.srok_vip = datedif(el.date_vidach, el.date_prin);
        }
        return el;
      })
      .filter((el) => el.srok_vip <= 3)
      .map(
        ({
          snno_tool,
          date_prin,
          date_vidach,
          cli_telephone,
          srok_vip,

          ...data
        }) => {
          return {
            snno_tool,
            date_prin,
            date_vidach,
            cli_telephone,
            srok_vip,
          };
        }
      );
    return newdata;
  }

  async CreateReport() {
    const rep = await this.Filter();
    console.log(rep);
    createXLSXfromJSON(rep);
  }
}

export default new Report_service();
try {
  const rep = new Report_service();
  await rep.CreateReport();
} catch (error) {}
