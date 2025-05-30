import { NextRequest, NextResponse } from "next/server";

const POST = async (req: NextRequest) => {
  const body = await req.json();

  return NextResponse.json({
    body,
  });
};

export { POST };
