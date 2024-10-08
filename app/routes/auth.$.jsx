import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request, params }) => {
	const $ = params["*"];
  console.log("PARAMS ===>>",$)
	if ($ === "instagram/callback") {
		console.log("Auth Instagram RUnning");
		const url = new URL(request.url);
		const queryParams = url.searchParams;
		const code = queryParams.get("code");
		const state = queryParams.get("state");
		const matchSessionQ = await prisma.session.findFirst({
			where: {
				sessionQ: state
			}
		});
		if(matchSessionQ){
			console.log("Session Query Param matched.");
			queryParams.set("hmac", matchSessionQ.hmac);
			queryParams.set("session", matchSessionQ.sessionQ);
			queryParams.set("id_token", matchSessionQ.id_token);
		}
		
		const response = await axios.post("https://api.instagram.com/oauth/access_token", new URLSearchParams({
			client_id: process.env.INSTA_CLIENT_ID,
			client_secret: process.env.INSTA_CLIENT_SECRET,
			grant_type: 'authorization_code',
			redirect_uri: 'https://admin.shopify.com/store/citsapptesting/apps/cits-instafeed-1/user-oauth',
			code: code,
		}).toString(), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		})

		const shortLivedAccessToken = response.data.access_token;
		const longLivedTokenResponse = await axios.get(
			`https://graph.instagram.com/access_token`,
			{
				params: {
					grant_type: "ig_exchange_token",
					client_secret: process.env.INSTA_CLIENT_SECRET,
					access_token: shortLivedAccessToken,
				},
			}
		);

		const longLivedAccessToken = longLivedTokenResponse.data.access_token;
		const userInfoResponse = await axios.get(
			`https://graph.instagram.com/me`,
			{
				params: {
					fields: "id,username",
					access_token: longLivedAccessToken,
				},
			}
		);

		const { id: instagramUserId, username } = userInfoResponse.data;
		await prisma.instagramAccount.upsert({
			where: {
				shop_instagramUserId: {
					shop: existingSession.shop,
					instagramUserId,
				},
			},
			update: {
				username,
				accessToken: longLivedAccessToken,
			},
			create: {
				shop: existingSession.shop,
				instagramUserId,
				username,
				accessToken: longLivedAccessToken,
			},
		});

		console.log("Now authenticating admin request");
		await authenticate.admin(request);
	}
	else {
		await authenticate.admin(request);
	}

	return null;
};
