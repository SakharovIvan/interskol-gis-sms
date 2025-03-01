import { GIS, smsStatus, ASCInfo } from "../sql/models.js";
import { Op } from "sequelize";
import Sequelize from "sequelize";
import { datedif, normalizeTlf } from "../../utils/formatters.js";
class SMS_service {
  async SMS_list(params) {
    GIS.hasOne(smsStatus);
    //smsStatus.belongsTo(GIS);
    return await GIS.findAll({
      attributes: [
        "cli_telephone",
        "asc_kod",
        "asc_ndk",
        "date_prin",
        "date_vipoln",
        "date_vidach",
      ],
      include: {
        model: smsStatus,
        as: "smsStatus",

        on: {
          col1: Sequelize.where(
            Sequelize.col("gis.asc_kod"),
            "=",
            Sequelize.col("smsStatus.asc_kod")
          ),
          col2: Sequelize.where(
            Sequelize.col("gis.asc_ndk"),
            "=",
            Sequelize.col("smsStatus.asc_ndk")
          ),
        },
        attributes: ["cli_telephone", "asc_kod", "asc_ndk"],
        where: { ...params },
        required: true,
      },
      raw: true,
    });
  }

  async TelephoneListToSent() {
    const prinList = await this.SMS_list({ SMS_status_prin: false });
    const vipolnList = await this.SMS_list({ SMS_status_vipoln: false });
    const opros = await this.SMS_list({ SMS_status_opros: false });
    const tlf_prin = prinList
      .filter((el) => datedif(el.date_prin) < 2)
      .map((el) => {
        const tlf = normalizeTlf(el?.cli_telephone);
        el.cli_telephone = tlf;
        return el;
      });
    const tlf_vipoln = vipolnList
      .filter((el) => datedif(el.date_vipoln) < 2)
      .map((el) => {
        const tlf = normalizeTlf(el?.cli_telephone);
        el.cli_telephone = tlf;
        return el;
      });

    const tlf_opros = opros
      .filter(
        (el) => datedif(el.date_vidach) > 7 && datedif(el.date_vidach) < 10
      )
      .map((el) => {
        const tlf = normalizeTlf(el?.cli_telephone);
        el.cli_telephone = tlf;
        return el;
      });

    this.tlf_prin = tlf_prin;
    this.tlf_vipoln = tlf_vipoln;
    this.tlf_opros = tlf_opros;

    return;
  }
  List_tlf() {
    const tlf_prin = this.tlf_prin
      .map(({ cli_telephone }) => cli_telephone)
      .filter((value, index, self) => {
        return self.indexOf(value) === index && value !== "";
      });
    const tlf_vipoln = this.tlf_vipoln
      .map(({ cli_telephone }) => cli_telephone)
      .filter((value, index, self) => {
        return self.indexOf(value) === index && value !== "";
      });
    const tlf_opros = this.tlf_opros
      .map(({ cli_telephone }) => cli_telephone)
      .filter((value, index, self) => {
        return self.indexOf(value) === index && value !== "";
      });
    return { tlf_prin, tlf_vipoln, tlf_opros };
  }

  async updateSMS_status() {
    const promises_tlf_prin = this.tlf_prin?.map(
      async ({ asc_kod, asc_ndk }) => {
        await smsStatus.update(
          { SMS_status_prin: true },
          { where: { asc_kod, asc_ndk } }
        );
      }
    );

    const promises_tlf_vipoln = this.tlf_vipoln?.map(
      async ({ asc_kod, asc_ndk }) => {
        await smsStatus.update(
          { SMS_status_vipoln: true },
          { where: { asc_kod, asc_ndk } }
        );
      }
    );

    const promises_tlf_opros = this.tlf_opros?.map(
      async ({ asc_kod, asc_ndk }) => {
        await smsStatus.update(
          { SMS_status_opros: true },
          { where: { asc_kod, asc_ndk } }
        );
      }
    );

    return Promise.all(promises_tlf_prin)
      .then(() => Promise.all(promises_tlf_vipoln))
      .then(() => Promise.all(promises_tlf_opros));
  }
}

export default new SMS_service();

export async function SMS_SERVICE_FUNC() {
  try {
    const service = new SMS_service();
    return service
      .TelephoneListToSent()
      .then(() => {
        const tlfs = service.List_tlf();
        console.log(tlfs);
        return tlfs;
      })
      .finally(() => {
        service.updateSMS_status();
      });
  } catch (error) {
    console.log(error);
  }
}
