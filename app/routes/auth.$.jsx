import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import axios from "axios";
import { redirect } from "@remix-run/node";

export const loader = async ({ request, params }) => {
	const $ = params["*"];
  console.log("PARAMS ===>>",$);
  
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
			queryParams.set("host", matchSessionQ.host);
			queryParams.set("locale", matchSessionQ.locale);
			queryParams.set("timestamp", matchSessionQ.timestamp);
			queryParams.set("shop", matchSessionQ.shop);
      console.log("query params have been set", queryParams);
		}

    if(queryParams.get("error") && queryParams.get("error") === "access_denied" ){
      return redirect(`/app?embedded=1&hmac=${matchSessionQ.hmac}&host=${matchSessionQ.host}&id_token=${matchSessionQ.id_token}&locale=${matchSessionQ.locale}&session=${matchSessionQ.sessionQ}&shop=${matchSessionQ.shop}&timestamp=${matchSessionQ.timestamp}&userdenied=true`)
    }
    
		const response = await axios.post("https://api.instagram.com/oauth/access_token", new URLSearchParams({
			client_id: process.env.INSTA_CLIENT_ID,
			client_secret: process.env.INSTA_CLIENT_SECRET,
			grant_type: 'authorization_code',
			redirect_uri: 'https://instacarousel24.onrender.com/auth/instagram/callback',
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

    console.log("Long Lived Access Token Acquired");

		const { id: instagramUserId, username } = userInfoResponse.data;
		await prisma.instagramAccount.upsert({
			where: {
				shop_instagramUserId: {
					shop: matchSessionQ.shop,
					instagramUserId,
				},
			},
			update: {
				username,
				accessToken: longLivedAccessToken,
			},
			create: {
				shop: matchSessionQ.shop,
				instagramUserId,
				username,
				accessToken: longLivedAccessToken,
			},
		});

		console.log("Now redirecting to app page ");
		// await authenticate.admin(request);
    return redirect(`/app?embedded=1&hmac=${matchSessionQ.hmac}&host=${matchSessionQ.host}&id_token=${matchSessionQ.id_token}&locale=${matchSessionQ.locale}&session=${matchSessionQ.sessionQ}&shop=${matchSessionQ.shop}&timestamp=${matchSessionQ.timestamp}`)
	}
	else {
		await authenticate.admin(request);
	}

	return null;
};
