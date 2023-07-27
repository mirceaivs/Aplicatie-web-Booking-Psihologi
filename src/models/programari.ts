import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { programari_servicii, programari_serviciiId } from './programari_servicii';
import type { servicii, serviciiId } from './servicii';
import type { users, usersId } from './users';
import { format } from 'date-fns';
export interface programariAttributes {
  data_programare: Date;
  data_realizare?: Date;
  programare_id: number;
  user_id: number;
  aprobat: number;
}

export type programariPk = "programare_id" | "user_id";
export type programariId = programari[programariPk];
export type programariOptionalAttributes = "data_realizare" | "programare_id" | "aprobat";
export type programariCreationAttributes = Optional<programariAttributes, programariOptionalAttributes>;

export class programari extends Model<programariAttributes, programariCreationAttributes> implements programariAttributes {
  data_programare!: Date;
  data_realizare?: Date;
  programare_id!: number;
  user_id!: number;
  aprobat!: number;

  // programari hasMany programari_servicii via programare_id
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
  // programari belongsToMany servicii via programare_id and seriviciu_id
  seriviciu_id_serviciis!: servicii[];
  getSeriviciu_id_serviciis!: Sequelize.BelongsToManyGetAssociationsMixin<servicii>;
  setSeriviciu_id_serviciis!: Sequelize.BelongsToManySetAssociationsMixin<servicii, serviciiId>;
  addSeriviciu_id_servicii!: Sequelize.BelongsToManyAddAssociationMixin<servicii, serviciiId>;
  addSeriviciu_id_serviciis!: Sequelize.BelongsToManyAddAssociationsMixin<servicii, serviciiId>;
  createSeriviciu_id_servicii!: Sequelize.BelongsToManyCreateAssociationMixin<servicii>;
  removeSeriviciu_id_servicii!: Sequelize.BelongsToManyRemoveAssociationMixin<servicii, serviciiId>;
  removeSeriviciu_id_serviciis!: Sequelize.BelongsToManyRemoveAssociationsMixin<servicii, serviciiId>;
  hasSeriviciu_id_servicii!: Sequelize.BelongsToManyHasAssociationMixin<servicii, serviciiId>;
  hasSeriviciu_id_serviciis!: Sequelize.BelongsToManyHasAssociationsMixin<servicii, serviciiId>;
  countSeriviciu_id_serviciis!: Sequelize.BelongsToManyCountAssociationsMixin;
  // programari belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof programari {
    return programari.init({
      data_programare: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          const value = this.getDataValue('data_programare');
          if (value)
            return format(value, 'yyyy-MM-dd HH:mm');
        }
      },
      data_realizare: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          const value = this.getDataValue('data_realizare');
          if (value)
            return format(value, 'yyyy-MM-dd HH:mm');
        }
      },
      programare_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      aprobat: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
      }
    }, {
      sequelize,
      tableName: 'programari',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "programare_id" },
            { name: "user_id" },
          ]
        },
        {
          name: "fk_programari_users1_idx",
          using: "BTREE",
          fields: [
            { name: "user_id" },
          ]
        },
      ]
    });
  }
}
