import React from 'react';

interface ActivityCardProps {
    timeline?: string;
    title?: string;
    description?: string;
    technician?: string;
}

function ActivityCard({ timeline, title, description, technician }: ActivityCardProps ) {
    return (
        <div className="space-y-1 px-3 border border-accent py-3 rounded-md">
            <div className="flex items-center justify-between">
                <h6 className="text-xs text-muted-foreground">{timeline}</h6>
                {technician && (
                    <h6 className="text-xs text-muted-foreground">Updated by: <span
                        className="text-foreground font-bold">{technician}</span></h6>
                )}
            </div>
            <h4 className="text-sm font-bold text-primary">{title}</h4>
            <p className="text-xs">{description}</p>
        </div>
    );
}

export default ActivityCard;