import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

interface FetchOptions {
    params?: any;
    data?: any;
    headers?: Record<string, string>;
    [key: string]: any;
}

const useFetch = <T = any>(
    url: string,
    method: string = "GET",
    options: FetchOptions = {}
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshIndex, setRefreshIndex] = useState(0);

    const optionsString = JSON.stringify(options);

    const requestOptions = useMemo(() => {
        const opts = { ...options };
        if (method === "POST" && !opts.data) {
            opts.data = {};
        }
        return opts;
    }, [method, optionsString]);

    useEffect(() => {
        const apiCall = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data: response } = await axios({
                    url,
                    method,
                    ...requestOptions,
                });

                if (!response.success) {
                    throw new Error(response.message);
                }

                setData(response.data as T);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        apiCall();
    }, [url, refreshIndex, requestOptions]);

    const reFetch = () => {
        setRefreshIndex((prev) => prev + 1);
    };

    return { data, loading, error, reFetch };
};

export default useFetch;
