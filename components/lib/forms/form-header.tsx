import React from 'react';

interface FormHeaderInterface {
    title: string;
    subtitle: string;
}
function FormHeader({ title, subtitle }: FormHeaderInterface) {
    return (
        <div>
            <div className='mb-8 space-y-2'>
                <h1 className='text-2xl font-bold font-heading'> {title} </h1>
                <p className='text-muted-foreground'>{subtitle}</p>
            </div>
        </div>
    );
}

export default FormHeader;