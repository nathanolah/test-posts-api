import { NextFunction, Request, Response } from "express";

import PostModel from "../db/models/post";
import UserPostModel from "../db/models/user_post";
import express from "express";

import { validateQuery } from "../utils/validateQuery";
import { sortPosts } from "../utils/sortPosts";
import { removeDuplicates } from "../utils/removeDuplicates";
import jwt from "jsonwebtoken";
import { SESSION_SECRET } from "../../env";

const router = express.Router();

type AuthToken = { id: number };

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    //validate query
    const errorMessage = validateQuery(req.query);

    if (Object.keys(errorMessage).length !== 0) {
      return res.status(400).json(errorMessage);
    } else {
      // split ids if in comma seperated list
      const query = req.query.authorIds as any;
      const regex = /[^,\s][^\,]*[^,\s]*/g;
      const ids = query.match(regex);

      // get posts
      let result: any = [];
      for (let i = 0; i < ids.length; i++) {
        result = result.concat(await PostModel.getPostsByUserId(ids[i]));
      }

      // use regex to split the tag and authorId's string into an array of strings
      for (let i = 0; i < result.length; i++) {
        result[i].tags = result[i].tags.match(regex);
      }

      // sort posts
      if (req.query.sortBy !== undefined) {
        if (req.query.direction !== undefined) {
          sortPosts(result, req.query.sortBy, req.query.direction);
        } else {
          sortPosts(result, req.query.sortBy, "asc");
        }
      } else if (req.query.direction !== undefined) {
        sortPosts(result, "id", req.query.direction);
      } else {
        sortPosts(result, "id", "asc");
      }

      // remove duplicates
      removeDuplicates(result);

      const payload = {
        posts: result,
      };

      return res.json(payload);
    }
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const regex = /[^,\s][^\,]*[^,\s]*/g;
      const { tags, text } = req.body;

      // authenticate the access token to verify the author
      const token = req.headers["x-access-token"];

      if (token && typeof token === "string") {
        // authenticate author
        jwt.verify(token, SESSION_SECRET, async (err, decoded) => {
          if (err) {
            res.status(401).json(err);
          }
          const decodedToken = decoded as AuthToken;
          if (typeof decoded !== "object") {
            res.status(401).json({ error: "token invalid" });
          }

          // find userPost
          const userPost = await UserPostModel.findOne({
            where: { postId: req.params.id, userId: decodedToken?.id },
          });

          if (userPost === null) {
            res.status(404).json({ error: "UserPost not found" });
          } else {
            let authorIds: any = [];

            // Find all the current authors of the post at postId
            const currentAuthIds = await UserPostModel.findAll({
              where: { postId: req.params.id },
            });

            // Update authorIds property
            if (req.body.authorIds !== undefined) {
              // Update the UserPost with the new authorIds that are equal to the postId
              authorIds = req.body.authorIds;

              // delete all the authors of the current post at postId
              for (let i = 0; i < currentAuthIds.length; i++) {
                // delete all the authIds
                await UserPostModel.destroy({
                  where: {
                    postId: req.params.id,
                    userId: currentAuthIds[i].userId,
                  },
                });
              }

              // create the new authorIds for the post at postId
              for (let i = 0; i < authorIds.length; i++) {
                await UserPostModel.create({
                  postId: req.params.id as any,
                  userId: authorIds[i],
                });
              }
            } else {
              for (let i = 0; i < currentAuthIds.length; i++) {
                authorIds.push(currentAuthIds[i].userId);
              }
            }

            // update the post
            await PostModel.update(
              {
                tags: tags?.join(","),
                text: text,
              },
              {
                where: { id: userPost?.postId },
              }
            );

            // return updated post
            let post: any;
            post = await PostModel.findOne({
              where: { id: userPost?.postId },
            });

            if (post === null) {
              res.status(404).json({ error: "Post not found" });
            } else {
              const result = {
                id: post.id,
                text: post.text,
                likes: post.likes,
                reads: post.reads,
                popularity: post.popularity,
                tags: post?.tags.match(regex),
                authorIds: authorIds,
              };

              const payload = {
                post: result,
              };

              res.json(payload);
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Create a new blog post
 * req.body is expected to contain {text: required(string), tags: optional(Array<string>)}
 */
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { text, tags } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ error: "Must provide text for the new post" });
    }
    // Create new post
    const post = await PostModel.create({
      text,
      tags: tags?.join(","),
    });
    if (req.user?.id) {
      await UserPostModel.create({
        userId: req.user.id,
        postId: post.id,
      });
    }
    res.json({ post });
  } catch (error) {
    next(error);
  }
});

export default router;
