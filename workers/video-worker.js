export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  }
};

// Podcast handling
async function handlePodcastRequest(request, env) {
  const url = new URL(request.url);
  const assetPath = url.pathname.replace('/podcast/', '/adept-podcasts/');
  
  // Parse client capabilities
  const clientInfo = {
    isMobile: request.headers.get('sec-ch-ua-mobile') === '?1',
    connection: request.headers.get('ect') || '4g',
    downlink: parseFloat(request.headers.get('downlink') || '10'),
    saveData: request.headers.get('save-data') === 'on',
    supportsAAC: request.headers.get('accept')?.includes('audio/aac') || false
  };

  // Determine optimal format
  const format = determineAudioFormat(clientInfo);
  
  // Get episode with proper format
  const finalPath = adjustAudioPath(assetPath, format);
  const response = await env.BUCKET.get(finalPath);
  
  if (!response) {
    // Try fallback to original quality
    const fallbackResponse = await env.BUCKET.get(assetPath);
    if (!fallbackResponse) {
      return new Response('Episode not found', { 
        status: 404,
        headers: corsHeaders()
      });
    }
    return handleAudioResponse(fallbackResponse, request, format);
  }

  // Track analytics
  await trackPodcastAnalytics(request, format, env);
  
  return handleAudioResponse(response, request, format);
}

function determineAudioFormat(clientInfo) {
  // Base format selection on connection and device
  const format = {
    codec: clientInfo.supportsAAC ? 'aac' : 'mp3',
    bitrate: '256k'
  };

  // Adjust for mobile/connection
  if (clientInfo.isMobile || clientInfo.saveData) {
    format.bitrate = clientInfo.connection === '4g' ? '192k' : '128k';
  }

  // Adjust for poor connection
  if (clientInfo.downlink < 1.5) {
    format.bitrate = '128k';
  }

  return format;
}

function adjustAudioPath(path, format) {
  // Remove any existing quality indicators
  const basePath = path.replace(/_[0-9]+k\.(mp3|aac)$/, '');
  
  // Add new quality/format
  return `${basePath}_${format.bitrate}.${format.codec}`;
}

async function handleAudioResponse(response, request, format) {
  const headers = new Headers(response.headers);
  
  // Set proper headers
  Object.entries(corsHeaders()).forEach(([key, value]) => headers.set(key, value));
  headers.set('Cache-Control', 'public, max-age=31536000');
  headers.set('Content-Type', format.codec === 'aac' ? 'audio/aac' : 'audio/mpeg');
  
  // Add format info for clients
  headers.set('X-Audio-Bitrate', format.bitrate);
  headers.set('X-Audio-Codec', format.codec);
  
  // Handle range requests for seeking
  if (request.headers.has('range')) {
    headers.set('Accept-Ranges', 'bytes');
    const range = request.headers.get('range');
    const bytes = range.replace('bytes=', '').split('-');
    const start = parseInt(bytes[0]);
    const end = bytes[1] ? parseInt(bytes[1]) : response.size - 1;
    
    headers.set('Content-Range', `bytes ${start}-${end}/${response.size}`);
    headers.set('Content-Length', (end - start + 1).toString());
    
    return new Response(response.slice(start, end + 1), {
      status: 206,
      headers
    });
  }
  
  return new Response(response.body, { headers });
}

async function trackPodcastAnalytics(request, format, env) {
  const url = new URL(request.url);
  const episodeId = url.pathname.split('/').pop();
  
  const analytics = {
    timestamp: Date.now(),
    episodeId,
    format: format.codec,
    bitrate: format.bitrate,
    userAgent: request.headers.get('user-agent'),
    country: request.headers.get('cf-ipcountry'),
    device: request.headers.get('sec-ch-ua-mobile') === '?1' ? 'mobile' : 'desktop',
    connection: request.headers.get('ect') || '4g'
  };

  // Store analytics (you can customize this)
  console.log('Podcast analytics:', analytics);
}

// Existing video handling code...
async function handleVideoRequest(request, env) {
  const url = new URL(request.url);
  const assetPath = url.pathname.replace('/videos/', '/adept-videos/');
  
  // Rest of your existing video handling code...
}

