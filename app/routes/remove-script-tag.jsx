import { json } from "@remix-run/node";
import { authenticate, shopifyApiInstance } from "../shopify.server";
import prisma from "../db.server";


export const action = async ({ request }) => {
  const {session, admin} = await authenticate.admin(request);
  const shop = session.shop;
  const accessToken = session.accessToken;
	if (!session.accessToken) {
    return json({ success: false, error: `Missing access token for shop - ${session.scope}` });
  } else if (!session.shop) {
		return json({ success: false, error: 'Missing shop' });
	}
	const client = new shopifyApiInstance.clients.Rest({
		session: { shop, accessToken } 
	})

  try {
		await prisma.youTubeAPI.delete({
			where: {storeName: shop}
		})
    return json({ success: true, insert:false, response:"Channel removed successfully" });
  } catch (error) {
    console.error(error);
    return json({ success: false, error: error.message });
  }
};

export const loader = () => {
  return json({ success: false, message: "GET method not supported" });
};
