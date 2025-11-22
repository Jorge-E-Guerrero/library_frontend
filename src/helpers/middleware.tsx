import axios from 'axios';
import env from '../config/env';


export function getStorage({ type, key }: { type: 'local' | 'session'; key: string }) {
    switch (type) {
        case 'local':
            return window.localStorage.getItem(key);
        case 'session':
            return window.sessionStorage.getItem(key);
        default:
            return null;
    }
}

export function setStorage({ type, key, value }: { type: 'local' | 'session'; key: string; value: string }) {
    switch (type) {
        case 'local':
            window.localStorage.setItem(key, value);
            break;
        case 'session':
            window.sessionStorage.setItem(key, value);
            break;
    }
}

export async function requestToApi({ method, path, payload, headers, addToken = true }: { method: string; path: string; payload?: any; headers?: any; addToken?: boolean }) : Promise<{ [key: string]: any }> {
    try {

        const apiUrl = env.API_URL ?? 'http://localhost:4000/api/v1/library';

        console.log("API URL:", apiUrl);

        let response: { data: any; status: number } = { data: null, status: 500 };

        if (!headers) {
            headers = { 'Content-Type': 'application/json' }
            if (addToken) {
                const token = getStorage({ type: 'local', key: 'token' });
                if (token) headers.Authorization = `Bearer ${token}`
            }
        }

        await axios({
            method,
            url: apiUrl?.concat(path) ?? '',
            data: payload,
            headers
        })
            .then(res => response = { ...res.data, status: res.status })
            .catch(err => response = err.response)

        if (!response || response.status >= 400) console.warn(`[API Request Error] ${method} ${path} - Status: ${response ? response.status : 'No Response'}`);

        return response

    } catch (error) {
        console.error(`[API Request Error] ${method} ${path}`, error);
        return { data: null, status: 500 };
    }
}