import { Sequelize, DataTypes, Model,  } from "sequelize";
import { sequelizeGIS } from "../../config.js";

class ASC_GIS_DB extends Model {}
ASC_GIS_DB.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    gis_code: { type: DataTypes.BIGINT },
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
    sequelize:sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  }
);

class Repairs_GIS_DB extends Model {}
Repairs_GIS_DB.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    ndk: { type: DataTypes.BIGINT },
    asc_id: { type: DataTypes.UUID },
    work_id: { type: DataTypes.BIGINT },
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
    tableName: "Repairs",
    sequelize:sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  }
);

class Tools extends Model {}
Tools.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    snno_tool: { type: DataTypes.TEXT },
    matno_tool: { type: DataTypes.TEXT },
    manifacture_data: { type: DataTypes.DATEONLY },
    purchase_tool: { type: DataTypes.DATEONLY },
    nfc: { type: DataTypes.TEXT },
    mct_check: { type: DataTypes.BOOLEAN },
    mct_check_res: { type: DataTypes.BOOLEAN },
    organization_id: { type: DataTypes.TEXT },
  },
  {
    tableName: "Tools",
    sequelize:sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  }
);

class Repairs_SP_GIS_DB extends Model {}
Repairs_SP_GIS_DB.init(
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
    qty: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "Repairs_SP",
    sequelize:sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  }
);

class Clients_GIS_DB extends Model {}
Clients_GIS_DB.init( {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  gis_code: { type: DataTypes.BIGINT, primaryKey: true },
  fiz: { type: DataTypes.BOOLEAN },
  name: {
    type: DataTypes.TEXT,
  },
  telephone: {
    type: DataTypes.TEXT,
  },
},
  {
    tableName: "Clients",
    sequelize:sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  });

class Work_DB extends Model {}
Work_DB.init({
  gis_code: { type: DataTypes.BIGINT, primaryKey: true },
  name: { type: DataTypes.TEXT },
},
  {
    tableName: "Works",
    sequelize:sequelizeGIS,
    createdAt: true,
    updatedAt: true,
  });

class Organizations extends Model {}
Organizations.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    gis_code: { type: DataTypes.BIGINT, primaryKey: true },
    telephone: {
      type: DataTypes.TEXT,
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
    sequelize:sequelizeGIS,
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
