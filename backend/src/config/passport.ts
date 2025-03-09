import { config } from 'dotenv';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifyCallback,
} from 'passport-jwt';
import passport from 'passport';

import { User } from '@models/user.js';

config();

interface JwtPayload {
  id: number;
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || '',
};

const verifyCallback: VerifyCallback = async (jwtPayload: JwtPayload, done) => {
  try {
    const user = await User.findByPk(jwtPayload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

passport.use(new JwtStrategy(opts, verifyCallback));

export { passport };
