import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const accountApiResquest = {
  // Gọi ở server
  me: (sessionToken: string) =>
    http.get<AccountResType>("/account/me", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),

  // Gọi ở client
  meClient: () => http.get<AccountResType>("/account/me"),
};

export default accountApiResquest;
