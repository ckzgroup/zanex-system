import {useQuery} from "@tanstack/react-query";

function useTotalAmount(request: string, companyId: any) {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/company_cost.php?company_id=${companyId}&title=${request}`;

    const { isLoading: isPending, error, data } = useQuery({
        queryKey: ['userDetails', request, companyId],
        queryFn: async () => {
            try {
                const res = await fetch(URL);
                const responseData = await res.json();

                // Extract required fields from the response
                const { total } = responseData;

                const amountDetails =  total ;

                return amountDetails;
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error; // Re-throw to allow useQuery to handle it
            }
        },
    });

    return { isPending, error, data }; // Return driver data or null if not found
}

export default useTotalAmount;
