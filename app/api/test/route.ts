import { NextRequest, NextResponse } from "next/server";

const POST = async (req: NextRequest) => {
  const body = await req.json();

  console.log({ body, bodyString: JSON.stringify(body) });

  return NextResponse.json({
    body,
  });
};

export { POST };
