"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specializari = void 0;
const sequelize_1 = require("sequelize");
class specializari extends sequelize_1.Model {
    static initModel(sequelize) {
        return specializari.init({
            specializare_id: {
                autoIncrement: true,
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            denumire_specializare: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            poza_diploma: {
                type: sequelize_1.DataTypes.BLOB('medium'),
                allowNull: true
            },
            nr_atestat: {
                type: sequelize_1.DataTypes.STRING(45),
                allowNull: false,
                unique: "nr_atestat_UNIQUE"
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'users',
                    key: 'user_id'
                }
            },
            verificat: {
                type: sequelize_1.DataTypes.TINYINT,
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
exports.specializari = specializari;
//# sourceMappingURL=specializari.js.map