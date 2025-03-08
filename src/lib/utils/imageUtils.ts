export function getOptimizedAvatarUrl(url: string, size: number = 40): string {
  if (!url) return '';
  
  // Handle pravatar.cc URLs
  if (url.includes('pravatar.cc')) {
    // Extract the user parameter
    const userMatch = url.match(/\?u=([^&]+)/);
    const user = userMatch ? userMatch[1] : '';
    
    // Return optimized URL with correct size
    return `https://i.pravatar.cc/${size}?u=${user}`;
  }
  
  return url;
}

export function getAvatarImageProps(size: number = 40) {
  return {
    width: size,
    height: size,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    fetchpriority: 'low' as const,
  };
}

export function getFeaturedImageProps(isAboveFold: boolean = false) {
  return {
    loading: isAboveFold ? 'eager' as const : 'lazy' as const,
    decoding: 'async' as const,
    fetchpriority: isAboveFold ? 'high' as const : 'low' as const,
    width: 800,
    height: 600,
  };
}

export function getOptimizedImageUrl(url: string, width: number): string {
  if (!url) return '';
  
  // Handle assets.adept.magick.me URLs
  if (url.includes('assets.adept.magick.me')) {
    const filename = url.split('/').pop();
    const ext = filename?.split('.').pop();
    const name = filename?.replace(`.${ext}`, '');
    
    // Return optimized URL with correct size and WebP format
    return `https://assets.adept.magick.me/${name}-${width}.webp`;
  }
  
  return url;
} 