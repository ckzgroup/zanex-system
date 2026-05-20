"use client";

import React, {useRef, useState} from 'react';

import { z } from 'zod';

import {usePathname, useRouter} from "next/navigation";

import ProjectLayout from "@/components/pages/projects/projects/project-layout";
import {useSingleProject} from "@/actions/get-project";
import FileCard from "@/components/pages/projects/projects/file-card";


// Define your icons
const FileIcons = {
    pdf: (
        <svg id="file-pdf" className="w-28 h-28 text-red-500 dark:text-white" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
             viewBox="0 0 24 24">
            <path fill-rule="evenodd"
                  d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z"
                  clip-rule="evenodd"/>
        </svg>
    ),
    docx: (
        <svg id="file-word" className="w-28 h-28 text-blue-500 dark:text-white" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
             viewBox="0 0 24 24">
            <path fill-rule="evenodd"
                  d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-1.02 4.804a1 1 0 1 0-1.96.392l1 5a1 1 0 0 0 1.838.319L12 15.61l1.143 1.905a1 1 0 0 0 1.838-.319l1-5a1 1 0 0 0-1.962-.392l-.492 2.463-.67-1.115a1 1 0 0 0-1.714 0l-.67 1.116-.492-2.464Z"
                  clip-rule="evenodd"/>
        </svg>
    ),
    image: (
        <svg id="file-image" className="w-28 h-28 text-gray-600 dark:text-white" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
             viewBox="0 0 24 24">
            <path fill-rule="evenodd"
                  d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm.394 9.553a1 1 0 0 0-1.817.062l-2.5 6A1 1 0 0 0 8 19h8a1 1 0 0 0 .894-1.447l-2-4A1 1 0 0 0 13.2 13.4l-.53.706-1.276-2.553ZM13 9.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                  clip-rule="evenodd"/>
        </svg>
    ),
    csv: (
        <svg id="file-csv" className="w-24 h-28 text-green-500 dark:text-white" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
             viewBox="0 0 24 24">
            <path fill-rule="evenodd"
                  d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm1.018 8.828a2.34 2.34 0 0 0-2.373 2.13v.008a2.32 2.32 0 0 0 2.06 2.497l.535.059a.993.993 0 0 0 .136.006.272.272 0 0 1 .263.367l-.008.02a.377.377 0 0 1-.018.044.49.49 0 0 1-.078.02 1.689 1.689 0 0 1-.297.021h-1.13a1 1 0 1 0 0 2h1.13c.417 0 .892-.05 1.324-.279.47-.248.78-.648.953-1.134a2.272 2.272 0 0 0-2.115-3.06l-.478-.052a.32.32 0 0 1-.285-.341.34.34 0 0 1 .344-.306l.94.02a1 1 0 1 0 .043-2l-.943-.02h-.003Zm7.933 1.482a1 1 0 1 0-1.902-.62l-.57 1.747-.522-1.726a1 1 0 0 0-1.914.578l1.443 4.773a1 1 0 0 0 1.908.021l1.557-4.773Zm-13.762.88a.647.647 0 0 1 .458-.19h1.018a1 1 0 1 0 0-2H6.647A2.647 2.647 0 0 0 4 13.647v1.706A2.647 2.647 0 0 0 6.647 18h1.018a1 1 0 1 0 0-2H6.647A.647.647 0 0 1 6 15.353v-1.706c0-.172.068-.336.19-.457Z"
                  clip-rule="evenodd"/>
        </svg>
    ),
    default: (
        <svg className="w-28 h-28 text-gray-500 dark:text-white cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zM13 9V3.5L18.5 9H13z" />
        </svg>
    ),
};


// Function to get the appropriate icon
const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return FileIcons.default;

    if (["jpg", "jpeg", "png", "gif", "csv"].includes(extension)) return FileIcons.image;
    if (["pdf"].includes(extension)) return FileIcons.pdf;
    if (["doc", "docx"].includes(extension)) return FileIcons.docx;

    return FileIcons.default;
};


function ProjectDocumentsPage() {

    // Project ID
    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));


    // Get Documents
    const { isLoading:docLoading, error:docError, data:docData } = useSingleProject('/project/getProject', project_id)

    const project = Array.isArray(docData) && docData.length > 0 ? docData[0] : null;

    const documentFields = [
        { key: "project_po_file", title: "PO File" },
        { key: "project_ehs_file", title: "EHS File" },
        { key: "project_permit", title: "Permit" },
        { key: "project_design", title: "Design" },
        { key: "project_certificate_of_workers", title: "Certificate of Workers" }
    ];

    const documents = project
        ? documentFields
            .map(({ key, title }) => project[key] && { file_name: project[key], file_title: title })
            .filter(Boolean)
        : [];


    const FILES = process.env.NEXT_PUBLIC_IMAGES + '/projectFiles';

    const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

    const handleDownload = (fileUrl: string, fileName: string, openInNewWindow: boolean = true) => {
        if (openInNewWindow) {
            // Open the file in a new window/tab
            window.open(fileUrl, '_blank');
        } else {
            // Trigger file download
            if (downloadLinkRef.current) {
                downloadLinkRef.current.href = fileUrl;
                downloadLinkRef.current.download = fileName;
                downloadLinkRef.current.click();
            }
        }
    };


    return (
        <ProjectLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-1 bg-primary rounded-full"/>
                        <h4 className="text-primary text-lg font-bold tracking-wide"> Project Files </h4>
                    </div>


                </div>

                {/*  File Card  */}

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                    {/* Hidden link for triggering downloads */}
                    <a ref={downloadLinkRef} style={{ display: 'none' }} />

                    {documents.map((document, index) => (
                        <FileCard key={index} title={document.file_title}>
                            <div
                                onClick={() => {
                                    const fileUrl = `${FILES}/${document.file_name}`;
                                    handleDownload(fileUrl, document.file_name);
                                }}
                                className="hover:cursor-pointer"
                            >
                                {getFileIcon(document.file_name)}
                            </div>
                        </FileCard>
                    ))}

                </div>

            </div>
        </ProjectLayout>
    );
}

export default ProjectDocumentsPage;