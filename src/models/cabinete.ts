import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { users, usersId } from './users';

export interface cabineteAttributes {
  cabinet_id: number;
  judet: string;
  localitate: string;
  adresa: string;
  denumire_Cabinet?: string;
  user_id: number;
}

export type cabinetePk = "cabinet_id";
export type cabineteId = cabinete[cabinetePk];
export type cabineteOptionalAttributes = "cabinet_id" | "judet" | "localitate" | "denumire_Cabinet";
export type cabineteCreationAttributes = Optional<cabineteAttributes, cabineteOptionalAttributes>;

export class cabinete extends Model<cabineteAttributes, cabineteCreationAttributes> implements cabineteAttributes {
  cabinet_id!: number;
  judet!: string;
  localitate!: string;
  adresa!: string;
  denumire_Cabinet?: string;
  user_id!: number;

  // cabinete belongsTo users via user_id
  users_user!: users;
  getUsers_user!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUsers_user!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUsers_user!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof cabinete {
    return cabinete.init({
      cabinet_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      judet: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      localitate: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      adresa: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      denumire_Cabinet: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      }
    }, {
      sequelize,
      tableName: 'cabinete',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "cabinet_id" },
          ]
        },
        {
          name: "fk_cabinete_users1_idx",
          using: "BTREE",
          fields: [
            { name: "user_id" },
          ]
        },
      ]
    });
  }
}
