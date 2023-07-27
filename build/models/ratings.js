"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratings = void 0;
const sequelize_1 = require("sequelize");
class ratings extends sequelize_1.Model {
    static initModel(sequelize) {
        return ratings.init({
            review_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'reviews',
                    key: 'review_id'
                }
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'users',
                    key: 'user_id'
                }
            }
        }, {
            sequelize,
            tableName: 'ratings',
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "review_id" },
                        { name: "user_id" },
                    ]
                },
                {
                    name: "fk_Reviews_has_Users_Users1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "user_id" },
                    ]
                },
                {
                    name: "fk_Reviews_has_Users_Reviews1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "review_id" },
                    ]
                },
            ]
        });
    }
}
exports.ratings = ratings;
//# sourceMappingURL=ratings.js.map