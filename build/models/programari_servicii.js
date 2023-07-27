"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programari_servicii = void 0;
const sequelize_1 = require("sequelize");
class programari_servicii extends sequelize_1.Model {
    static initModel(sequelize) {
        return programari_servicii.init({
            programare_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'programari',
                    key: 'programare_id'
                }
            },
            seriviciu_id: {
                type: sequelize_1.DataTypes.INTEGER,
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
exports.programari_servicii = programari_servicii;
//# sourceMappingURL=programari_servicii.js.map