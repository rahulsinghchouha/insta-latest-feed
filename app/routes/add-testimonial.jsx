import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";


export const action = async ({ request }) => {
	const formData = await request.formData();
  const score = parseInt(formData.get("score")) || 0;
  const scoreMsg = formData.get("scoreMsg");
  const email = formData.get("email");
  const content = formData.get("content");

  const {session} = await authenticate.admin(request);
  const shop = session.shop;

	const feedback = {
		score, 
		scoreMsg,
		email,
		content
	}
	
	await prisma.AppTestimonial.upsert({
		where: { storeName: shop },
		update: {
			feedback,
		},
		create: {
			storeName: shop,
			feedback,
		},
	});
	if (!session.accessToken) {
    return json({ success: false, error: `Missing access token for shop - ${session.scope}`, editing });
  } else if (!session.shop) {
		return json({ success: false, error: 'Missing shop', editing });
	}

  try {
    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ success: false, error: error.message, editing });
  }
};

export const loader = () => {
  return json({ success: false, message: "GET method not supported" });
};
