import { Badge, BlockStack, Box, Button, Card, InlineGrid, InlineStack, Link, Text } from '@shopify/polaris'
import { useAppBridge } from '@shopify/app-bridge-react';
import { useFetcher } from '@remix-run/react';
import { useEffect, useState, useContext } from 'react';
import {Redirect} from '@shopify/app-bridge/actions';
import { Context as AppBridgeContext  } from '@shopify/app-bridge-react'

// static contextType = Context;
// hello world
function IndexComponent({
	history,
	match,
}) {
	const fetcher = useFetcher();
	const shopify = useAppBridge();
  const app = useContext(AppBridgeContext);
  const redirect = Redirect.create(app);
  
	const [waitDelete, setWaitDelete] = useState(false);

	function handleDisconnectAccount() {
		try {
			setWaitDelete(true);
			fetcher.submit({},{
				method:"POST",
				action:"/disconnect-account"
			})
		} catch (error) {
			console.log(error);
		}
	}

  function handleInstagramLink() {
    try{
      redirect.dispatch(Redirect.Action.REMOTE, 'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=488937830712253&redirect_uri=https://instacarousel24.onrender.com/user-oauth&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish');
    } catch(err){
      console.log(err);
    }
  }

	useEffect(() => {
		if (fetcher.data) {
			setWaitDelete(false);
			if (fetcher.data.success) {
				shopify.toast.show("Account disconnected.");
			} else {
				shopify.toast.show(`Failed to make updates`, { isError: true });
			}
		}
	},[fetcher.data])

	return (
		<InlineGrid columns={['oneThird', 'twoThirds']}>

			<Box paddingBlock={"300"} paddingInline={'400'} style={{ display: "flex", flexDirection: "column", padding: "0px 20px", gap: "10px" }}>
				<Text variant="headingMd" as="h3">Instagram Feed</Text>
				<Text variant='bodyMd' as='p'>Enhance your Shopify store with our easy-to-use app that seamlessly integrates your instagram feed, showcasing your products or featured content to captivate your customers' attention.</Text>
			</Box>

			<BlockStack>
				<Card>
					<BlockStack gap={"200"}>
						{
							history ? (
								<BlockStack gap={"300"}>
									<InlineStack gap={"200"}>
										<Text variant='bodySm' as='p'>Account Linked:  <strong>{` @${history.username}`}</strong></Text>
										<Badge tone="success">Active</Badge>
									</InlineStack>
									<Box>
										<Button onClick={handleDisconnectAccount} loading={waitDelete}>Disconnect Instagram Account</Button>
									</Box>
									<p style={{ marginTop: "10px", fontStyle: "italic" }}>It may take few hours for the feed to be downloaded, contact customer support if feed does not appear on homepage.</p>
								</BlockStack>
							) : (
								<BlockStack gap={"300"}>
									<Box>
										<Text as='h3' variant='headingLg'>Get Started!</Text>
										<Box paddingBlock={"200"}></Box>
                    <Button onClick={handleInstagramLink} >Link Your Instagram Account</Button>
										<Link
											removeUnderline
											target='_parent'
											url='https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=488937830712253&redirect_uri=https://instacarousel24.onrender.com/user-oauth&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish'
										>
											Link Your Instagram Account
										</Link>
									</Box>
									<p style={{ marginTop: "10px", fontStyle: "italic" }}>It may take few hours for the feed to be downloaded, contact custom support if feed does not appear on homepage.</p>
								</BlockStack>
							)
						}
					</BlockStack>
				</Card>
			</BlockStack>
		</InlineGrid>
	)
}

export default IndexComponent
