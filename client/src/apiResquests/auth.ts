import http from "@/lib/http";
import { LoginBodyType, LoginResType, RegisterBodyType, RegisterResType } from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  resgister: (body: RegisterBodyType) => http.post<RegisterResType>("/auth/register", body),
  auth: (body: { sesstionToken: string }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  logoutFromNextClientToNextServer: () =>
    http.post<MessageResType>("/api/auth/logout", {}, {
      baseUrl: "",
    }),
  logoutFromNextServerToServer: (sesstionToken: string) =>
    http.post<MessageResType>("/auth/logout", {}, {
      headers: {
        Authorization: `Bearer ${sesstionToken}`,
      },
    }),
};

export default authApiRequest;
