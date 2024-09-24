import {millify} from "millify";

export async function getChannelInfo(apiKey, channelId) {
	const apiUrl = `https://www.googleapis.com/youtube/v3/channels?key=AIzaSyDwq9MRUq87OrRwnJhvVvmmUICGmVylJIk&part=snippet,statistics&id=${channelId}`;
	try {
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error('Failed to fetch channel information');
		}

		const data = await response.json();


		if (data.items && data.items.length > 0) {
			const channel = data.items[0];
			return ({
				channelId,
				title: channel.snippet.title,
				description: channel.snippet.description,
				thumbnail: channel.snippet.thumbnails.high.url,
				subscriberCount: channel.statistics.subscriberCount,
				videoCount: channel.statistics.videoCount,
				viewCount: channel.statistics.viewCount,
			});
		} else {
			throw new Error('Channel not found');
		}
	} catch (error) {
		console.error('Error fetching channel information:', error);
		throw error;
	}
}

export async function isValidYouTubeApiKey(apiKey) {
	const testApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=id&id=dQw4w9WgXcQ&key=${apiKey}`;
	try {
		const response = await fetch(testApiUrl);
		if(!response.ok){
			const errorData = await response.json();
      const errorReason = errorData?.error?.details[0]?.reason;
      switch (errorReason) {
        case 'API_KEY_INVALID':
					return { status: false, code:"API_KEY_INVALID", msg: 'Invalid API key. Please provide a valid API key.' }
        case 'QUOTA_EXCEEDED':
					return { status: false, code:"QUOTA_EXCEEDED", msg: 'Quota exceeded. Please try again later.' }
        default:
					return { status: false, code:errorReason, msg: errorData.error.message }
      }
		}

		const data = await response.json();
		return {status: true};
	} catch (error) {
		console.error('Error validating API Key:', error);
		return { status: false, code: "", msg: "Some error occurred"};
	}
}

export async function fetchChannelData(apiKey, channelId) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching channel data: ${response.statusText}`);
    }
    const data = await response.json();
    const channel = data.items[0];
    
    return {
			channelId,
      title: channel.snippet.title,
      profilePicture: channel.snippet.thumbnails.high.url,
      description: channel.snippet.description,
      subscriberCount: millify(channel.statistics.subscriberCount),
      videoCount: millify(channel.statistics.videoCount),
      viewCount: millify(channel.statistics.viewCount),
    };
  } catch (error) {
    console.error('Failed to fetch channel data', error);
    return null;
  }
}