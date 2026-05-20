"use client";

import React from 'react';
import {Circles, RotatingTriangles} from "react-loader-spinner";

function Loading() {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <RotatingTriangles
                height="140"
                width="140"
                ariaLabel="rotating-triangles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
}

export default Loading;