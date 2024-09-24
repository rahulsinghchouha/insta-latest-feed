import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { isValidYouTubeApiKey } from "../utils/utilFunctions";
import { encrypt } from "../utils/encryption";


export const action = async ({ request }) => {
	const url = new URL(request.url);
  const queryParams = url.searchParams;
	const channelName = queryParams.get("channel");
	const editing  = queryParams.get("edit") === "true" || false;
	const playlistRemove = queryParams.get("playlistremove") === "true" || false;
	const playlistId = playlistRemove ? "" : queryParams.get("playlist") || "";
	const key = queryParams.get("key");
  const {session} = await authenticate.admin(request);
  const shop = session.shop;
	const valid = await isValidYouTubeApiKey(key);
	if(!valid.status){
		return json({ success: false, error: valid.msg , code: valid.code, editing});
	}
	const encryptedAPIKey = encrypt(key);
	await prisma.youTubeAPI.upsert({
		where: { storeName: shop },
		update: {
			apiKey: encryptedAPIKey,
			channelName,
			playlistId,
			lastFetchData: null,
			lastFetchTimeStamp: null,
		},
		create: {
			storeName: shop,
			apiKey: encryptedAPIKey,
			channelName,
			playlistId,
			lastFetchData: null,
			lastFetchTimeStamp: null,
		},
	});
	if (!session.accessToken) {
    return json({ success: false, error: `Missing access token for shop - ${session.scope}`, editing });
  } else if (!session.shop) {
		return json({ success: false, error: 'Missing shop', editing });
	}

  try {
    return json({ success: true, insert:true, response: playlistRemove ? "Playlist removed." : playlistId ? "Playlist added to store" : "Channel added to store", editing });
  } catch (error) {
    console.error(error);
    return json({ success: false, error: error.message, editing });
  }
};

export const loader = () => {
  return json({ success: false, message: "GET method not supported" });
};
