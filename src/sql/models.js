import { Sequelize, DataTypes, Model, EagerLoadingError } from "sequelize";
import { sequelize ,ascSeq } from "../../config.js";
//class GIS extends Model {}
//class smsStatus extends Model {}

const GIS = sequelize.define(
  "gis",
  {
    //    id: {
    //      type: DataTypes.UUID,
    //      primaryKey: true,
    //     // defaultValue: Sequelize.UUIDV4,
    //    },
    asc_name: {
      type: DataTypes.TEXT,
    },
    asc_gor: {
      type: DataTypes.TEXT,
    },
    asc_adr: {
      type: DataTypes.TEXT,
    },
    asc_ndk: {
      type: DataTypes.INTEGER,
    },
    asc_kod: {
      type: DataTypes.INTEGER,
    },
    asc_telephone: {
      type: DataTypes.TEXT,
    },
    asc_email: {
      type: DataTypes.TEXT,
    },
    cli_name: {
      type: DataTypes.TEXT,
    },
    cli_telephone: {
      type: DataTypes.TEXT,
    },
    vr: {
      type: DataTypes.TEXT,
    },
    snno_tool: {
      type: DataTypes.TEXT,
    },
    matno_tool: {
      type: DataTypes.TEXT,
    },
    dateofpurch_tool: {
      type: DataTypes.STRING(10),
    },
    torgorg_tool: {
      type: DataTypes.TEXT,
    },
    date_prin: {
      type: DataTypes.STRING(10),
    },
    date_dia: {
      type: DataTypes.STRING(10),
    },
    date_sogl1: {
      type: DataTypes.STRING(10),
    },
    date_sogl2: {
      type: DataTypes.STRING(10),
    },
    date_ojod1: {
      type: DataTypes.STRING(10),
    },
    date_ojod2: {
      type: DataTypes.STRING(10),
    },
    date_vipoln: {
      type: DataTypes.STRING(10),
    },
    date_vidach: {
      type: DataTypes.STRING(10),
    },
    rem_work: {
      type: DataTypes.TEXT,
    },
    last_update_date: {
      type: DataTypes.TEXT,
    },
    term_rep_all: {
      type: DataTypes.INTEGER,
    },
    term_rep_wosogl: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "gis",
    sequelize,
    createdAt: false,
    updatedAt: false,
    hooks: {
      afterCreate: (gis, options) => {
        console.log(gis.dataValues);
        smsStatus.create(
          {
            asc_ndk: gis.dataValues.asc_ndk,
            asc_kod: gis.dataValues.asc_kod,
            cli_telephone: gis.dataValues.cli_telephone,
          },
          { returning: false }
        );
      },
      afterBulkCreate: (gis, options) => {
        const promises = gis.map((el) => {
          smsStatus.create(
            {
              asc_ndk: el.dataValues.asc_ndk,
              asc_kod: el.dataValues.asc_kod,
              cli_telephone: el.dataValues.cli_telephone,
              SMS_status_opros: true,
            },
            { returning: false }
          );
        });
        Promise.all(promises);
      },
    },
  }
);

const smsStatus = sequelize.define(
  "smsStatus",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    asc_ndk: {
      type: DataTypes.INTEGER,
    },
    asc_kod: {
      type: DataTypes.INTEGER,
    },
    cli_telephone: {
      type: DataTypes.TEXT,
    },
    SMS_status_prin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    SMS_statusdia: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    SMS_status_sogl1: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    SMS_status_sogl2: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    SMS_status_ojod1: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    SMS_status_ojod2: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    SMS_status_vipoln: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    SMS_status_vidach: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    SMS_status_opros: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "smsStatus",
    sequelize,
    createdAt: false,
    updatedAt: "updateTimestamp",
  }
);

const ASCInfo = ascSeq.define(
  "ASCInfos",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    gis_code: {
      type: DataTypes.INTEGER,
    },
    organization_name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "ASCInfos",
    sequelize,
    createdAt: true,
  }
);

export { GIS, smsStatus, ASCInfo };
try {
  GIS.sync().then(() => console.log("Connection to GIS DB is OK"));
  smsStatus.sync().then(() => console.log("Connection to smsStatus DB is OK"));
  ASCInfo.sync().then(() => console.log("Connection to ASCInfo DB is OK"));
  // GIS.hasOne(smsStatus);
  // smsStatus.belongsTo(GIS);
  // GIS.create({ asc_kod:123,asc_ndk:123 })
  //const c = await GIS.findAll({
  //  attributes: [
  //    "cli_telephone",
  //    "asc_kod",
  //    "asc_ndk",
  //    "date_prin",
  //    "date_vipoln",
  //  ],
  //  include: {
  //    model: smsStatus,
  //    as: "smsStatus",
  //
  //    on: {
  //      col1: Sequelize.where(
  //        Sequelize.col("gis.asc_kod"),
  //        "=",
  //        Sequelize.col("smsStatus.asc_kod")
  //      ),
  //      col2: Sequelize.where(
  //        Sequelize.col("gis.asc_ndk"),
  //        "=",
  //        Sequelize.col("smsStatus.asc_ndk")
  //      ),
  //    },
  //    attributes: ["cli_telephone", "asc_kod", "asc_ndk"],
  //    where: { SMS_status_prin: false },
  //    required: true,
  //  },
  //  raw: true,
  //});
  //console.log(c)
} catch (error) {
  console.log(error);
}