// Enhanced helper functions
function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = ['https://adept.magick.me', 'http://localhost:5173', 'http://localhost:4173'];
  
  // Check if the request origin is in our allowed list
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Range',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function calculateBandwidthLimit(hints) {
  // Base limits (in Mbps)
  const limits = {
    'slow-2g': 0.1,
    '2g': 0.2,
    '3g': 1.0,
    '4g': 5.0,
    '5g': 10.0
  };

  // Adjust for save-data mode
  if (hints.saveData) return Math.min(limits[hints.ect] || 1.0, 0.5);

  // Adjust for mobile devices
  const mobileFactor = hints.device === 'mobile' ? 0.7 : 1.0;

  // Calculate based on network conditions
  const baseLimit = limits[hints.ect] || 1.0;
  const adjustedLimit = baseLimit * mobileFactor;

  // Factor in current connection speed
  return Math.min(adjustedLimit, hints.downlink);
}

function determineQuality(hints, bandwidthLimit) {
  if (hints.saveData || bandwidthLimit < 0.5) return 'low';
  if (bandwidthLimit >= 5 && hints.ect === '4g' && hints.rtt < 100) return 'high';
  if (bandwidthLimit >= 2 && hints.ect !== 'slow-2g') return 'medium';
  return 'low';
}

function adjustPathForQuality(path, quality) {
  if (quality === 'low') return path.replace('.mp4', '_small.mp4').replace('.webm', '_small.webm');
  if (quality === 'medium') return path;
  return path.replace('_small', '');
}

async function getOptimizedVideo(path, env, quality, bandwidthLimit) {
  const response = await env.BUCKET.get(path);
  if (!response) return null;

  // Check if we need to compress
  if (needsCompression(response, quality, bandwidthLimit)) {
    return compressVideo(response, bandwidthLimit);
  }

  return response;
}

function needsCompression(response, quality, bandwidthLimit) {
  const contentLength = parseInt(response.headers.get('content-length') || '0');
  const durationHeader = response.headers.get('x-video-duration');
  if (!contentLength || !durationHeader) return false;

  const duration = parseFloat(durationHeader);
  const currentBitrate = (contentLength * 8) / (duration * 1024 * 1024); // Mbps

  return currentBitrate > bandwidthLimit;
}

async function compressVideo(response, targetBitrate) {
  // Create a TransformStream for compression
  const compressionStream = new TransformStream({
    transform(chunk, controller) {
      // Implement compression logic here
      // This is a simplified version - real implementation would use WebAssembly
      const compressionRatio = targetBitrate / 10; // Example ratio
      const compressedChunk = chunk.slice(0, Math.ceil(chunk.length * compressionRatio));
      controller.enqueue(compressedChunk);
    }
  });

  return new Response(response.body.pipeThrough(compressionStream), {
    headers: response.headers
  });
}

