import Sequelize, {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import UserPost from "./user_post";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare text: string;
  declare likes: CreationOptional<number>;
  declare reads: CreationOptional<number>;
  declare popularity: CreationOptional<number>;
  declare tags: CreationOptional<string>;

  public static async getPostsByUserId(userId: number) {
    return Post.findAll({
      include: [
        {
          model: UserPost,
          attributes: [],
          where: {
            userId: userId,
          },
        },
      ],
    });
  }

  public static initWithDatabase(sequelize: Sequelize.Sequelize) {
    this.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        text: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        likes: {
          type: Sequelize.NUMBER,
          allowNull: false,
          defaultValue: 0,
        },
        reads: {
          type: Sequelize.NUMBER,
          allowNull: false,
          defaultValue: 0,
        },
        popularity: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0.0,
          validate: {
            min: 0.0,
            max: 1.0,
          },
        },
        tags: {
          // note: comma separated string since sqlite does not support arrays
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "post",
        sequelize,
        timestamps: false,
        underscored: true,
        freezeTableName: true,
      }
    );
  }
}

export default Post;
