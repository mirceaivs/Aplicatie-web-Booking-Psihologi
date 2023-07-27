import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface program_psihologiAttributes {
  program_id: number;
  ziua_saptamanii: string;
  ora_inceput: string;
  ora_sfarsit: string;
  user_id: number;
}

export type program_psihologiPk = "program_id" | "user_id";
export type program_psihologiId = program_psihologi[program_psihologiPk];
export type program_psihologiOptionalAttributes = "program_id";
export type program_psihologiCreationAttributes = Optional<program_psihologiAttributes, program_psihologiOptionalAttributes>;

export class program_psihologi extends Model<program_psihologiAttributes, program_psihologiCreationAttributes> implements program_psihologiAttributes {
  program_id!: number;
  ziua_saptamanii!: string;
  ora_inceput!: string;
  ora_sfarsit!: string;
  user_id!: number;

  // program_psihologi belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof program_psihologi {
    return program_psihologi.init({
      program_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      ziua_saptamanii: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      ora_inceput: {
        type: DataTypes.TIME,
        allowNull: false
      },
      ora_sfarsit: {
        type: DataTypes.TIME,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'user_id'
        }
      }
    }, {
      sequelize,
      tableName: 'program_psihologi',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "program_id" },
            { name: "user_id" },
          ]
        },
        {
          name: "fk_program_psihologi_users1_idx",
          using: "BTREE",
          fields: [
            { name: "user_id" },
          ]
        },
      ]
    });
  }
}
