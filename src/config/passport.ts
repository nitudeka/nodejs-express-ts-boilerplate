import { Request, Response, NextFunction } from "express";
import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcryptjs";
import _ from "lodash";

import { getDb } from "../util/db";

const LocalStrategy = passportLocal.Strategy;

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    const db = getDb();
    try {
      const user = await db.collection("users").findOne({ email: email.toLowerCase() });
      if (!user) return done(undefined, false, { message: `Email ${email} not found.` });
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) return done(undefined, false, { message: "Invalid email or password." });
      return done(undefined, user);
    } catch (err) {
      done(err);
    }
  })
);

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).json("User is not authorized");
};

/**
 * Authorization Required middleware.
 */
// export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
//   const provider = req.path.split("/").slice(-1)[0];

//   const user = req.user;
//   if (_.find(user.tokens, { kind: provider })) {
//     next();
//   } else {
//     res.redirect(`/auth/${provider}`);
//   }
// };
