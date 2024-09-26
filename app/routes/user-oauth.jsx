import { json } from "@remix-run/node";
import { authenticate, sessionStorage } from "../shopify.server";
import axios from "axios";
import prisma from "../db.server";
import { redirect } from "@remix-run/node";
// import prisma from "../db.server";


export const action = async ({ request }) => {
	const url = new URL(request.url);
  const queryParams = url.searchParams;
	
  const {session, redirect} = await authenticate.admin(request);
  const shop = session.shop;

  try {

  } catch (error) {
    console.error(error);
    return json({ success: false, error: error.message });
  }
};

export const loader = async ({request}) => {
	// const {session, redirect} = await authenticate.admin(request);
  // const shop = session.shop;
  // console.log("Loader for User OAuth running", shop);
	const url = new URL(request.url);
  const queryParams = url.searchParams;
	const code = queryParams.get("code");
  const sessionId = decodeURIComponent(queryParams.get("state"));
  if(!sessionId) return redirect("/auth");

  const existingSession = await sessionStorage.loadSession(sessionId);
  console.log("Existing Session", existingSession);
  const cookieHeader = await sessionStorage.storeSession(existingSession);
	// exchange code for access token
	const response = await axios.post("https://api.instagram.com/oauth/access_token", new URLSearchParams({
		client_id: process.env.INSTA_CLIENT_ID,
		client_secret: process.env.INSTA_CLIENT_SECRET,
		grant_type: 'authorization_code',
		redirect_uri: 'https://instacarousel24.onrender.com/user-oauth',
		code: code,
	}).toString(), {
		headers:{
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

	return redirect(`/app?shop=${encodeURIComponent(existingSession.shop)}`);
};
  
