export const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
};


export const formatTimeDifference = (diffInMilliseconds: any) => {
    const diffInMinutes = Math.floor(diffInMilliseconds / 60000); // Convert to minutes
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
};

// utils/dateUtils.ts

export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short', // Mon
        year: 'numeric', // 2024
        month: 'short', // Aug
        day: 'numeric', // 12
        hour: '2-digit', // 11
        minute: '2-digit', // 26
        second: '2-digit', // 24
        timeZoneName: 'short', // GMT+0300
    };

    return date.toLocaleDateString('en-US', options);
};
