import type { Sequelize } from "sequelize";
import { cabinete as _cabinete } from "./cabinete";
import type { cabineteAttributes, cabineteCreationAttributes } from "./cabinete";
import { program_psihologi as _program_psihologi } from "./program_psihologi";
import type { program_psihologiAttributes, program_psihologiCreationAttributes } from "./program_psihologi";
import { programari as _programari } from "./programari";
import type { programariAttributes, programariCreationAttributes } from "./programari";
import { programari_servicii as _programari_servicii } from "./programari_servicii";
import type { programari_serviciiAttributes, programari_serviciiCreationAttributes } from "./programari_servicii";
import { ratings as _ratings } from "./ratings";
import type { ratingsAttributes, ratingsCreationAttributes } from "./ratings";
import { reviews as _reviews } from "./reviews";
import type { reviewsAttributes, reviewsCreationAttributes } from "./reviews";
import { servicii as _servicii } from "./servicii";
import type { serviciiAttributes, serviciiCreationAttributes } from "./servicii";
import { specializari as _specializari } from "./specializari";
import type { specializariAttributes, specializariCreationAttributes } from "./specializari";
import { subscriptions as _subscriptions } from "./subscriptions";
import type { subscriptionsAttributes, subscriptionsCreationAttributes } from "./subscriptions";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";

export {
  _cabinete as cabinete,
  _program_psihologi as program_psihologi,
  _programari as programari,
  _programari_servicii as programari_servicii,
  _ratings as ratings,
  _reviews as reviews,
  _servicii as servicii,
  _specializari as specializari,
  _subscriptions as subscriptions,
  _users as users,
};

export type {
  cabineteAttributes,
  cabineteCreationAttributes,
  program_psihologiAttributes,
  program_psihologiCreationAttributes,
  programariAttributes,
  programariCreationAttributes,
  programari_serviciiAttributes,
  programari_serviciiCreationAttributes,
  ratingsAttributes,
  ratingsCreationAttributes,
  reviewsAttributes,
  reviewsCreationAttributes,
  serviciiAttributes,
  serviciiCreationAttributes,
  specializariAttributes,
  specializariCreationAttributes,
  subscriptionsAttributes,
  subscriptionsCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const cabinete = _cabinete.initModel(sequelize);
  const program_psihologi = _program_psihologi.initModel(sequelize);
  const programari = _programari.initModel(sequelize);
  const programari_servicii = _programari_servicii.initModel(sequelize);
  const ratings = _ratings.initModel(sequelize);
  const reviews = _reviews.initModel(sequelize);
  const servicii = _servicii.initModel(sequelize);
  const specializari = _specializari.initModel(sequelize);
  const subscriptions = _subscriptions.initModel(sequelize);
  const users = _users.initModel(sequelize);

  programari.belongsToMany(servicii, { as: 'seriviciu_id_serviciis', through: programari_servicii, foreignKey: "programare_id", otherKey: "seriviciu_id" });
  reviews.belongsToMany(users, { as: 'user_id_users', through: ratings, foreignKey: "review_id", otherKey: "user_id" });
  servicii.belongsToMany(programari, { as: 'programare_id_programaris', through: programari_servicii, foreignKey: "seriviciu_id", otherKey: "programare_id" });
  // specializari.belongsToMany(specializari, { as: 'user_id_specializaris', through: servicii, foreignKey: "specializare_id", otherKey: "user_id" });
  // specializari.belongsToMany(specializari, { as: 'specializare_id_specializaris', through: servicii, foreignKey: "user_id", otherKey: "specializare_id" });
  users.belongsToMany(reviews, { as: 'review_id_reviews', through: ratings, foreignKey: "user_id", otherKey: "review_id" });
  ratings.belongsTo(reviews, { as: "review", foreignKey: "review_id" });
  reviews.hasMany(ratings, { as: "ratings", foreignKey: "review_id" });


  programari_servicii.belongsTo(programari, { as: "programare", foreignKey: "programare_id" });
  programari_servicii.belongsTo(servicii, { as: "seriviciu", foreignKey: "seriviciu_id" });
  programari.hasMany(programari_servicii, { as: "programari_serviciis", foreignKey: "programare_id" });
  servicii.hasMany(programari_servicii, { as: "programari_serviciis", foreignKey: "seriviciu_id" });


  servicii.belongsTo(specializari, { as: "specializare", foreignKey: "specializare_id" });
  specializari.hasMany(servicii, { as: "serviciis", foreignKey: "specializare_id" });
  servicii.belongsTo(specializari, { as: "user", foreignKey: "user_id" });
  specializari.hasMany(servicii, { as: "user_serviciis", foreignKey: "user_id" });

  users.hasMany(cabinete, { as: "cabinetes", foreignKey: "user_id" });


  ratings.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(ratings, { as: "ratings", foreignKey: "user_id" });


  subscriptions.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(subscriptions, { as: "subscriptions", foreignKey: "user_id" });
  // Relations for user and everything related to it

  cabinete.belongsTo(users, { as: "users_user", foreignKey: "user_id" });
  program_psihologi.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(program_psihologi, { as: "program_psihologis", foreignKey: "user_id" });
  programari.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(programari, { as: "programaris", foreignKey: "user_id" });
  specializari.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(specializari, { as: "specializaris", foreignKey: "user_id" });





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
