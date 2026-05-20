import { useState } from 'react';

export const useFullscreen = (): [boolean, () => void] => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if ((document.documentElement as any).mozRequestFullScreen) { // Firefox
                (document.documentElement as any).mozRequestFullScreen();
            } else if ((document.documentElement as any).webkitRequestFullscreen) { // Chrome, Safari and Opera
                (document.documentElement as any).webkitRequestFullscreen();
            } else if ((document.documentElement as any).msRequestFullscreen) { // IE/Edge
                (document.documentElement as any).msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if ((document as any).mozCancelFullScreen) { // Firefox
                (document as any).mozCancelFullScreen();
            } else if ((document as any).webkitExitFullscreen) { // Chrome, Safari and Opera
                (document as any).webkitExitFullscreen();
            } else if ((document as any).msExitFullscreen) { // IE/Edge
                (document as any).msExitFullscreen();
            }
        }

        setIsFullscreen(!isFullscreen);
    };

    return [isFullscreen, toggleFullscreen];
};
