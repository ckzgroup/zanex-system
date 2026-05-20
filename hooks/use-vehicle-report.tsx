import { useQuery } from "@tanstack/react-query";

const useVehicleRequest = (companyId: any) => {

    return useQuery({
        queryKey: ['combinedRequestData', companyId],
        queryFn: async () => {
            try {
                const URL_TRUE = `${process.env.NEXT_PUBLIC_API_URL}/view_vehicle.php?company_id=${companyId}&status=true`;
                const URL_FALSE = `${process.env.NEXT_PUBLIC_API_URL}/view_vehicle.php?company_id=${companyId}&status=false`;

                const resTrue = await fetch(URL_TRUE);
                const resFalse = await fetch(URL_FALSE);

                if (!resTrue.ok || !resFalse.ok) {
                    throw new Error(`Failed to fetch vehicles: ${!resTrue.ok ? resTrue.statusText : resFalse.statusText}`);
                }

                const dataTrue = await resTrue.json();
                const dataFalse = await resFalse.json();

                // Extract detailslist and filter out undefined values for both dataTrue and dataFalse
                const activeRequests = dataTrue.detailslist?.filter((request: any) => request);
                const inactiveRequests = dataFalse.detailslist?.filter((request: any) => request);

                // Fetch details for each request in parallel using Promise.all
                const detailedActiveRequests = await Promise.all(
                    activeRequests.map(async (request: any) => {
                        const detailURL = `${process.env.NEXT_PUBLIC_API_URL}/per_vehicle_cost.php?vehicle_id=${request.vehicle_id}`;
                        const detailRes = await fetch(detailURL);
                        const requestDetails = await detailRes.json();

                        // Move the "details" content to the top level and remove redundant key
                        const transformedRequest = {
                            ...request,
                            ...requestDetails.detailslist[0], // Assuming there's only one detail, adjust if needed
                            details: undefined,
                        };

                        return transformedRequest;
                    })
                );

                const detailedInactiveRequests = await Promise.all(
                    inactiveRequests.map(async (request: any) => {
                        const detailURL = `${process.env.NEXT_PUBLIC_API_URL}/per_vehicle_cost.php?vehicle_id=${request.vehicle_id}`;
                        const detailRes = await fetch(detailURL);
                        const requestDetails = await detailRes.json();

                        // Move the "details" content to the top level and remove redundant key
                        const transformedRequest = {
                            ...request,
                            ...requestDetails.detailslist[0], // Assuming there's only one detail, adjust if needed
                            details: undefined,
                        };

                        return transformedRequest;
                    })
                );

                // Combine transformed requests from both active and inactive data
                const allRequests = [...detailedActiveRequests, ...detailedInactiveRequests];

                return allRequests;
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        },
        staleTime: 0, // Set staleTime to 0 to always refetch data
        // Optionally add other useQuery configuration options here
    });
};

export default useVehicleRequest;
