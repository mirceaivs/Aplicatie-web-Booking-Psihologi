import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { programari, programariId } from './programari';
import type { programari_servicii, programari_serviciiId } from './programari_servicii';
import type { specializari, specializariId } from './specializari';

export interface serviciiAttributes {
  seriviciu_id: number;
  denumire?: string;
  pret: number;
  durata: number;
  descriere?: string;
  specializare_id: number;
  user_id: number;
}

export type serviciiPk = "seriviciu_id" | "specializare_id" | "user_id";
export type serviciiId = servicii[serviciiPk];
export type serviciiOptionalAttributes = "seriviciu_id" | "denumire" | "descriere";
export type serviciiCreationAttributes = Optional<serviciiAttributes, serviciiOptionalAttributes>;

export class servicii extends Model<serviciiAttributes, serviciiCreationAttributes> implements serviciiAttributes {
  seriviciu_id!: number;
  denumire?: string;
  pret!: number;
  durata!: number;
  descriere?: string;
  specializare_id!: number;
  user_id!: number;

  // servicii belongsToMany programari via seriviciu_id and programare_id
  programare_id_programaris!: programari[];
  getProgramare_id_programaris!: Sequelize.BelongsToManyGetAssociationsMixin<programari>;
  setProgramare_id_programaris!: Sequelize.BelongsToManySetAssociationsMixin<programari, programariId>;
  addProgramare_id_programari!: Sequelize.BelongsToManyAddAssociationMixin<programari, programariId>;
  addProgramare_id_programaris!: Sequelize.BelongsToManyAddAssociationsMixin<programari, programariId>;
  createProgramare_id_programari!: Sequelize.BelongsToManyCreateAssociationMixin<programari>;
  removeProgramare_id_programari!: Sequelize.BelongsToManyRemoveAssociationMixin<programari, programariId>;
  removeProgramare_id_programaris!: Sequelize.BelongsToManyRemoveAssociationsMixin<programari, programariId>;
  hasProgramare_id_programari!: Sequelize.BelongsToManyHasAssociationMixin<programari, programariId>;
  hasProgramare_id_programaris!: Sequelize.BelongsToManyHasAssociationsMixin<programari, programariId>;
  countProgramare_id_programaris!: Sequelize.BelongsToManyCountAssociationsMixin;
  // servicii hasMany programari_servicii via seriviciu_id
  programari_serviciis!: programari_servicii[];
  getProgramari_serviciis!: Sequelize.HasManyGetAssociationsMixin<programari_servicii>;
  setProgramari_serviciis!: Sequelize.HasManySetAssociationsMixin<programari_servicii, programari_serviciiId>;
  addProgramari_servicii!: Sequelize.HasManyAddAssociationMixin<programari_servicii, programari_serviciiId>;
  addProgramari_serviciis!: Sequelize.HasManyAddAssociationsMixin<programari_servicii, programari_serviciiId>;
  createProgramari_servicii!: Sequelize.HasManyCreateAssociationMixin<programari_servicii>;
  removeProgramari_servicii!: Sequelize.HasManyRemoveAssociationMixin<programari_servicii, programari_serviciiId>;
  removeProgramari_serviciis!: Sequelize.HasManyRemoveAssociationsMixin<programari_servicii, programari_serviciiId>;
  hasProgramari_servicii!: Sequelize.HasManyHasAssociationMixin<programari_servicii, programari_serviciiId>;
  hasProgramari_serviciis!: Sequelize.HasManyHasAssociationsMixin<programari_servicii, programari_serviciiId>;
  countProgramari_serviciis!: Sequelize.HasManyCountAssociationsMixin;
  // servicii belongsTo specializari via specializare_id
  specializare!: specializari;
  getSpecializare!: Sequelize.BelongsToGetAssociationMixin<specializari>;
  setSpecializare!: Sequelize.BelongsToSetAssociationMixin<specializari, specializariId>;
  createSpecializare!: Sequelize.BelongsToCreateAssociationMixin<specializari>;
  // servicii belongsTo specializari via user_id
  user!: specializari;
  getUser!: Sequelize.BelongsToGetAssociationMixin<specializari>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<specializari, specializariId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<specializari>;

  static initModel(sequelize: Sequelize.Sequelize): typeof servicii {
    return servicii.init({
    seriviciu_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    denumire: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    pret: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    durata: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    descriere: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    specializare_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'specializari',
        key: 'specializare_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'specializari',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'servicii',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "seriviciu_id" },
          { name: "specializare_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "fk_servicii_specializari1_idx",
        using: "BTREE",
        fields: [
          { name: "specializare_id" },
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
