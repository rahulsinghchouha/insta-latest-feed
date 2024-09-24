import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";


export const action = async ({ request }) => {

  const {session} = await authenticate.admin(request);
  const shop = session.shop;

	if (!session.accessToken) {
    return json({ success: false, error: `Missing access token for shop - ${session.scope}`, editing });
  } else if (!session.shop) {
		return json({ success: false, error: 'Missing shop', editing });
	}
	
	
		await prisma.instagramAccount.delete({
			where:{
				shop: shop,
			}
		});

  try {
    return json({ success: true});
  } catch (error) {
    console.error(error);
    return json({ success: false, error: error.message, editing });
  }
};

export const loader = () => {
  return json({ success: false, message: "GET method not supported" });
};
