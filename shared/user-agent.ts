// Bing UA
// Android
//      Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TQ3A.230901.001; ) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.0.0 Mobile Safari/537.36 BingSapphire/27.3.360000301
// iOS
//      Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410307001
export function isBingApp(ua: string): boolean {
    return /\bBingSapphire\b/.test(ua);
}

// Start UA
// Android
//      Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TQ3A.230901.001; ) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.0.0 Mobile Safari/537.36 NewsSapphire/27.3.360000301
// iOS
//      Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/605.1.15 NewsSapphire/1.0.410307001

export function isStartApp(ua: string): boolean {
    return /\bNewsSapphire\b/.test(ua);
}

// Edge UA
// Windows
//      Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.61
// Andorid
//      Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36 Edg/118.0.0.0
export function isEdge(ua: string): boolean {
    return /\bEdg\b/.test(ua);
}

export function isEdgeMobile(ua: string): boolean {
    return isEdge(ua) && /\bMobile\b/.test(ua);
}

export type Browser
    = 'Edge' // Edge desktop
    | 'EdgeMobile'
    | 'BingApp'
    | 'StartApp'
    | 'Others';

export function detectBrowser(ua: string): Browser {
    return (
        isEdgeMobile(ua) ? 'EdgeMobile' :
        isEdge(ua) ? 'Edge' :
        isBingApp(ua) ? 'BingApp' :
        isStartApp(ua) ? 'StartApp' :
        'Others'
    );
}

export function isBrowserUnsupported(browser: Browser): boolean {
    // return browser === 'Others' || browser === 'Edge';
    return false;
}