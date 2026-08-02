import { Hono } from "@hono/hono";
import z from "@zod/zod";
import HttpError from "../lib/error.ts";
import db from "../orm/db.ts";
import { Prisma, User } from "../orm/generated/client.mts";

const router: Hono = new Hono();

type PublicUser = Omit<User, "password" | "createdAt">;

router.post("/signup", async function(c) {
  //TODO: throw an error if req.header("Content-Type") is not "application/json"

  //TODO: throw an error if a NewUser property is left null or undefined.
  type NewUser = Omit<User, "id" | "createdAt">;

  const newUser: NewUser = await c.req.json();

  try {
    const user: PublicUser = await db.user.create({
      data: {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
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

  return c.json(
    {
      error: "Unknown server error.",
    },
    500,
  );
});

router.post("/login", async function(c) {
  //TODO: implement POST /login endpoint
  //TODO: throw an error if Content-Type request header is not application/json

  //TODO: throw an error if emailOrName or password is missing
  const { emailOrName, password }: { emailOrName: string; password: string } =
    await c.req.json();

  const isEmail: boolean = z.email().safeParse(emailOrName).success;

  type LoggingUser = Omit<User, "id" | "createdAt">;
  let user: LoggingUser | null;

  if (isEmail) {
    user = await db.user.findUnique({
      where: {
        email: emailOrName,
      },
      select: {
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
        name: true,
        email: true,
        password: true,
      },
    });
  }

  if (user === null) {
    throw new HttpError("Wrong username or password", HttpError.UNAUTHORIZED);
  }

  // if (!(await compare(password, user.password))) {
  //   throw new HttpError("Wrong username or password", HttpError.UNAUTHORIZED);
  // }

  if (password !== user.password) {
    throw new HttpError("Wrong username or password", HttpError.UNAUTHORIZED);
  }

  return c.json(
    { message: `User, ${user.name}, successfully logged in`, user: user },
    200,
  );
});

export default router;
