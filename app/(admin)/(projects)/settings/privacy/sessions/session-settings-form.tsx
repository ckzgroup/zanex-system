"use client";

import { ChatCenteredText, DeviceMobileCamera, X, GoogleChromeLogo } from "@phosphor-icons/react"

export function SessionSettingsForm() {

    return (
        <div className='flex flex-col space-y-4'>
            <div className={`flex flex-row items-center justify-between rounded-lg border p-5 `}>
                <div className='flex space-x-4 items-center'>
                    <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                        <ChatCenteredText weight="duotone" className="h-6 w-6"/>
                    </div>
                    <div className="space-y-0.5">
                        <h5 className={`text-base font-semibold `}>
                            Macbook Pro <span className='text-sm text-muted-foreground font-medium'>(15 mins ago)</span>
                        </h5>
                        <p className='text-sm text-muted-foreground'>
                            Nairobi, Kenya
                        </p>
                    </div>
                </div>
                <div>
                    <X weight="bold" className='h-5 w-5'/>
                </div>
            </div>


            <div className={`flex flex-row items-center justify-between rounded-lg border p-5 `}>
                <div className='flex space-x-4 items-center'>
                    <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                        <DeviceMobileCamera weight="duotone" className="h-6 w-6"/>
                    </div>
                    <div className="space-y-0.5">
                        <h5 className={`text-base font-semibold `}>
                            iPhone X <span className='text-sm text-muted-foreground font-medium'>(22 hours ago)</span>
                        </h5>
                        <p className='text-sm text-muted-foreground'>
                            Nairobi, Kenya
                        </p>
                    </div>
                </div>
                <div>
                    <X weight="bold" className='h-5 w-5'/>
                </div>
            </div>


            <div className={`flex flex-row items-center justify-between rounded-lg border p-5 `}>
                <div className='flex space-x-4 items-center'>
                    <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                        <GoogleChromeLogo weight="duotone" className="h-6 w-6"/>
                    </div>
                    <div className="space-y-0.5">
                        <h5 className={`text-base font-semibold `}>
                            Google Chrome <span className='text-sm text-muted-foreground font-medium'>((8 days ago))</span>
                        </h5>
                        <p className='text-sm text-muted-foreground'>
                            Nairobi, Kenya
                        </p>
                    </div>
                </div>
                <div>
                    <X weight="bold" className='h-5 w-5'/>
                </div>
            </div>

        </div>
    )
}
