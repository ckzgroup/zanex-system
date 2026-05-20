// utils/deviceInfo.ts
export interface BrowserInfo {
    name: string;
    version: string;
}

export interface DeviceInfo {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    isMobile: boolean;
    isDesktop: boolean;
    browser: BrowserInfo;
    deviceId?: string
}

export const getDeviceInfo = (): DeviceInfo => {
    if (typeof window !== 'undefined') {
        const { userAgent } = window.navigator;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;

        return {
            userAgent,
            screenWidth,
            screenHeight,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isDesktop: screenWidth >= 1024,
            browser: {
                name: detectBrowser(userAgent),
                version: detectBrowserVersion(userAgent),
            },
        };
    }

    return {} as DeviceInfo;
};

const detectBrowser = (userAgent: string): string => {
    // Implement browser detection logic
    if (/Chrome/.test(userAgent)) return 'Chrome';
    if (/Firefox/.test(userAgent)) return 'Firefox';
    if (/Safari/.test(userAgent)) return 'Safari';
    if (/Edg/.test(userAgent)) return 'Edge';

    return 'Unknown';
};

const detectBrowserVersion = (userAgent: string): string => {
    // Implement logic to extract browser version
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edg)\/([\d.]+)/);
    return match ? match[2] : 'Unknown';
};
