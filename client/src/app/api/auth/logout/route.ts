import authApiRequest from "@/apiResquests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = await request.json();
  const force = res.force as boolean | undefined;
  if (force) {
    // Xóa sessionToken khỏi cookie khi token hết hạn
    return Response.json(
      { message: "Token hết hạn, Đã đăng xuất !" },
      {
        status: 200,
        // Xóa sessionToken khỏi cookie
        headers: {
          "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
        },
      }
    );
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");
  if (!sessionToken) {
    return Response.json({ message: "Không nhận được sessionToken" }, { status: 401 });
  }
  try {
    const result = await authApiRequest.logoutFromNextServerToServer(sessionToken.value);
    return Response.json(result.payload, {
      status: 200,
      headers: {
        // Xóa sessionToken khỏi cookie
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
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
