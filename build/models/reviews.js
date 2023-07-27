"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviews = void 0;
const sequelize_1 = require("sequelize");
class reviews extends sequelize_1.Model {
    static initModel(sequelize) {
        return reviews.init({
            review_id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            rating: {
                type: sequelize_1.DataTypes.STRING(1),
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
exports.reviews = reviews;
//# sourceMappingURL=reviews.js.map