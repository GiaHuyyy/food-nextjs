import authApiRequest from "@/apiResquests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const sesstionToken = cookieStore.get("sesstionToken");
  if (!sesstionToken) {
    return Response.json({ message: "Không nhận được sesstionToken" }, { status: 401 });
  }
  try {
    const result = await authApiRequest.logoutFromNextServerToServer(sesstionToken.value);
    return Response.json(result.payload, {
      status: 200,
      headers: {
        // Xóa sesstionToken khỏi cookie
        "Set-Cookie": `sesstionToken=; Path=/; HttpOnly; Max-Age=0`,
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json({ message: "Lỗi không xác định" }, { status: 500 });
    }
  }
}
