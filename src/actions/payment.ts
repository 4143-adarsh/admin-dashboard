
async function fetchWithToken(url: string, options: RequestInit = {}) {
    const token = cookies().get('admin_token')?.value;
    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', "Bearer " + token);
    }
    return fetch(url, { ...options, headers });
}

