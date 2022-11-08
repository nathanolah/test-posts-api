import Sequelize, {
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import Post from "./post";
import User from "./user";

class UserPost extends Model<
  InferAttributes<UserPost>,
  InferCreationAttributes<UserPost>
> {
  declare userId: ForeignKey<User["id"]>;
  declare postId: ForeignKey<Post["id"]>;

  public static initWithDatabase(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: User,
            key: "id",
          },
          field: "user_id",
        },
        postId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: Post,
            key: "id",
          },
          field: "post_id",
        },
      },
      {
        tableName: "user_post",
        sequelize,
        timestamps: false,
        underscored: true,
        freezeTableName: true,
      }
    );
  }
}

export default UserPost;
