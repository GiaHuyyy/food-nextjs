export async function POST(request: Request) {
  const res = await request.json();
  const sesstionToken = res.payload?.data?.token;
  if (!sesstionToken) {
    return Response.json({ message: "Không nhận được sesstionToken" }, { status: 400 });
  }
  return Response.json(
    res.payload,
    {
      status: 200,
      headers: { "Set-Cookie": `sesstionToken=${sesstionToken}; Path=/; HttpOnly` },
    }
  );
}
