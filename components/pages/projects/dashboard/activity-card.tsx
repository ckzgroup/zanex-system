import React from 'react';

interface ActivityCardProps {
    timeline?: string;
    title?: string;
    description?: string;
}

function ActivityCard({ timeline, title, description }: ActivityCardProps ) {
    return (
        <div className="space-y-1 px-3 border border-accent py-3 rounded-md">
            <h6 className="text-xs text-muted-foreground">{timeline}</h6>
            <h4 className="text-sm font-bold text-primary">{title}</h4>
            <p className="text-xs">{description}</p>
        </div>
    );
}

export default ActivityCard;