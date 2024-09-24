import { BlockStack, Box, Button, Card, InlineGrid, InlineStack, Divider, Select, Text, TextField } from '@shopify/polaris';
import React, { useCallback, useState, useEffect } from 'react'
import { StatusActiveIcon } from '@shopify/polaris-icons';
import { useFetcher } from '@remix-run/react';
import { useAppBridge } from '@shopify/app-bridge-react';
// import debounce from "lodash.debounce";
// import axios from 'axios';


function InstaComponent({
	history,
	match,
	appBlockId
}) {

	/************************
	 * Variable Definitions *
	 ************************/

	const fetcher = useFetcher();
	const shopify = useAppBridge();
	const [waitTitle, setWaitTitle] = useState(false);
	const [instagramTitle, setInstagramTitle] = useState(match.feedTitle ? match.feedTitle : "");
	const [instagramLayoutType, setInstagramLayoutType] = useState(match.layoutType ? match.layoutType : "");
	const [instagramGridLayout, setInstagramGridLayout] = useState((match.rows && match.columns) ? `${match.columns}__${match.rows}` : '');
	const instagramLayoutOptions = [
		{ label: 'Select', value: '' },
		{ label: 'Grid', value: 'layout__grid' },
		{ label: 'Swiper', value: 'layout__swiper' },
	];

	const instagramGridLayoutOptions = [
		{ label: 'Select', value: '' },
		{ label: '6 x 1', value: '6__1' },
		{ label: '4 x 1', value: '4__1' },
		{ label: '6 x 2', value: '6__2' },
		{ label: '5 x 2', value: '5__2' },
		{ label: '4 x 2', value: '4__2' },
		{ label: '3 x 3', value: '3__3' },
	]


	/************************
	 * Function Definitions *
	 ************************/


	const handleInstaTitleChange = useCallback(
		(newValue) => setInstagramTitle(newValue),
		[],
	);

	const handleTitleSave = () => {
		try {
			if(!instagramTitle) return;
			setWaitTitle(true);
			const formData = new FormData();
      formData.append("title", instagramTitle); // Add the title to FormData
			fetcher.submit(formData, {
				method: "POST",
				action: `/customize-feed` 
			});
			setTimeout(()=>{
				setWaitTitle(false);
			},3000)
		} catch (error) {
			console.log(error);
		}
	}

	const handleInstagramLayoutChange = useCallback(
		(value) => {

			setInstagramLayoutType(value)
			const formData = new FormData();
      formData.append("layoutType", value); // Add the title to FormData
			fetcher.submit(formData, {
				method: "POST",
				action: `/customize-feed` 
			})
		},
		[],
	);

	const handleInstagramGridLayout = useCallback(
		(value) => {
			setInstagramGridLayout(value);
			const formData = new FormData();
      formData.append("gridLayout", value); // Add the title to FormData
			fetcher.submit(formData, {
				method: "POST",
				action: `/customize-feed` 
			})
		},
		[],
	);

	const handleDeepLink = () => {
		const openUrl = `https://${match.shop}/admin/themes/current/editor?template=index&addAppBlockId=${appBlockId}/cits-insta-feed&target=newAppsSection`;
		window.open(openUrl, "_blank");
	}

	/******************
	 *    EFFECTS     *
	 ******************/

	useEffect(() => {
		console.log("HERE IS THE EFFECT", fetcher);
		if (fetcher.data) {
			setWaitTitle(false);
			if (fetcher.data.success) {
				if (fetcher.data.updateType === "title") {
					shopify.toast.show("Feed title updated.");
				} else if (fetcher.data.updateType === "layoutType") {
					shopify.toast.show("Feed layout updated.");
				} else if (fetcher.data.updateType === "gridLayout") {
					shopify.toast.show("Grid layout updated.");
				}
			} else {
					shopify.toast.show(`Failed to make updates`, { isError: true });
			}
		}
	}, [fetcher.data]);

	return (
		<BlockStack gap={"400"}>

			<InlineGrid columns={['oneThird', 'twoThirds']}>

				<Box paddingBlock={"300"} paddingInline={'400'} style={{ display: "flex", flexDirection: "column", padding: "20px", gap: "10px" }}>
					<Text variant="headingMd" as="h3">Customize Layout</Text>
					<Text variant='bodyMd' as='p'>Customize the layout of the feed as it appears in your website.</Text>
				</Box>

				<BlockStack>
					<Card>
						<BlockStack gap={"200"}>
							<InlineStack align='start' blockAlign='end'>
								<TextField
									label="Instagram Feed Title"
									value={instagramTitle}
									onChange={handleInstaTitleChange}
									autoComplete="off"
								/>
								<Box style={{ marginBottom: "2px", marginLeft: "5px" }}><Button loading={waitTitle}  onClick={handleTitleSave} variant='primary'>Save</Button></Box>
							</InlineStack>
							<InlineStack align='start' blockAlign='center' gap={"300"}>
								<Box style={{ width: "210px" }}>
									<Select
										label="Layout Type"
										options={instagramLayoutOptions}
										onChange={handleInstagramLayoutChange}
										value={instagramLayoutType}
									/>
								</Box>

								{ instagramLayoutType === "layout__grid" && <Box style={{ width: "210px" }}>
									<Select
										label="Grid Layout"
										options={instagramGridLayoutOptions}
										onChange={handleInstagramGridLayout}
										value={instagramGridLayout}
									/>
								</Box>}
							</InlineStack>
						</BlockStack>
					</Card>
				</BlockStack>
			</InlineGrid>

			<Divider borderColor="border" />
			<InlineGrid columns={['oneThird', 'twoThirds']}>

				<Box paddingBlock={"300"} paddingInline={'400'} style={{ display: "flex", flexDirection: "column", padding: "20px", gap: "10px" }}>
					<Text variant="headingMd" as="h3">Add to Store</Text>
					<Text variant='bodyMd' as='p'>Add directly to your online store.</Text>
				</Box>

				<BlockStack>
					<Card>
						<Text variant="bodyMd" as='p'> You can directly add this to online store, saving you the hassle of navigating and editing the theme:</Text>
						<Box paddingBlock={"100"}></Box>
						<Button variant='secondary' icon={StatusActiveIcon} onClick={handleDeepLink} >Add to Store</Button>
					</Card>
				</BlockStack>
			</InlineGrid>


		</BlockStack>
	);
}


export default InstaComponent;