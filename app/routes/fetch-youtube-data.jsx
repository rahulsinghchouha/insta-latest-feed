import { json } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
import { millify } from "millify"
import { fetchChannelData } from "../utils/utilFunctions";
import { decrypt } from "../utils/encryption";

export const action = async ({ request }) => {
	const url = new URL(request.url);
	const queryParams = url.searchParams;
	const { session, redirect } = await authenticate.public.appProxy(request);
	const shop = session.shop;

	const entry = await prisma.instagramAccount.findFirst({
		where: { shop: shop },
	});

	if (!entry) {
		return json({ success: false, uninitialized: true, shop, entry });
	}

	try {

		// If fetching for the first time, or 24hrs have elapsed since the last fetch
		if (!entry.lastFetchData || (new Date() - new Date(entry.lastFetchTimeStamp)) > 24 * 60 * 60 * 1000 || entry.lastFetchData.length < (entry.rows*entry.columns)) {

			const apiUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${entry.accessToken}&limit=${entry.rows * entry.columns}`;

			const response = await fetch(apiUrl);

			if (!response.ok) {
				const errorData = await response.json();
				const errorCode = errorData?.error?.code;
				const errorSubcode = errorData?.error?.error_subcode;
				const errorMessage = errorData?.error?.message;

				// Handle specific error codes and subcodes
				switch (errorCode) {
					case 190: // OAuthException
						if (errorSubcode === 463) {
							return json({
								code: "API_KEY_INVALID",
								msg: "Access token has expired. Please refresh the token.",
							}, { status: 400 });
						} else {
							return json({
								code: "API_KEY_INVALID",
								msg: "Access token is invalid. Please provide a valid token.",
							}, { status: 400 });
						}
					case 10: // OAuthException for permission errors
						return json({
							code: "INSUFFICIENT_PERMISSIONS",
							msg: "Insufficient permissions. Please review the permissions granted.",
						}, { status: 400 });
					case 4: // Rate limiting
						return json({
							code: "QUOTA_EXCEEDED",
							msg: "Rate limit exceeded. Please try again later.",
						}, { status: 400 });
					case 100: // Invalid parameters
						return json({
							code: "INVALID_PARAMETERS",
							msg: "Invalid request parameters. Please review the API request.",
						}, { status: 400 });
					default:
						return json({
							code: errorCode || "UNKNOWN_ERROR",
							msg: errorMessage || "An unknown error occurred.",
						}, { status: 400 });
				}
			}

			// Parse and return the successful response data
			const data = await response.json();


			await prisma.instagramAccount.update({
				where: {
					shop: shop
				},
				data: {
					lastFetchData: data.data,
					lastFetchTimeStamp: new Date()
				}
			})
			console.log("############## API req made, added to db ###############");
			return json({ data: data.data, rows: entry.rows, columns: entry.columns, title: entry.feedTitle, layoutType: entry.layoutType, username: entry.username }, { status: 200 });
		} else {
			console.log("############## retrieve from db ###############");
			return json({ data: entry.lastFetchData.slice(0, entry.rows*entry.columns), rows: entry.rows, columns: entry.columns, title: entry.feedTitle, layoutType: entry.layoutType, username: entry.username }, { status: 200 });
		}
	} catch (error) {
		console.error("Failed to fetch videos:", error);
		return json({ error: 'Failed to fetch videos' }, { status: 500 });
	}
};


export const loader = () => {
	console.log("FETCH YT LOADER CALLED");
	return json({ success: false, message: "GET method not supported" });
};
