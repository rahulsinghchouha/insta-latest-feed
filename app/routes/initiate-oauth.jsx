import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {

  const {session, redirect} = await authenticate.admin(request);
  const shop = session.shop;

	if (!session.accessToken) {
    return json({ success: false, error: `Missing access token for shop - ${session.scope}`, editing });
  } else if (!session.shop) {
		return json({ success: false, error: 'Missing shop', editing });
	}

  try {
    console.log("\n Redirecting user to Instagram OAuth \n");
    return redirect("https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=488937830712253&=https://admin.shopify.com/store/citsapptesting/apps/cits-instafeed-1/user-oauth&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish");
  } catch (error) {
    console.error(error);
    return json({ success: false, error: error.message, editing });
  }
};

export const loader = async ({ request }) => {
  const {session, redirect} = await authenticate.admin(request);
  const shop = session.shop;

	if (!session.accessToken) {
    return json({ success: false, error: `Missing access token for shop - ${session.scope}`, editing });
  } else if (!session.shop) {
		return json({ success: false, error: 'Missing shop', editing });
	}

  try {
    console.log("\n GET REQ -> Redirecting user to Instagram OAuth \n");
    return redirect("https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=488937830712253&=https://admin.shopify.com/store/citsapptesting/apps/cits-instafeed-1/user-oauth&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish");
  } catch (error) {
    console.error(error);
    return json({ success: false, error: error.message, editing });
  }
};
