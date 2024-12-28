import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const accountApiResquest = {
  me: (sesstionToken: string) =>
    http.get<AccountResType>("/account/me", {
      headers: {
        Authorization: `Bearer ${sesstionToken}`,
      },
    }),
};

export default accountApiResquest;
