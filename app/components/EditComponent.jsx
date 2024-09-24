import { Autocomplete, Avatar, Badge, Banner, Bleed, BlockStack, Box, Button, CalloutCard, Card, Collapsible, DataTable, Grid, Icon, InlineGrid, InlineStack, Layout, Link, Scrollable, Spinner, Text, TextField, Tooltip } from '@shopify/polaris';
import { millify } from 'millify';
import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { ViewIcon, HideIcon, SearchIcon, StatusActiveIcon } from '@shopify/polaris-icons';
import { useFetcher } from '@remix-run/react';
import { useAppBridge } from '@shopify/app-bridge-react';
import debounce from "lodash.debounce";
import axios from 'axios';


function EditComponent({
	history,
	match,
	ownApiKey,
	appBlockId
}) {


	/************************
	 * Variable Definitions *
	 ************************/

	const fetcher = useFetcher();
	const shopify = useAppBridge();
	const [wait, setWait] = useState(false);
	const [showKey, setShowKey] = useState(false);
	const [playlists, setPlaylists] = useState([]);
	const deselectedOptions = useMemo(() => [], []);
	const [removeWait, setRemoveWait] = useState(false);
	const [showCollapse, setShowCollapse] = useState(false);
	const [editApiFieldError, setEditApiFieldError] = useState(false);
	const [editOptions, setEditOptions] = useState(deselectedOptions);
	const [editSelectedOptions, setEditSelectedOptions] = useState([]);
	const [waitPlaylistRemove, setWaitPlaylistRemove] = useState(false);
	const [waitPlaylistSelection, setWaitPlaylistSelection] = useState("");
	const [showPlaylistCollapse, setShowPlaylistCollapse] = useState(false);
	const [editUserAPIKey, setEditUserAPIKey] = useState(match ? match.apiKey : "");
	const [editInputValue, setEditInputValue] = useState(history ? history.title : "");
	const [editChannelName, setEditChannelName] = useState(match ? match.channelName : "");
	const [editApiFieldErrorMsg, setEditApiFieldErrorMsg] = useState("API Key is required");
	const [checkAPIKeyHealth, setCheckAPIKeyHealth] = useState({
		healthOk: true,
		errorMsg:''
	});

	const [flagLoader, setFlagLoader] = useState();

	const updateEditText = useCallback(
		(value) => {
			setEditInputValue(value);
			if (value === '') {
				setEditOptions(deselectedOptions);
				return;
			}
			debouncedSearch(value, true)
		},
	[deselectedOptions]);

	const modalTextField = (
		<Autocomplete.TextField
			size="medium"
			onChange={updateEditText}
			label="Channel"
			value={editInputValue}
			prefix={<Icon source={SearchIcon} tone="base" />}
			placeholder="Search"
			autoComplete="off"
		/>
	);


	/************************
	 * Function Definitions *
	 ************************/

	
	const handleDeepLink = () => {
		const openUrl = `https://${match.storeName}/admin/themes/current/editor?template=index&addAppBlockId=${appBlockId}/cits-instafeed-1&target=newAppsSection`;
		window.open(openUrl, "_blank");
	}

	const handlePlaylistSelection = async (item) => {
		try {
			setWaitPlaylistSelection(item.id);
			fetcher.submit({}, { 
				method: "POST",
				action: `/add-script-tag?channel=${encodeURIComponent(editChannelName)}&key=${encodeURIComponent(editUserAPIKey)}&edit=true&playlist=${item.id}` 
			})
		} catch (error) {
			console.log(error);
		}
	};

	const handlePlaylistRemove = async (item) => {
		try {
			setWaitPlaylistRemove(true);
			fetcher.submit({}, {
				method: "POST",
				action: `/add-script-tag?channel=${encodeURIComponent(editChannelName)}&key=${encodeURIComponent(editUserAPIKey)}&edit=true&playlist=${item.id}&playlistremove=true` 
			})
		} catch (error) {
			console.log(error);
		}
	};

	const handleEditChannelSubmit = () => {
		setWait(true);
		if (!editUserAPIKey) {
			setWait(false);
			setEditApiFieldError(true);
			return;
		}
		fetcher.submit( 
			{},
			{ method: 'post', action: `/add-script-tag?channel=${encodeURIComponent(editChannelName)}&key=${encodeURIComponent(editUserAPIKey)}&edit=true`, }
		);
	};

	
	const updateEditSelection = useCallback(
		(selected) => {
			const selectedValue = selected.map((selectedItem) => {
					const matchedOption = editOptions.find((option) => {
					return option.value.match(selectedItem);
				});
				return matchedOption && matchedOption.label;
			});
			setEditSelectedOptions(selected);
			setEditInputValue(selectedValue[0] || '');
			setEditChannelName(selected[0] || '');
		},
	[editOptions]);


	const handleRemoveCarousel = () => {
		setRemoveWait(true);
		fetcher.submit({}, { method: 'post', action: '/remove-script-tag' });
	};

	async function sleep(ms) {
		return new Promise((res, rej) => {
			setTimeout(()=>{
				res();
			},ms)
		})
	}

	const debouncedSearch = debounce(async (searchQuery, edit) => {
		try {
			const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
				params: {
					key: ownApiKey,
					part: 'snippet',
					type: 'channel',
					q: searchQuery,
				}
			});
			if (edit === true) {
				setEditOptions(response.data.items?.map(item => ({ label: item.snippet.title, value: item.id.channelId })));
			}
		} catch (error) {
			console.error('Error fetching data search (dbn):', error);
		}
	}, 300);

	const fetchPlaylists = async () => {
		const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${match ? match.channelName : ""}&key=${match ? match.apiKey : ""}&maxResults=50`;
		const response = await fetch(url);
		if(!response.ok){
			const errorData = await response.json();
			const errorReason = errorData?.error?.details[0]?.reason;
			switch (errorReason) {
				case 'API_KEY_INVALID':
					setCheckAPIKeyHealth(prev => ({...prev, healthOk: false, errorMsg:"API_KEY_INVALID"}));
					break;
				case 'QUOTA_EXCEEDED':
					setCheckAPIKeyHealth(prev => ({...prev, healthOk: false, errorMsg:"QUOTA_EXCEEDED"}));
					break;
				default:
					setCheckAPIKeyHealth(prev => ({...prev, healthOk: false, errorMsg:errorReason}));
					break;
			}
		}
		const data = await response.json();
		setPlaylists(data.items);
	};

	
	/************************ 
	 *   UseEffect Hooks    * 
	 ************************/

	useEffect(() => {
		fetchPlaylists();
	}, [match.channelName, match.apiKey]);


	useEffect(() => {
		if (fetcher.data) {
			setWait(false);
			setWaitPlaylistSelection("");
			setWaitPlaylistRemove(false);
			setShowPlaylistCollapse(false);
			if (fetcher.data.success) {
				if (fetcher.data.insert === true) {
					shopify.toast.show(fetcher.data.response);
				} else {
					setRemoveWait(false);
					shopify.toast.show("Channel removed!");
				}
			} else {
				if (fetcher.data.apiKeyInvalid) {
					if (fetcher.data.editing) {
						setEditApiFieldError(true);
						setEditApiFieldErrorMsg(fetcher.data.error);
					}
				} else {
					shopify.toast.show(`Failed to add channel: ${fetcher.data.error}`, { isError: true });
				}
			}
		}
	}, [fetcher.data]);

	return (
		<BlockStack>
			{
				!checkAPIKeyHealth.healthOk && (
					<Banner
						title={checkAPIKeyHealth.errorMsg === "API_KEY_INVALID" ? "Your API Key is Invalid" : checkAPIKeyHealth.errorMsg === "QUOTA_EXCEEDED" ? "The Daily Quota Limit for your API Key has been Reached." : "API is experiencing some issues"}
						tone="warning"
						onDismiss={() => {}}
					>
						{
							checkAPIKeyHealth.errorMsg === "API_KEY_INVALID" ? <p>Kindly re-submit your API key.</p> : checkAPIKeyHealth.errorMsg === "QUOTA_EXCEEDED" ? 
							<p>You can either create a fresh API Key, or upgrade your API with youtube to enjoy more quota.</p> : <p></p>
						}
					</Banner>
				)
			}
			<Card>
				<Text variant="headingMd" as="h4">
					Carousel
				</Text>
				<Box padding={"100"} paddingBlockStart={"300"} >
				<InlineStack align='space-between' blockAlign='center'>
					<Text variant='bodyMd' as='p'>Active Channel:</Text>
					<Box width="150px">
						<InlineGrid gap={"200"} columns={2}>
							<Button size="large" variant="secondary" onClick={() => { setShowCollapse(prev => !prev) }}>Edit</Button>
							<Button size="large" variant="secondary" tone="critical" loading={removeWait} onClick={handleRemoveCarousel}>Remove</Button>
						</InlineGrid>
					</Box>
				</InlineStack>
				<Box paddingBlock={"100"}></Box>
					<DataTable
						columnContentTypes={[
							'text',
							'text',
							'numeric',
							'numeric',
						]}
						headings={[
							'Channel Pic',
							'Channel Name',
							'Video Count',
							'View Count',
						]}
						rows={[[<Avatar size="xl" source={history ? history.thumbnail : undefined} initials="YT" name={history ? history.title : ""} />, history ? history.title : "", `${history.videoCount} Videos`, `${millify(history.viewCount)} Views`]]}
        	/>
				</Box>
				<Collapsible
					open={showCollapse}
					id="basic-collapsible"
					transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
					expandOnPrint
				>
					<Box padding={"400"}>
						<Box paddingBlockEnd={'200'}>
							<Autocomplete
								options={editOptions}
								selected={editSelectedOptions}
								onSelect={updateEditSelection}
								textField={modalTextField}
							/>
						</Box>
						<TextField
							size="medium"
							label="API Key"
							type={showKey ? "text" : "password"}
							autoComplete="off"
							error={editApiFieldError ? editApiFieldErrorMsg : undefined}	
							onChange={(val) => { setEditApiFieldError(false); setEditApiFieldErrorMsg("API key is required."); setEditUserAPIKey(val); }}
							value={editUserAPIKey}
							suffix={<Button submit={false} onClick={() => { setShowKey(prev => !prev) }} icon={showKey ? HideIcon : ViewIcon} variant="plain" />}
						/>
					</Box>
					<InlineStack align="end" gap={200}>
						<Button size="large" variant="primary" loading={wait} onClick={() => { handleEditChannelSubmit() }}>Update</Button>
						<Button size="large" onClick={() => setShowCollapse(false)}>Close</Button>
					</InlineStack>
				</Collapsible>
				{match.playlistId && <div style={{marginBlockStart:"20px", borderLeft:"4px solid #f74535", borderInlineStart:"4px solid #f73545", border:"1px solid rgba(0,0,0,0.3)", borderInlineStartWidth:"4px",borderInlineStartColor:"#f74545"}}>
						{match.playlistId && <Box padding={"400"} >
							{
								(match?.playlistId && playlists.filter(item => item.id === match.playlistId)?.length > 0) && playlists.filter(item => item.id === match.playlistId).map(item => (
									<InlineGrid columns={['twoThirds', 'oneThird']} alignItems='center' >
										<Box>
											<InlineStack gap={"0"}>
												<div style={{ width: "30px" }}><Icon source={StatusActiveIcon} /></div>
												<Text variant='headingMd'>{item.snippet.title}</Text>
											</InlineStack>
											<div style={{ paddingInlineStart: "9px" }}>
												<Text variant='bodyMd' as='p'>This playlist has been activated.</Text>
											</div>
										</Box>
										<InlineStack align='end'>
											<Box width='100'>
												<Button loading={waitPlaylistRemove} onClick={()=>{handlePlaylistRemove(item)}} >Remove</Button>
											</Box>
										</InlineStack>
									</InlineGrid>
								))
							}
						</Box>}
				</div>}
				
				<Box paddingBlockStart={400}>
					<Text as="p" variant='bodyMd'>Showing latest videos by default. You can also add a particular playlist on the website: <Button onClick={() => { setShowPlaylistCollapse(true); }} variant='plain'>Browse Playlists</Button></Text>
					<Collapsible
						open={showPlaylistCollapse}
						id="basic-collapsible-2"
						transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
						expandOnPrint
					>
						<Box padding={400}>
							<Scrollable shadow style={{ height: playlists && playlists.length > 0 ? '180px': 'auto' }} focusable>
								<Grid>
									{
										(playlists && playlists.length > 0) ?
											playlists.map(item => (
												<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
													<CalloutCard
														title={item.snippet.title}
														illustration={item.snippet.thumbnails.high.url || "/yt_logo_rgb_light.png"}
														primaryAction={{
															content: (waitPlaylistSelection && waitPlaylistSelection === item.id) ? <Spinner accessibilityLabel="Small spinner example" size="small" /> : "Select Playlist",
															url: undefined,
															onAction: () => { handlePlaylistSelection(item) }
														}}
													>
														<Text variant='bodyMd' truncate={50} breakWord >{"Playlist created by channel - "} <Tooltip content={item.snippet.description || "Youtube playlist"} persistOnClick dismissOnMouseOut><Button variant='plain'>Know More</Button></Tooltip></Text>
														{match.playlistId === item.id && <Box width='50' paddingBlock={"100"}><Badge tone='success-strong' >Active</Badge></Box>}
														<img src="/yt_logo_rgb_light.png" width={100} style={{ padding: "10px 0px" }} alt="" />
													</CalloutCard>
												</Grid.Cell>
											))
											:
											(<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}><Text variant='headingLg' tone='disabled'>No Playlists found for this channel</Text></Grid.Cell>)
									}
								</Grid>
							</Scrollable>
						</Box>
					</Collapsible>
				</Box>
				<Box paddingBlock={"200"}></Box>
				<Text variant="bodyMd" as='p'> You can directly add this to online store, saving you the hassle of navigating and editing the theme:</Text>
				<Box paddingBlock={"100"}></Box>
				<Button variant='secondary' icon={StatusActiveIcon}  onClick={handleDeepLink} >Add to Store</Button>
			</Card>
		</BlockStack>
	)
}

export default EditComponent;