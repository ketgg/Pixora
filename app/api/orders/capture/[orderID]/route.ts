export const POST = async (
  request: Request,
  { params }: { params: Promise<{ orderID: string }> },
) => {
  const orderId = (await params).orderID
  return new Response("Hello", { status: 200 })
}
