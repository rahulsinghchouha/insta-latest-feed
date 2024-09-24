import { Page, Layout, Card, BlockStack, Text, Link, Badge, FooterHelp } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';

export default function PrivacyPolicy() {
  return (
    <Page 
			backAction={{content: 'Home', url: '/app'}}
			title="Privacy Policy"
      titleMetadata={<Badge tone="info-strong">Latest</Badge>}
      subtitle="Your privacy is important to us"
      compactTitle
		>
      <TitleBar title="CITS Instafeed" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <BlockStack gap={"500"}>
              <Text variant='headingLg' as='h3'>Privacy Policy</Text>
              <Text variant="bodyMd" as='p'>
                Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our Shopify app.
              </Text>

              <Text variant='headingMd' as='h3'>Data Collection</Text>
              <Text variant="bodyMd" as='p'>
                Our application collects the following data:
                <ul>
                  <li><strong>YouTube API Key:</strong> Provided by the user to fetch data from their YouTube channel.</li>
                </ul>
              </Text>

              <Text variant='headingMd' as='h3'>Data Usage</Text>
              <Text variant="bodyMd" as='p'>
                The YouTube API key is used solely for the purpose of fetching data from the user's YouTube channel to display in the carousel on the user's Shopify store.
              </Text>

              <Text variant='headingMd' as='h3'>Data Protection</Text>
              <Text variant="bodyMd" as='p'>
                We take the protection of your data seriously. The YouTube API key is stored in our database in an encrypted format using industry-standard encryption algorithms. Access to this data is restricted and only used as described in this policy.
              </Text>

              <Text variant='headingMd' as='h3'>Data Retention</Text>
              <Text variant="bodyMd" as='p'>
                The YouTube API key is retained as long as the app is installed on the user's Shopify store. Upon uninstallation, the API key and any other related data are deleted from our database.
              </Text>

              <Text variant='headingMd' as='h3'>Contact Us</Text>
              <Text variant="bodyMd" as='p'>
                If you have any questions about our privacy policy, please contact us at <Link url="mailto:citstestdev@gmail.com">citstestdev@gmail.com</Link>.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
			<FooterHelp align="end" >
       <Text variant="bodyMd" as="p">
			 Copyright{' © '+ new Date().getFullYear()+' '} 
       CITS Instafeed
			 </Text>
      </FooterHelp>
    </Page>
  );
}
