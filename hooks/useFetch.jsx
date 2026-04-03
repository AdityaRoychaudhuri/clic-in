import { useState } from "react"
import { toast } from "sonner";

const useFetch = (fetchFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (...args) => {
        try {
            setLoading(true);
            setError(null);
    
            const data = await fetchFunction(...args);

            setData(data);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return {
        data,
        loading,
        error,
        fetchData,
        setData
    }
}

export default useFetch;