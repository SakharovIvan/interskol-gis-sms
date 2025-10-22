import { Sequelize, DataTypes, Model, EagerLoadingError } from "sequelize";
import { sequelizeGIS } from "../../config.js";

const ASC_GIS_DB = sequelizeGIS.define(
  "ASC",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    gis_code: { type: DataTypes.INTEGER },
    C1_code: { type: DataTypes.STRING },
    organization_name: { type: DataTypes.STRING },
    Indeks: { type: DataTypes.STRING },
    addres: { type: DataTypes.STRING },
    Tlf: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    Raschet_schet_bank: { type: DataTypes.STRING },
    Korr_schet_bank: { type: DataTypes.STRING },
    BIK_bank: { type: DataTypes.STRING },
    Name_bank: { type: DataTypes.STRING },
    organization_INN: { type: DataTypes.STRING },
    OKPO: { type: DataTypes.STRING },
    email_2: { type: DataTypes.STRING },
    skid: { type: DataTypes.INTEGER },
    contract_DSO: { type: DataTypes.STRING },
    contract_DSO_date: { type: DataTypes.STRING },
    contract_shipment: { type: DataTypes.STRING },
    contract_shipment_date: { type: DataTypes.STRING },
    DSO_region: { type: DataTypes.INTEGER },
    KPP: { type: DataTypes.STRING },
  },
  {
    tableName: "ASC",
    sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  }
);

const Repairs_GIS_DB = sequelizeGIS.define(
  "Repairs",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    ndk: { type: DataTypes.INTEGER },
    asc_id: { type: DataTypes.UUID },
    client_id: { type: DataTypes.UUID },
    vr: { type: DataTypes.TEXT },
    tool_id: { type: DataTypes.UUID },
    prin: { type: DataTypes.DATEONLY },
    dia: { type: DataTypes.DATEONLY },
    accept_1: { type: DataTypes.DATEONLY },
    accept_2: { type: DataTypes.DATEONLY },
    sp_wait_1: { type: DataTypes.DATEONLY },
    sp_wait_2: { type: DataTypes.DATEONLY },
    vipoln: { type: DataTypes.DATEONLY },
    vidach: { type: DataTypes.DATEONLY },
  },
  {
    tableName: "Repairs_SP",
    sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  }
);

const Tools = sequelizeGIS.define(
  "Tools",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    snno_tool: { type: DataTypes.TEXT },
    matno_tool: { type: DataTypes.TEXT },
    torgorg_tool: { type: DataTypes.TEXT },
    manifacture_data: { type: DataTypes.DATEONLY },
    purchase_tool: { type: DataTypes.DATEONLY },
    nfc: { type: DataTypes.TEXT },
    mct_check: { type: DataTypes.BOOLEAN },
    mct_check_res: { type: DataTypes.BOOLEAN },
  },
  {
    tableName: "Repairs_SP",
    sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  }
);

const Repairs_SP_GIS_DB = sequelizeGIS.define(
  "Repairs_SP",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    Repair_id: {
      type: DataTypes.UUID,
    },
    spmatNo: {
      type: DataTypes.STRING,
    },
    work: {
      type: DataTypes.BOOLEAN,
    },
    qty: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Repairs_SP",
    sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  }
);

const Clients_GIS_DB = sequelizeGIS.define("Clinents", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  name: {
    type: DataTypes.TEXT,
  },
  telephone: {
    type: DataTypes.TEXT,
  },
});

const Work_DB = sequelizeGIS.define("Works", {
  gis_code: { type: DataTypes.INTEGER, primaryKey: true },
  name: { type: DataTypes.TEXT },
});

const Organizations = sequelizeGIS.define(
  "Organizatoions",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: DataTypes.TEXT,
    },
    addres: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Organizatoions",
    sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  }
);

export {
  Tools,
  Organizations,
  Work_DB,
  ASC_GIS_DB,
  Repairs_GIS_DB,
  Repairs_SP_GIS_DB,
  Clients_GIS_DB,
};
