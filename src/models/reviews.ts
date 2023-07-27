import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ratings, ratingsId } from './ratings';
import type { users, usersId } from './users';

export interface reviewsAttributes {
  review_id: number;
  rating?: string;
}

export type reviewsPk = "review_id";
export type reviewsId = reviews[reviewsPk];
export type reviewsOptionalAttributes = "review_id" | "rating";
export type reviewsCreationAttributes = Optional<reviewsAttributes, reviewsOptionalAttributes>;

export class reviews extends Model<reviewsAttributes, reviewsCreationAttributes> implements reviewsAttributes {
  review_id!: number;
  rating?: string;

  // reviews hasMany ratings via review_id
  ratings!: ratings[];
  getRatings!: Sequelize.HasManyGetAssociationsMixin<ratings>;
  setRatings!: Sequelize.HasManySetAssociationsMixin<ratings, ratingsId>;
  addRating!: Sequelize.HasManyAddAssociationMixin<ratings, ratingsId>;
  addRatings!: Sequelize.HasManyAddAssociationsMixin<ratings, ratingsId>;
  createRating!: Sequelize.HasManyCreateAssociationMixin<ratings>;
  removeRating!: Sequelize.HasManyRemoveAssociationMixin<ratings, ratingsId>;
  removeRatings!: Sequelize.HasManyRemoveAssociationsMixin<ratings, ratingsId>;
  hasRating!: Sequelize.HasManyHasAssociationMixin<ratings, ratingsId>;
  hasRatings!: Sequelize.HasManyHasAssociationsMixin<ratings, ratingsId>;
  countRatings!: Sequelize.HasManyCountAssociationsMixin;
  // reviews belongsToMany users via review_id and user_id
  user_id_users!: users[];
  getUser_id_users!: Sequelize.BelongsToManyGetAssociationsMixin<users>;
  setUser_id_users!: Sequelize.BelongsToManySetAssociationsMixin<users, usersId>;
  addUser_id_user!: Sequelize.BelongsToManyAddAssociationMixin<users, usersId>;
  addUser_id_users!: Sequelize.BelongsToManyAddAssociationsMixin<users, usersId>;
  createUser_id_user!: Sequelize.BelongsToManyCreateAssociationMixin<users>;
  removeUser_id_user!: Sequelize.BelongsToManyRemoveAssociationMixin<users, usersId>;
  removeUser_id_users!: Sequelize.BelongsToManyRemoveAssociationsMixin<users, usersId>;
  hasUser_id_user!: Sequelize.BelongsToManyHasAssociationMixin<users, usersId>;
  hasUser_id_users!: Sequelize.BelongsToManyHasAssociationsMixin<users, usersId>;
  countUser_id_users!: Sequelize.BelongsToManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof reviews {
    return reviews.init({
    review_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rating: {
      type: DataTypes.STRING(1),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'reviews',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "review_id" },
        ]
      },
    ]
  });
  }
}
