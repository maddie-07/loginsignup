// src/types/customTypes.ts

import { ISODateString } from "next-auth";

export type CustomSession = {
  user?: CustomUser;
  expires: ISODateString;
};

export type CustomUser = {
  id?: string | null;
  email?: string | null;
  role?: string | null;
};
