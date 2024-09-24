import { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Text, Card, Button, BlockStack, InlineStack, Banner, Box, TextField, Tabs, List, FooterHelp, Link, CalloutCard, Modal, Divider } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { json } from "@remix-run/node"
import { TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import EditComponent from "../components/EditComponent";
import DocumentationAndFAQ from "../components/DocumentationAndFAQ";
import IndexComponent from "../components/IndexComponent";
import { StarIcon, StarFilledIcon, MagicIcon, ThumbsUpIcon } from '@shopify/polaris-icons';
import InstaComponent from "../components/InstaComponent";

export const loader = async ({ request }) => {
	console.log("rendering index")
	let history = null;
	let feedback = null;

	const { session } = await authenticate.admin(request);
	const match = await prisma.instagramAccount.findFirst({
		where: {
			shop: session.shop
		}
	});
	
	if (match) {
		history = {
			shop: match.shop,
			instagramUserId: match.instagramUserId,
			username: match.username,
		}
	}

	const feedbackMatch = await prisma.AppTestimonial.findFirst({
		where: {
			storeName: session.shop
		}
	})
	if (feedbackMatch) feedback = feedbackMatch;

	const url = new URL(request.url);
	const queryParams = url.searchParams;

	return json({ history, match, appBlockId: process.env.SHOPIFY_INSTAGRAM_FEEDER_ID, feedbackMatch: feedback, instaConnected: match ? true : false });
};

export default function Index() {

	const app = useAppBridge();

	const { history, match, appBlockId, feedbackMatch, instaConnected } = useLoaderData();
	const [selected, setSelected] = useState(0);

	const handleTabChange = useCallback(
		(selectedTabIndex) => setSelected(selectedTabIndex),
		[],
	);

	const tabs = [
		{
			id: "home-content-1" ,
			content: 'Home',
			accessibilityLabel: 'App',
			panelID: 'app-main-content-1',
		},
		{
			id: 'main-content-1',
			content: 'App',
			accessibilityLabel: 'App',
			panelID: 'app-main-content-1',
		},
		{
			id: 'documentation and FAQ-1',
			content: 'Guide',
			accessibilityLabel: 'Documentation & FAQs',
			panelID: 'documentation-faqs-content-1',
		},
	];

	return (
		<Page>
			<TitleBar title="CITS Instafeed" />
			<BlockStack gap="500">
				<Layout>
					<Layout.Section variant="fullWidth">
						<Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted={false} canCreateNewView={false}>
							<Box paddingBlock={"300"} >
								{tabs[selected].id === "home-content-1" ? (
									<BlockStack gap={"300"}>

										<Box borderInlineStartWidth="075" padding={"300"} shadow="200"
											style={{
												background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
												padding: '20px',
												borderRadius: '10px',
												color: '#ffffff'
											}}
										>
											<Text variant="headingMd" as="h1">Add Instagram Feed to Store</Text>
										</Box>
										<Box borderInlineStartWidth="075" padding={"300"} shadow="200" background="input-bg-surface">
											<CalloutCard
												title="Your API Keys are encrypted and secured."
												illustration="./insta-logo.png"
												primaryAction={{
													content: 'Go to App',
													url: '#',
													onAction: () => { setSelected(1) }
												}}
											>
												<p>Its quick and hassle free.</p>
											</CalloutCard>
										</Box>
									</BlockStack>
								) :
									tabs[selected].id === "main-content-1" ? (
										<BlockStack gap={"300"}>
											<IndexComponent app={app} match={match} history={history}  />
											<Divider borderColor="border" />
											{history && <InstaComponent match={match} history={history} appBlockId={appBlockId} />}
											<Divider borderColor="border" />
										</BlockStack>
									) : (
										<DocumentationAndFAQ />
									)
								}
							</Box>
						</Tabs>
					</Layout.Section>
				</Layout>
			</BlockStack>
			<FooterHelp align="end">
				Copyright{' © ' + new Date().getFullYear() + ' '}
				CITS Instafeed
			</FooterHelp>
		</Page>
	);
}
