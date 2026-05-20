import { useQuery } from "@tanstack/react-query";

const useCombinedRequestData = (companyId: any) => {
    const request_url = `${process.env.NEXT_PUBLIC_API_URL}/company_request.php?company_id=${companyId}&request_status=all`;

    return useQuery({
        queryKey: ['combinedRequestData', companyId],
        queryFn: async () => {
            try {
                const res = await fetch(request_url);
                const companyRequestData = await res.json();

                // Extract `detailslist` and filter out any undefined values
                const requests = companyRequestData.detailslist?.filter((request: any) => request);

                // Fetch details for each request in parallel using Promise.all
                const detailedRequests = await Promise.all(
                    requests.map(async (request: any) => {
                        const detailURL = `${process.env.NEXT_PUBLIC_API_URL}/view_request_detail.php?request_id=${request.request_id}&request_type=${request.request_type}`;
                        const detailRes = await fetch(detailURL);
                        const requestDetails = await detailRes.json();

                        // Move the "details" content to the top level of each request
                        const transformedRequest = {
                            ...request,
                            ...requestDetails.detailslist[0], // Assuming there's only one detail, adjust if needed
                            details: undefined, // Remove the "details" key
                        };

                        return transformedRequest;
                    })
                );

                return detailedRequests;
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        },
        staleTime: 0, // Set staleTime to 0 to always refetch data
        // Optionally add other useQuery configuration options here
    });
};

export default useCombinedRequestData;
