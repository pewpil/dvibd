import { compare, genSalt, hash } from "@da/bcrypt";
import { Hono } from "@hono/hono";
import { z } from "@zod/zod";
import HttpError from "../lib/error.ts";
import db from "../orm/db.ts";
import { Prisma, User } from "../orm/generated/client.mts";
import registerErrorHandler from "./error.ts";

const router: Hono = new Hono();

type PublicUser = Omit<User, "password" | "createdAt">;

const SALT_ROUNDS: number = Number(Deno.env.get("SALT_ROUNDS")) || 4;

router.post("/signup", async function(c) {
  //TODO: throw an error if req.header("Content-Type") is not "application/json"

  //TODO: throw an error if a NewUser property is left null or undefined.
  type NewUser = Omit<User, "id" | "createdAt">;

  // TODO: throw an error if newUser.name contains non-alphanumeric and -underscore characters
  const newUser: NewUser = await c.req.json();

  const passwordHash: string = await hash(
    newUser.password,
    await genSalt(SALT_ROUNDS),
  );

  try {
    const user: PublicUser = await db.user.create({
      data: {
        name: newUser.name,
        email: newUser.email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return c.json(
      {
        message: `User, ${user.name}, successfully registered.`,
        user,
      },
      200,
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new HttpError(
          "Username or email already taken",
          HttpError.CONFLICT,
        );
      }

      if (e.code === "P2011") {
        throw new HttpError(
          "Some fo the required fields are missing. ",
          HttpError.CONFLICT,
        );
      }
    }

    if (e instanceof Error) {
      console.log(e);
    }
  }

  throw new HttpError("Unknown server error", HttpError.INTERNAL_SERVER_ERROR);
});

router.post("/login", async function(c) {
  //TODO: implement POST /login endpoint
  //TODO: throw an error if Content-Type request header is not application/json

  //TODO: throw an error if emailOrName or password is missing
  const { emailOrName, password }: { emailOrName: string; password: string } =
    await c.req.json();

  const isEmail: boolean = z.email().safeParse(emailOrName).success;

  type LoggingUser = Omit<User, "createdAt">;
  let user: LoggingUser | null;

  // TODO: make sure the query is sql injection safe
  if (isEmail) {
    user = await db.user.findUnique({
      where: {
        email: emailOrName,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
  } else {
    user = await db.user.findUnique({
      where: {
        name: emailOrName,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
  }

  if (user === null) {
    throw new HttpError("Wrong username or password", HttpError.UNAUTHORIZED);
  }

  if (!(await compare(password, user.password))) {
    throw new HttpError("Wrong username or password", HttpError.UNAUTHORIZED);
  }

  return c.json(
    {
      message: `User, ${user.name}, successfully logged in`,
      user: { id: user.id, name: user.name, email: user.email } as PublicUser,
    },
    200,
  );
});

registerErrorHandler(router);

export default router;
