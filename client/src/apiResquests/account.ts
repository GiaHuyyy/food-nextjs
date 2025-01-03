import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const accountApiResquest = {
  // Gọi ở server
  me: (sesstionToken: string) =>
    http.get<AccountResType>("/account/me", {
      headers: {
        Authorization: `Bearer ${sesstionToken}`,
      },
    }),

  // Gọi ở client
  meClient: () => http.get<AccountResType>("/account/me"),
};

export default accountApiResquest;
