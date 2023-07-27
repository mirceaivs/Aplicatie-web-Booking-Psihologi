import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { programari, programariId } from './programari';
import type { servicii, serviciiId } from './servicii';

export interface programari_serviciiAttributes {
  programare_id: number;
  seriviciu_id: number;
}

export type programari_serviciiPk = "programare_id" | "seriviciu_id";
export type programari_serviciiId = programari_servicii[programari_serviciiPk];
export type programari_serviciiCreationAttributes = programari_serviciiAttributes;

export class programari_servicii extends Model<programari_serviciiAttributes, programari_serviciiCreationAttributes> implements programari_serviciiAttributes {
  programare_id!: number;
  seriviciu_id!: number;

  // programari_servicii belongsTo programari via programare_id
  programare!: programari;
  getProgramare!: Sequelize.BelongsToGetAssociationMixin<programari>;
  setProgramare!: Sequelize.BelongsToSetAssociationMixin<programari, programariId>;
  createProgramare!: Sequelize.BelongsToCreateAssociationMixin<programari>;
  // programari_servicii belongsTo servicii via seriviciu_id
  seriviciu!: servicii;
  getSeriviciu!: Sequelize.BelongsToGetAssociationMixin<servicii>;
  setSeriviciu!: Sequelize.BelongsToSetAssociationMixin<servicii, serviciiId>;
  createSeriviciu!: Sequelize.BelongsToCreateAssociationMixin<servicii>;

  static initModel(sequelize: Sequelize.Sequelize): typeof programari_servicii {
    return programari_servicii.init({
    programare_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'programari',
        key: 'programare_id'
      }
    },
    seriviciu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'servicii',
        key: 'seriviciu_id'
      }
    }
  }, {
    sequelize,
    tableName: 'programari_servicii',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "programare_id" },
          { name: "seriviciu_id" },
        ]
      },
      {
        name: "fk_Programari_has_Servicii_Servicii1_idx",
        using: "BTREE",
        fields: [
          { name: "seriviciu_id" },
        ]
      },
      {
        name: "fk_Programari_has_Servicii_Programari1_idx",
        using: "BTREE",
        fields: [
          { name: "programare_id" },
        ]
      },
    ]
  });
  }
}
