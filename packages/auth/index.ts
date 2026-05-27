export interface SkyBranceConfig {
    apiKeyId?: string;
    apiKeySecret?: string;
    environment?: 'production' | 'development';
    customDomain?: string;
    version?: string;
}

export interface VerifyResponse {
    status: string;
    message: string;
    isValid: boolean;
}

export class SkyBranceClient {
    private apiKeyId: string;
    private apiKeySecret: string;
    public baseUrl: string;
    public version: string;

    constructor(config: SkyBranceConfig) {
        if (!config.apiKeyId || !config.apiKeySecret) {
            throw new Error("SkyBrance: apiKeyId and apiKeySecret are required.");
        }

        this.apiKeyId = config.apiKeyId;
        this.apiKeySecret = config.apiKeySecret;
        this.version = config.version || 'v1.0.0';

        if (config.customDomain) {
            this.baseUrl = config.customDomain;
        } else if (config.environment === 'development') {
            this.baseUrl = 'http://localhost:15000/api-user';
        } else {
            this.baseUrl = 'https://api.skybrance.com/api-user';
        }
    }

    public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}/${this.version}${endpoint}`;

        const headers = new Headers(options.headers);
        headers.set('Content-Type', 'application/json');
        headers.set('X-USER-API-KEY-ID', this.apiKeyId);
        headers.set('X-USER-API-KEY-SECRET', this.apiKeySecret);

        const response = await fetch(url, { ...options, headers }).catch((error) => {
            throw new Error(`SkyBrance: API Request Failed: ${error.message || "Unable to connect to API"}`);
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const backendMessage = errorData.message || response.statusText;

            if (response.status === 401) {
                throw new Error(`SkyBrance: Unauthorized: ${backendMessage}`);
            }

            if (response.status === 403) {
                throw new Error(`SkyBrance: Forbidden: ${backendMessage}`);
            }

            throw new Error(`SkyBrance: API Error [${response.status}]: ${backendMessage}`);
        }

        return await response.json() as T;
    }

    public async verify() {
        const data = await this.request<VerifyResponse>('/check', {
            method: 'GET'
        });

        if (!data.isValid) {
            throw new Error(`SkyBrance: API credentials verification failed - ${data.message}`);
        }
        console.log('SkyBrance: API credentials are verified.');
        return data;
    }
}