import { DATABASE_FILE } from "../../../env";
import Post from "./post";
import Sequelize from "sequelize";
import User from "./user";
import UserPost from "./user_post";

function initModels(sequelize: Sequelize.Sequelize): void {
  User.initWithDatabase(sequelize);
  Post.initWithDatabase(sequelize);
  UserPost.initWithDatabase(sequelize);
}

function initAssociations(): void {
  User.belongsToMany(Post, {
    through: UserPost,
  });
  Post.belongsToMany(User, {
    through: UserPost,
  });
  User.hasMany(UserPost, {
    sourceKey: "id",
    foreignKey: "userId",
  });
  UserPost.belongsTo(User, {
    foreignKey: "userId",
  });
  Post.hasMany(UserPost, {
    sourceKey: "id",
    foreignKey: "postId",
  });
  UserPost.belongsTo(Post, {
    foreignKey: "postId",
  });
}

export function initDatabase(type: "test" | "production"): Sequelize.Sequelize {
  const db =
    type === "production"
      ? new Sequelize.Sequelize("database", "", "", {
          dialect: "sqlite",
          storage: DATABASE_FILE,
          logging: false,
        })
      : new Sequelize.Sequelize("sqlite::memory:", { logging: false });

  initModels(db);
  initAssociations();

  return db;
}
