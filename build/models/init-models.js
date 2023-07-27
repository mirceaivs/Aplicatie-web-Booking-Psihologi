"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initModels = exports.users = exports.subscriptions = exports.specializari = exports.servicii = exports.reviews = exports.ratings = exports.programari_servicii = exports.programari = exports.program_psihologi = exports.cabinete = void 0;
const cabinete_1 = require("./cabinete");
Object.defineProperty(exports, "cabinete", { enumerable: true, get: function () { return cabinete_1.cabinete; } });
const program_psihologi_1 = require("./program_psihologi");
Object.defineProperty(exports, "program_psihologi", { enumerable: true, get: function () { return program_psihologi_1.program_psihologi; } });
const programari_1 = require("./programari");
Object.defineProperty(exports, "programari", { enumerable: true, get: function () { return programari_1.programari; } });
const programari_servicii_1 = require("./programari_servicii");
Object.defineProperty(exports, "programari_servicii", { enumerable: true, get: function () { return programari_servicii_1.programari_servicii; } });
const ratings_1 = require("./ratings");
Object.defineProperty(exports, "ratings", { enumerable: true, get: function () { return ratings_1.ratings; } });
const reviews_1 = require("./reviews");
Object.defineProperty(exports, "reviews", { enumerable: true, get: function () { return reviews_1.reviews; } });
const servicii_1 = require("./servicii");
Object.defineProperty(exports, "servicii", { enumerable: true, get: function () { return servicii_1.servicii; } });
const specializari_1 = require("./specializari");
Object.defineProperty(exports, "specializari", { enumerable: true, get: function () { return specializari_1.specializari; } });
const subscriptions_1 = require("./subscriptions");
Object.defineProperty(exports, "subscriptions", { enumerable: true, get: function () { return subscriptions_1.subscriptions; } });
const users_1 = require("./users");
Object.defineProperty(exports, "users", { enumerable: true, get: function () { return users_1.users; } });
function initModels(sequelize) {
    const cabinete = cabinete_1.cabinete.initModel(sequelize);
    const program_psihologi = program_psihologi_1.program_psihologi.initModel(sequelize);
    const programari = programari_1.programari.initModel(sequelize);
    const programari_servicii = programari_servicii_1.programari_servicii.initModel(sequelize);
    const ratings = ratings_1.ratings.initModel(sequelize);
    const reviews = reviews_1.reviews.initModel(sequelize);
    const servicii = servicii_1.servicii.initModel(sequelize);
    const specializari = specializari_1.specializari.initModel(sequelize);
    const subscriptions = subscriptions_1.subscriptions.initModel(sequelize);
    const users = users_1.users.initModel(sequelize);
    programari.belongsToMany(servicii, { as: 'seriviciu_id_serviciis', through: programari_servicii, foreignKey: "programare_id", otherKey: "seriviciu_id" });
    reviews.belongsToMany(users, { as: 'user_id_users', through: ratings, foreignKey: "review_id", otherKey: "user_id" });
    servicii.belongsToMany(programari, { as: 'programare_id_programaris', through: programari_servicii, foreignKey: "seriviciu_id", otherKey: "programare_id" });
    // specializari.belongsToMany(specializari, { as: 'user_id_specializaris', through: servicii, foreignKey: "specializare_id", otherKey: "user_id" });
    // specializari.belongsToMany(specializari, { as: 'specializare_id_specializaris', through: servicii, foreignKey: "user_id", otherKey: "specializare_id" });
    users.belongsToMany(reviews, { as: 'review_id_reviews', through: ratings, foreignKey: "user_id", otherKey: "review_id" });
    programari_servicii.belongsTo(programari, { as: "programare", foreignKey: "programare_id" });
    programari.hasMany(programari_servicii, { as: "programari_serviciis", foreignKey: "programare_id" });
    ratings.belongsTo(reviews, { as: "review", foreignKey: "review_id" });
    reviews.hasMany(ratings, { as: "ratings", foreignKey: "review_id" });
    programari_servicii.belongsTo(servicii, { as: "seriviciu", foreignKey: "seriviciu_id" });
    servicii.hasMany(programari_servicii, { as: "programari_serviciis", foreignKey: "seriviciu_id" });
    servicii.belongsTo(specializari, { as: "specializare", foreignKey: "specializare_id" });
    specializari.hasMany(servicii, { as: "serviciis", foreignKey: "specializare_id" });
    servicii.belongsTo(specializari, { as: "user", foreignKey: "user_id" });
    specializari.hasMany(servicii, { as: "user_serviciis", foreignKey: "user_id" });
    cabinete.belongsTo(users, { as: "users_user", foreignKey: "user_id" });
    users.hasMany(cabinete, { as: "cabinetes", foreignKey: "user_id" });
    program_psihologi.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(program_psihologi, { as: "program_psihologis", foreignKey: "user_id" });
    programari.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(programari, { as: "programaris", foreignKey: "user_id" });
    ratings.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(ratings, { as: "ratings", foreignKey: "user_id" });
    specializari.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(specializari, { as: "specializaris", foreignKey: "user_id" });
    subscriptions.belongsTo(users, { as: "user", foreignKey: "user_id" });
    users.hasMany(subscriptions, { as: "subscriptions", foreignKey: "user_id" });
    // Relations for user and everything related to it
    return {
        cabinete: cabinete,
        program_psihologi: program_psihologi,
        programari: programari,
        programari_servicii: programari_servicii,
        ratings: ratings,
        reviews: reviews,
        servicii: servicii,
        specializari: specializari,
        subscriptions: subscriptions,
        users: users,
    };
}
exports.initModels = initModels;
//# sourceMappingURL=init-models.js.map