import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";


export const action = async ({ request }) => {
	const formData = await request.formData();
  const title = formData.get("title");
	const layoutType = formData.get("layoutType");
	const gridLayout = formData.get("gridLayout");

  const {session} = await authenticate.admin(request);
  const shop = session.shop;

	if (!session.accessToken) {
    return json({ success: false, error: `Missing access token for shop - ${session.scope}`, editing });
  } else if (!session.shop) {
		return json({ success: false, error: 'Missing shop', editing });
	}
	
	if(title){
		await prisma.instagramAccount.update({
			where:{
				shop: shop,
			},
			data:{
				feedTitle: title
			}
		});
	} else if(layoutType){
		await prisma.instagramAccount.update({
			where:{
				shop: shop,
			},
			data:{
				layoutType: layoutType
			}
		});
	} else if(gridLayout) {
		const rows = parseInt(gridLayout.split("__")[1])
		const columns = parseInt(gridLayout.split("__")[0])
		await prisma.instagramAccount.update({
			where:{
				shop: shop,
			},
			data:{
				rows,
				columns
			}
		});
	}
	

  try {
    return json({ success: true, updateType:title ? "title" : layoutType ? "layoutType" : gridLayout ? "gridLayout" : "" });
  } catch (error) {
    console.error(error);
    return json({ success: false, error: error.message, editing });
  }
};

export const loader = () => {
  return json({ success: false, message: "GET method not supported" });
};