async function handleThumbnailRequest(videoPath, env, timestamp) {
  const cacheKey = `thumbnail:${videoPath}:${timestamp}`;
  
  // Check if thumbnail exists
  const thumbnail = await env.BUCKET.get(`${videoPath}.thumb.${timestamp}.jpg`);
  if (thumbnail) {
    const headers = new Headers(thumbnail.headers);
    headers.set('Content-Type', 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000');
    return new Response(thumbnail.body, { headers });
  }

  // Return a default thumbnail or error
  return new Response('Thumbnail not found', { 
    status: 404,
    headers: corsHeaders()
  });
}

function getCacheHeaders(fileType) {
  const ONE_YEAR = 31536000;
  const ONE_DAY = 86400;
  
  const headers = new Headers();
  headers.set('Cache-Control', 'public');
  
  // Set different cache durations based on file type
  switch(fileType) {
    case 'video':
      headers.set('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`);
      break;
    case 'image':
      headers.set('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`);
      break;
    case 'avatar':
      // Cache avatars for less time since they might change
      headers.set('Cache-Control', `public, max-age=${ONE_DAY * 7}, stale-while-revalidate=${ONE_DAY}`);
      break;
    default:
      headers.set('Cache-Control', `public, max-age=${ONE_YEAR}, immutable`);
  }
  
  return headers;
}

async function handleResponse(response, request, bandwidthLimit) {
  const url = new URL(request.url);
  const ext = url.pathname.split('.').pop()?.toLowerCase();
  
  // Determine file type
  let fileType = 'default';
  if (['mp4', 'webm'].includes(ext)) fileType = 'video';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) fileType = 'image';
  if (url.hostname.includes('pravatar.cc')) fileType = 'avatar';
  
  // Get appropriate cache headers
  const headers = getCacheHeaders(fileType);
  
  // Copy existing headers
  for (const [key, value] of response.headers.entries()) {
    if (!headers.has(key)) headers.set(key, value);
  }
  
  // Add CORS headers
  Object.entries(corsHeaders()).forEach(([key, value]) => headers.set(key, value));
  
  // Handle range requests for videos
  if (request.headers.has('range') && fileType === 'video') {
    headers.set('Accept-Ranges', 'bytes');
    const range = request.headers.get('range');
    const bytes = range.replace('bytes=', '').split('-');
    const start = parseInt(bytes[0]);
    const end = bytes[1] ? parseInt(bytes[1]) : response.size - 1;
    
    const chunkSize = Math.min(end - start + 1, bandwidthLimit * 1024 * 1024 / 8);
    const newEnd = start + chunkSize - 1;
    
    headers.set('Content-Range', `bytes ${start}-${newEnd}/${response.size}`);
    headers.set('Content-Length', chunkSize.toString());
    
    return new Response(response.slice(start, newEnd + 1), {
      status: 206,
      headers
    });
  }
  
  // Set content type
  if (ext === 'mp4') headers.set('Content-Type', 'video/mp4');
  if (ext === 'webm') headers.set('Content-Type', 'video/webm');
  if (ext === 'webp') headers.set('Content-Type', 'image/webp');
  if (ext === 'jpg' || ext === 'jpeg') headers.set('Content-Type', 'image/jpeg');
  if (ext === 'png') headers.set('Content-Type', 'image/png');
  
  return new Response(response.body, { headers });
}

async function handleImageRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Extract size from filename (e.g., image-800.webp)
  const match = path.match(/(.+)-(\d+)\.webp$/);
  if (!match) {
    return new Response('Invalid image URL', { status: 400 });
  }
  
  const [, basePath, width] = match;
  const originalKey = `${basePath}.webp`;
  
  // Check if optimized version exists
  const cacheKey = `${path}:${width}`;
  const cachedImage = await env.BUCKET.get(cacheKey);
  if (cachedImage) {
    const headers = getCacheHeaders('image');
    headers.set('Content-Type', 'image/webp');
    return new Response(cachedImage.body, { headers });
  }
  
  // Get original image
  const originalImage = await env.BUCKET.get(originalKey);
  if (!originalImage) {
    return new Response('Image not found', { status: 404 });
  }
  
  // Resize image using Cloudflare's image resizing
  const resizedImage = await fetch(`https://images.adept.magick.me${path}`, {
    cf: {
      image: {
        width: parseInt(width),
        fit: 'cover',
        format: 'webp',
        quality: 85
      }
    }
  });
  
  // Cache the resized image
  await env.BUCKET.put(cacheKey, resizedImage.body, {
    expirationTtl: 31536000 // 1 year
  });
  
  const headers = getCacheHeaders('image');
  headers.set('Content-Type', 'image/webp');
  return new Response(resizedImage.body, { headers });
}

async function handleRequest(request, env) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders(request)
    });
  }

  const url = new URL(request.url);
  
  try {
    // Check if this is a preload request
    const isPreload = request.headers.get('Purpose') === 'prefetch' || 
                     request.headers.get('Sec-Purpose') === 'prefetch' ||
                     request.headers.get('Sec-Fetch-Dest') === 'video' ||
                     request.headers.get('As') === 'video';

    // Handle different types of requests
    let response;
    if (url.pathname.endsWith('.webm') || url.pathname.endsWith('.mp4')) {
      response = await handleVideoRequest(request, env);
    } else if (url.pathname.endsWith('.webp')) {
      response = await handleImageRequest(request, env);
    } else {
      // Get the object from R2
      const object = await env.BUCKET.get(url.pathname.slice(1));
      
      if (!object) {
        return new Response('Object not found', { 
          status: 404,
          headers: corsHeaders(request)
        });
      }

      // Add CORS headers to the response
      const headers = new Headers(object.httpMetadata?.headers || {});
      Object.entries(corsHeaders(request)).forEach(([key, value]) => headers.set(key, value));
      
      // Set appropriate cache headers
      if (isPreload) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
      
      response = new Response(object.body, { headers });
    }

    // Ensure CORS headers are present in the final response
    const finalHeaders = new Headers(response.headers);
    Object.entries(corsHeaders(request)).forEach(([key, value]) => {
      if (!finalHeaders.has(key)) {
        finalHeaders.set(key, value);
      }
    });

    return new Response(response.body, {
      status: response.status,
      headers: finalHeaders
    });

  } catch (error) {
    console.error('Error handling request:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: corsHeaders(request)
    });
  }
}

// Update video request handler to include CORS headers
async function handleVideoRequest(request, env) {
  // ... existing video handling code ...
  const headers = new Headers();
  Object.entries(corsHeaders(request)).forEach(([key, value]) => headers.set(key, value));
  
  // Add other necessary headers
  headers.set('Content-Type', 'video/webm');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  
  return new Response(videoStream, { headers });
}
