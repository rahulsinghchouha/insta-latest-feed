import { BlockStack, Box, Card, InlineGrid, Tabs, Text } from '@shopify/polaris';
import React, { useCallback, useState } from 'react'

const DocumentationAndFAQ = () => {
	const [selected, setSelected] = useState(0);

	const handleTabChange = useCallback(
		(selectedTabIndex) => setSelected(selectedTabIndex),
		[],
	);

	const tabs = [
		{
			id: 'adding-carousel-onl-store-2',
			content: 'Adding Carousel to Online Store',
			accessibilityLabel: 'Adding Carousel to Online Store',
			panelID: 'all-customers-fitted-content-2',
		},
		{
			id: 'adding-videos-to-carousel-2',
			content: 'Adding Videos to Carousel',
			panelID: 'adding-videos-to-carousel-2',
		},
	];
	
	return (
		<BlockStack>
			<Card roundedAbove="sm">
				<BlockStack gap={"500"}>

					<BlockStack gap="300">
						<Text variant="heading2xl" as="h3">
							Usage Guide
						</Text>
						<Text variant="bodyMd" as="p">Youtube carousel app aims to create a hassle free youtube carousel integration for your application absolutely for free with no hidden charges. You can further customize the positioning and placement of the carousel from your theme customizer. It's that simple!</Text>
					</BlockStack>

					<Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
						<Box paddingBlock={"300"}>
						{selected === 1 ? (
							<BlockStack gap={"400"}>

								<BlockStack gap={"300"}>
									<Text variant="headingMd" as="h3">
										1. Choose Channel and Add API Key
									</Text>
									<Text variant='bodyMd' as='p'> You simply add your API key, choose your desired youtube channel, and your online store gets a highly functional and elegant carousel.</Text>
									<InlineGrid columns={1}>
										<figure style={{padding:"15px", backgroundColor:"#F1F1F1", borderRadius:"8px"}}>
											<img width={"100%"} src="/add-information-blurred.png" alt="Choose Channel and Add Api Key" />
										</figure>
									</InlineGrid>
								</BlockStack>

								<BlockStack gap={"300"}>
									<Text variant="headingMd" as="h3">
										2. The carousel is now activated
									</Text>
									<Text variant='bodyMd' as='p'>The carousel in your online store is now working. It will show the latest videos from the selected youtube channel</Text>
									<InlineGrid columns={1}>
										<figure style={{padding:"15px", backgroundColor:"#F1F1F1", borderRadius:"8px"}}>
											<img width={"100%"} src="/carousel-active-blurred.png" alt="Example of a working carousel" />
										</figure>
									</InlineGrid>
								</BlockStack>

								<BlockStack gap={"300"}>
									<Text variant="headingMd" as="h3">
										3. Optionally, you can also select a particular playlist from that channel to show in your carousel
									</Text>
									<Text variant='bodyMd' as='p'>Click on the 'Browse Playlists' link to see all the playlists of the channel</Text>
									<InlineGrid columns={1}>
										<figure style={{padding:"15px", backgroundColor:"#F1F1F1", borderRadius:"8px"}}>
											<img width={"100%"} src="/browse-playlists-blurred.png" alt="Example of a working carousel" />
										</figure>
									</InlineGrid>
								</BlockStack>

								<BlockStack gap={"300"}>
									<Text variant="headingMd" as="h3">
										4. After choosing a particular playlist, that playlist will be visible in the carousel in your online store.
									</Text>
									<Text variant='bodyMd' as='p'>You can also change, at any time, the channel itself or the playlist. You can also remove the playlist entirely to show the latest videos instead.</Text>
									<InlineGrid columns={1}>
										<figure style={{padding:"15px", backgroundColor:"#F1F1F1", borderRadius:"8px"}}>
											<img width={"100%"} src="/playlist-active-blurred.png" alt="Example of a working carousel" />
										</figure>
									</InlineGrid>
								</BlockStack>

								<BlockStack gap={"300"}>
									<Text variant="headingMd" as="h3">
										5. That's it! Your carousel is now visible in your online store.
									</Text>
									<InlineGrid columns={1}>
										<figure style={{padding:"15px", backgroundColor:"#F1F1F1", borderRadius:"8px"}}>
											<img width={"100%"} src="example-carousel-working-blurred.png" alt="Example of a working carousel" />
										</figure>
									</InlineGrid>
								</BlockStack>
							</BlockStack>
						) : (
							<BlockStack gap={"400"}>
								<BlockStack >
									<Box>
										<Text variant='headingMd' as="h3">Directly add to your store through the deep link provided.</Text>
									</Box>
									<figure style={{padding:"15px", backgroundColor:"#F1F1F1", borderRadius:"8px"}}>
										<img width={"100%"} src="/add-to-store-deeplink-blurred.png" alt="Uninitialized carousel in online store" />
									</figure>
									<figure style={{padding:"15px", backgroundColor:"#F1F1F1", borderRadius:"8px", display:"flex", alignItems:'center', justifyContent:'center'}}>
										<img width={"90%"} src="/deeplink-success-named.png" alt="Uninitialized carousel in online store" />
									</figure>
								</BlockStack>
								<BlockStack>
									<Text variant='headingMd' as="h3">OR</Text>
								</BlockStack>
								<BlockStack  gap={"300"}>
										<Text variant='headingMd' as="h3">
											1. Edit your store theme
										</Text>
										<Text variant='bodyMd' as='p'>Go to your online store in your shopify admin and click the customize button to customize the theme.</Text>
									<figure style={{padding:"15px", backgroundColor:"#F1F1F1", borderRadius:"8px"}}>
										<img width={"100%"} src="/add-to-store-1-blurred.png" alt="Uninitialized carousel in online store" />
									</figure>
								</BlockStack>

								<BlockStack gap={"300"}>
									<Text variant="headingMd" as="h3">
										2. Add a new section and choose CITS Instafeed from the Apps Tab as shown.
									</Text>
									<Text variant='bodyMd' as='p'> This will create an empty carousel container in the store. You can drag and place this section as per your liking.</Text>
									<InlineGrid columns={1}>
										<figure style={{padding:"15px", backgroundColor:"#F1F1F1", borderRadius:"8px"}}>
											<img width={"100%"} src="/add-to-store-4-blurred.png" alt="Choose Channel and Add Api Key" />
										</figure>
									</InlineGrid>
								</BlockStack>

								<BlockStack gap={"300"}>
									<Text variant="headingMd" as="h3">
										3. Save the theme.
									</Text>
									<Text variant='bodyMd' as='p'>You are all fone!</Text>
									<InlineGrid columns={1}>
										<figure style={{padding:"15px", backgroundColor:"#F1F1F1", borderRadius:"8px"}}>
											<img width={"100%"} src="/add-to-store-5-blurred.png" alt="Example of a working carousel" />
										</figure>
									</InlineGrid>
								</BlockStack>
							</BlockStack>
						)}
						</Box>
					</Tabs>
				</BlockStack>

			</Card>
		</BlockStack>
	)
}

export default DocumentationAndFAQ;