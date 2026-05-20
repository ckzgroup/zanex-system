"use client";

import React, {useState} from 'react';
import Sidebar from "@/components/layouts/services/sidebar";
import Header from "@/components/layouts/projects/header";

interface RootLayoutProps {
    children: React.ReactNode
}

function Index({ children }: RootLayoutProps) {
    const [showLinks, setShowLinks] = useState(true);

    const toggleSidebar = () => {
        setShowLinks(!showLinks);
    };

    const sidebarWidth = showLinks ? 'w-64' : 'w-18';
    return (
        <main>
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className='h-screen sticky top-0'>
                    <Sidebar showLinks={showLinks} sidebarWidth={sidebarWidth} />
                </div>

                <div className=" flex-grow bg-background">
                    {/* Header */}
                    <div className='sticky top-0 z-50'>
                        <Header toggleSidebar={toggleSidebar} />
                    </div>

                    {/* Main content */}
                    <div className='p-8 w-full flex-1'>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Index;