import { Autocomplete, BlockStack, Button, Card, Form, FormLayout, Icon, InlineStack, Layout, Text, TextField } from '@shopify/polaris';
import React, { useCallback, useMemo, useEffect, useState } from 'react'
import { ProductIcon, ViewIcon, HideIcon, SearchIcon, PlusIcon } from '@shopify/polaris-icons';
import { useFetcher } from '@remix-run/react';
import axios from 'axios';
import debounce from "lodash.debounce";
import { useAppBridge } from '@shopify/app-bridge-react';

function ChannelFormComponent({ setShowFeedbackModal, setShowChannelForm, ownApiKey }) {


	/************************
	 * Variable Definitions *
	*************************/


	const fetcher = useFetcher();
	const shopify = useAppBridge();
	const deselectedOptions = useMemo(() => [], []);
	const [apiFieldError, setApiFieldError] = useState(false);
	const [apiFieldErrorMsg, setApiFieldErrorMsg] = useState("API Key is required");
	const [selectedOptions, setSelectedOptions] = useState([]);
	const [showKey, setShowKey] = useState(false);
	const [userAPIKey, setUserAPIKey] = useState("")
	const [options, setOptions] = useState(deselectedOptions);
	const [inputValue, setInputValue] = useState('');
	const [wait, setWait] = useState(false);
	const [channelName, setChannelName] = useState("");
	const updateText = useCallback(
		(value) => {
			setInputValue(value);
			if (value === '') {
				setOptions(deselectedOptions);
				return;
			}
			debouncedSearch(value)
		},
		[deselectedOptions]);


	const textField = (
		<Autocomplete.TextField
			size="medium"
			onChange={updateText}
			label="Channel"
			value={inputValue}
			prefix={<Icon source={SearchIcon} tone="base" />}
			placeholder="Search"
			autoComplete="off"
		/>
	);


	/************************
	 * Function Definitions *
	*************************/


	const handleChannelSubmit = () => {
		setWait(true);
		if (!userAPIKey) {
			setWait(false);
			setApiFieldError(true);
			return;
		}
		fetcher.submit(
			{},
			{ method: 'post', action: `/add-script-tag?channel=${encodeURIComponent(channelName)}&key=${encodeURIComponent(userAPIKey)}&edit=false`, }
		);
	};


	const updateSelection = useCallback(
		(selected) => {
			const selectedValue = selected.map((selectedItem) => {
				const matchedOption = options.find((option) => {
					return option.value.match(selectedItem);
				});
				return matchedOption && matchedOption.label;
			});
			setSelectedOptions(selected);
			setInputValue(selectedValue[0] || '');
			setChannelName(selected[0] || '');
		},
		[options]);


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
			setOptions(response.data.items?.map(item => ({ label: item.snippet.title, value: item.id.channelId })));
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}, 300);


	/************************
	 *    UseEffect Hooks   *
	 ************************/


	useEffect(() => {
		if (fetcher.data) {
			setWait(false);
			if (fetcher.data.success) {
				if (fetcher.data.insert === true) {
					shopify.toast.show('Channel added successfully!');
					setUserAPIKey("");
					setInputValue("");
					setSelectedOptions(deselectedOptions);
					setShowChannelForm(false);
					setShowFeedbackModal(false);
				} else {
					setRemoveWait(false);
					shopify.toast.show("Scripts removed!");
				}
			} else {
				if (fetcher.data.code === "API_KEY_INVALID") {
					setApiFieldError(true);
					setApiFieldErrorMsg(fetcher.data.error);
				} else {
					shopify.toast.show(`Failed to add carousel: ${fetcher.data.error}`, { isError: true });
				}
			}
		}
	}, [fetcher.data]);

	return (
		<BlockStack>
			<Card roundedAbove="sm">
				<BlockStack gap="200">
					<BlockStack inlineAlign="start">
						<InlineStack gap={100} blockAlign="center">
							<Icon source={ProductIcon} />
							<Text as="h3" variant="headingSm">
								Add a Channel Name
							</Text>
						</InlineStack>
					</BlockStack>
					<Form noValidate onSubmit={handleChannelSubmit}>
						<FormLayout>
							<Autocomplete
								options={options}
								selected={selectedOptions}
								onSelect={updateSelection}
								textField={textField}
							/>
							<TextField
								size="medium"
								label="API Key"
								type={showKey ? "text" : "password"}
								autoComplete="off"
								error={apiFieldError ? apiFieldErrorMsg : undefined}
								onChange={(val) => { setApiFieldError(false); setApiFieldErrorMsg("API key is required."); setUserAPIKey(val) }}
								value={userAPIKey}
								suffix={<Button submit={false} onClick={() => { setShowKey(prev => !prev) }} icon={showKey ? HideIcon : ViewIcon} variant="plain" />}
							/>
							<Button variant="primary" icon={PlusIcon} loading={wait} size="large" submit>Add Channel</Button>
						</FormLayout>
					</Form>
				</BlockStack>
			</Card>
		</BlockStack>
	)
}

export default ChannelFormComponent