import { NODE_ENV } from "../../env";
import PostModel from "./models/post";
import UserModel from "./models/user";
import UserPostModel from "./models/user_post";
import db from "./db";

const SEED_PW = "123456";

type LogType = "log" | "error";
function log(message: string, type: LogType = "log") {
  // Suppress logging in test code.
  if (NODE_ENV === "test") return;

  switch (type) {
    case "error":
      return console.error(message);
    default:
      return console.log(message);
  }
}

async function seed() {
  await db.sync({ force: true });
  log("db synced!");

  const thomas = await UserModel.create({
    username: "thomas",
    password: SEED_PW,
  });

  const santiago = await UserModel.create({
    username: "santiago",
    password: SEED_PW,
  });

  const ashanti = await UserModel.create({
    username: "ashanti",
    password: SEED_PW,
  });

  // post 1: multi-author
  const post1 = await PostModel.create({
    text: "Excepteur occaecat minim reprehenderit cupidatat dolore voluptate velit labore pariatur culpa esse mollit. Veniam ipsum amet eu dolor reprehenderit quis tempor pariatur labore. Tempor excepteur velit dolor commodo aute. Proident aute cillum dolor sint laborum tempor cillum voluptate minim. Amet qui eiusmod duis est labore cupidatat excepteur occaecat nulla.",
    likes: 12,
    reads: 5,
    tags: "food,recipes,baking",
    popularity: 0.19,
  });

  await UserPostModel.create({
    userId: santiago.id,
    postId: post1.id,
  });
  await UserPostModel.create({
    userId: thomas.id,
    postId: post1.id,
  });

  // post 2: single-author
  const post2 = await PostModel.create({
    text: "Ea cillum incididunt consequat ullamco nisi aute labore cupidatat exercitation et sunt nostrud. Occaecat elit tempor ex anim non nulla sit culpa ipsum aliquip. In amet in Lorem ut enim. Consectetur ea officia reprehenderit pariatur magna eiusmod voluptate. Nostrud labore id adipisicing culpa sunt veniam qui deserunt magna sint mollit. Cillum irure pariatur occaecat amet reprehenderit nisi qui proident aliqua.",
    likes: 104,
    reads: 200,
    tags: "travel,hotels",
    popularity: 0.7,
  });

  await UserPostModel.create({
    userId: santiago.id,
    postId: post2.id,
  });

  // post 3: multi-author
  const post3 = await PostModel.create({
    text: "Voluptate consequat minim commodo nisi minim ut. Exercitation incididunt eiusmod qui duis enim sunt dolor sit nisi laboris qui enim mollit. Proident pariatur elit est elit consectetur. Velit anim eu culpa adipisicing esse consequat magna. Id do aliquip pariatur laboris consequat cupidatat voluptate incididunt sint ea.",
    likes: 10,
    reads: 32,
    tags: "travel,airbnb,vacation",
    popularity: 0.7,
  });

  await UserPostModel.create({
    userId: santiago.id,
    postId: post3.id,
  });

  await UserPostModel.create({
    userId: ashanti.id,
    postId: post3.id,
  });

  // post 4: single-author
  const post4 = await PostModel.create({
    text: "This is post 4",
    likes: 50,
    reads: 300,
    tags: "vacation,spa",
    popularity: 0.4,
  });

  await UserPostModel.create({
    userId: ashanti.id,
    postId: post4.id,
  });

  // other users with no posts
  await Promise.all([
    UserModel.create({
      username: "julia",
      password: SEED_PW,
    }),
    UserModel.create({
      username: "cheng",
      password: SEED_PW,
    }),
  ]);

  log("seeded users and posts");
}

async function runSeed() {
  log("seeding...");
  try {
    await seed();
  } catch (err) {
    if (err instanceof Error) log(String(err), "error");
    process.exitCode = 1;
  } finally {
    log("closing db connection");
    await db.close();
    log("db connection closed");
  }
}

if (module === require.main) {
  runSeed();
}

export default seed;
