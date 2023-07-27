import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { servicii, serviciiId } from './servicii';
import type { users, usersId } from './users';

export interface specializariAttributes {
  specializare_id: number;
  denumire_specializare: string;
  poza_diploma?: Buffer;
  nr_atestat: string;
  user_id: number;
  verificat: number;
}

export type specializariPk = "specializare_id" | "user_id";
export type specializariId = specializari[specializariPk];
export type specializariOptionalAttributes = "specializare_id" | "poza_diploma" | "verificat";
export type specializariCreationAttributes = Optional<specializariAttributes, specializariOptionalAttributes>;

export class specializari extends Model<specializariAttributes, specializariCreationAttributes> implements specializariAttributes {
  specializare_id!: number;
  denumire_specializare!: string;
  poza_diploma?: Buffer;
  nr_atestat!: string;
  user_id!: number;
  verificat!: number;

  // specializari hasMany servicii via specializare_id
  serviciis!: servicii[];
  getServiciis!: Sequelize.HasManyGetAssociationsMixin<servicii>;
  setServiciis!: Sequelize.HasManySetAssociationsMixin<servicii, serviciiId>;
  addServicii!: Sequelize.HasManyAddAssociationMixin<servicii, serviciiId>;
  addServiciis!: Sequelize.HasManyAddAssociationsMixin<servicii, serviciiId>;
  createServicii!: Sequelize.HasManyCreateAssociationMixin<servicii>;
  removeServicii!: Sequelize.HasManyRemoveAssociationMixin<servicii, serviciiId>;
  removeServiciis!: Sequelize.HasManyRemoveAssociationsMixin<servicii, serviciiId>;
  hasServicii!: Sequelize.HasManyHasAssociationMixin<servicii, serviciiId>;
  hasServiciis!: Sequelize.HasManyHasAssociationsMixin<servicii, serviciiId>;
  countServiciis!: Sequelize.HasManyCountAssociationsMixin;
  // specializari hasMany servicii via user_id
  user_serviciis!: servicii[];
  getUser_serviciis!: Sequelize.HasManyGetAssociationsMixin<servicii>;
  setUser_serviciis!: Sequelize.HasManySetAssociationsMixin<servicii, serviciiId>;
  addUser_servicii!: Sequelize.HasManyAddAssociationMixin<servicii, serviciiId>;
  addUser_serviciis!: Sequelize.HasManyAddAssociationsMixin<servicii, serviciiId>;
  createUser_servicii!: Sequelize.HasManyCreateAssociationMixin<servicii>;
  removeUser_servicii!: Sequelize.HasManyRemoveAssociationMixin<servicii, serviciiId>;
  removeUser_serviciis!: Sequelize.HasManyRemoveAssociationsMixin<servicii, serviciiId>;
  hasUser_servicii!: Sequelize.HasManyHasAssociationMixin<servicii, serviciiId>;
  hasUser_serviciis!: Sequelize.HasManyHasAssociationsMixin<servicii, serviciiId>;
  countUser_serviciis!: Sequelize.HasManyCountAssociationsMixin;
  // specializari belongsToMany specializari via specializare_id and user_id
  user_id_specializaris!: specializari[];
  getUser_id_specializaris!: Sequelize.BelongsToManyGetAssociationsMixin<specializari>;
  setUser_id_specializaris!: Sequelize.BelongsToManySetAssociationsMixin<specializari, specializariId>;
  addUser_id_specializari!: Sequelize.BelongsToManyAddAssociationMixin<specializari, specializariId>;
  addUser_id_specializaris!: Sequelize.BelongsToManyAddAssociationsMixin<specializari, specializariId>;
  createUser_id_specializari!: Sequelize.BelongsToManyCreateAssociationMixin<specializari>;
  removeUser_id_specializari!: Sequelize.BelongsToManyRemoveAssociationMixin<specializari, specializariId>;
  removeUser_id_specializaris!: Sequelize.BelongsToManyRemoveAssociationsMixin<specializari, specializariId>;
  hasUser_id_specializari!: Sequelize.BelongsToManyHasAssociationMixin<specializari, specializariId>;
  hasUser_id_specializaris!: Sequelize.BelongsToManyHasAssociationsMixin<specializari, specializariId>;
  countUser_id_specializaris!: Sequelize.BelongsToManyCountAssociationsMixin;
  // specializari belongsToMany specializari via user_id and specializare_id
  specializare_id_specializaris!: specializari[];
  getSpecializare_id_specializaris!: Sequelize.BelongsToManyGetAssociationsMixin<specializari>;
  setSpecializare_id_specializaris!: Sequelize.BelongsToManySetAssociationsMixin<specializari, specializariId>;
  addSpecializare_id_specializari!: Sequelize.BelongsToManyAddAssociationMixin<specializari, specializariId>;
  addSpecializare_id_specializaris!: Sequelize.BelongsToManyAddAssociationsMixin<specializari, specializariId>;
  createSpecializare_id_specializari!: Sequelize.BelongsToManyCreateAssociationMixin<specializari>;
  removeSpecializare_id_specializari!: Sequelize.BelongsToManyRemoveAssociationMixin<specializari, specializariId>;
  removeSpecializare_id_specializaris!: Sequelize.BelongsToManyRemoveAssociationsMixin<specializari, specializariId>;
  hasSpecializare_id_specializari!: Sequelize.BelongsToManyHasAssociationMixin<specializari, specializariId>;
  hasSpecializare_id_specializaris!: Sequelize.BelongsToManyHasAssociationsMixin<specializari, specializariId>;
  countSpecializare_id_specializaris!: Sequelize.BelongsToManyCountAssociationsMixin;
  // specializari belongsTo users via user_id
  user!: users;
  getUser!: Sequelize.BelongsToGetAssociationMixin<users>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<users, usersId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof specializari {
    return specializari.init({
      specializare_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      denumire_specializare: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      poza_diploma: {
        type: DataTypes.BLOB('medium'),
        allowNull: true
      },
      nr_atestat: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: "nr_atestat_UNIQUE"
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
      verificat: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
      }
    }, {
      sequelize,
      tableName: 'specializari',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "specializare_id" },
            { name: "user_id" },
          ]
        },
        {
          name: "nr_atestat_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "nr_atestat" },
          ]
        },
        {
          name: "fk_Specializari_Users1_idx",
          using: "BTREE",
          fields: [
            { name: "user_id" },
          ]
        },
      ]
    });
  }
}
