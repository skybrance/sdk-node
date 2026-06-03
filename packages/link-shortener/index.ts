import type { SkyBranceClient } from '@skybrance/auth';

export interface CreateLinkParams {
    url: string;
    alias?: string;
    expiry?: string | Date;
    isPasswordProtected?: boolean;
    password?: string;
    title?: string;
    description?: string;
    expiryTitle?: string;
    expiryMessage?: string;
    expiryUrl?: string;
}

/*
 * Parameters for updating an existing link.
 * All fields are optional, but at least one field must be provided.
 * Comment by SkyBrance.
*/
export interface UpdateLinkParams {
    url?: string;
    alias?: string;
    expiry?: string | Date;
    isPasswordProtected?: boolean;
    password?: string;
    title?: string;
    description?: string;
    expiryTitle?: string;
    expiryMessage?: string;
    expiryUrl?: string;
}

/**
 * Filter and pagination query parameters for fetching lists of links.
 */
export interface ListLinksFilters {
    page?: number;
    limit?: number;
    search?: string; // Searches across 'originalUrl' | 'shortCode' | 'title'
    isPasswordProtected?: boolean;
    minimumclicks?: number;
}

export interface CollaboratorData {
    email: string;
    role: 'owner' | 'editor' | 'viewer' | string;
    status: 'pending' | 'accepted' | string;
    addedAt: string;
    _id: string;
}

export interface ShortLinkData {
    _id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    user: string | null;
    isOrganization: boolean;
    organization: string | null;
    expiryDate: string | null;
    isExpired: boolean;
    transferHolderEmail: string | null;
    isPasswordProtected: boolean;
    hashedPassword: string | null;
    title: string | null;
    description: string | null;
    imageUrl: string | null;
    createdFrom: string | null;
    expiryTitle: string | null;
    expiryMessage: string | null;
    expiryUrl: string | null;
    clicks: number;
    collaborators: CollaboratorData[];
    createdAt: string;
    updatedAt: string;
    isCompanyService?: boolean;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface LinkResponse {
    status: string;
    message: string;
    data: ShortLinkData;
}

/**
 * The unified return layout for multi-link queries.
 */
export interface PaginatedLinkResponse {
    status: string;
    message: string;
    data: ShortLinkData[];
    pagination: PaginationMeta;
}

export interface LinkAnalyticsBreakdownItem {
    [key: string]: string | number;
}

export interface LinkAnalytics {
    totalClicks: number;
    totalHumanClicks: number;
    totalBotClicks: number;
    avgClicksPerDay: string;
    avgHumanClicksPerDay: string;
    avgPurity: string;
    uniqueDevices: number;
    uniqueLocations: number;
    uniqueOs: number;
    uniqueReferrers: number;
    uniqueLanguages: number;
    deviceBreakdown: LinkAnalyticsBreakdownItem[];
    locationBreakdown: LinkAnalyticsBreakdownItem[];
    osBreakdown: LinkAnalyticsBreakdownItem[];
    dateOfLastClick: string | null;
    deviceOfLastClick: string | null;
    osOfLastClick: string | null;
    locationOfLastClick: string | null;
    referrerList: LinkAnalyticsBreakdownItem[];
    languageList: LinkAnalyticsBreakdownItem[];
}

export interface LinkGraphDataPoint {
    date: string;
    count: number;
}

export interface LinkByIdData {
    link: ShortLinkData;
    shortLink: string;
    analytics: LinkAnalytics;
    graphData: LinkGraphDataPoint[];
}

export interface LinkByIdResponse {
    status: string;
    message: string;
    data: LinkByIdData;
}

export interface OgImageUploadParams {
    contentType: string;
}

export interface OgImageUploadData {
    uploadUrl: string;
    publicUrl: string;
}

export interface OgImageUploadResponse {
    status: string;
    message: string;
    data: OgImageUploadData;
}

export interface DeleteLinkResponse {
    status: string;
    message: string;
    data: unknown;
}

export class SkyBranceLinkShortener {
    private client: SkyBranceClient;

    constructor(client: SkyBranceClient) {
        this.client = client;
    }

    /**
     * Creates a new shortened link.
     * Comment by SkyBrance.
    */
    public async create(params: CreateLinkParams): Promise<ShortLinkData> {
        if (!params.url) {
            throw new Error("SkyBrance: 'url' is required to create a link.");
        }

        if (params.isPasswordProtected && !params.password) {
            throw new Error("SkyBrance: 'password' is required when 'isPasswordProtected' is true.");
        } else if (params.isPasswordProtected && params.password && params.password.length < 4) {
            throw new Error("SkyBrance: 'password' must be at least 4 characters long.");
        }

        const res = await this.client.request<LinkResponse>('/link-shortener', {
            method: 'POST',
            body: JSON.stringify({
                url: params.url,
                alias: params.alias,
                expiry: params.expiry,
                isPasswordProtected: params.isPasswordProtected || false,
                password: params.isPasswordProtected ? params.password : undefined,
                title: params.title,
                description: params.description,
                expiryTitle: params.expiryTitle,
                expiryMessage: params.expiryMessage,
                expiryUrl: params.expiryUrl
            })
        });
        return res.data;
    }

    /**
     * Updates an existing link by its ID.
     * Enforces that at least one update field is present and validates credentials natively.
    */
    public async update(id: string, params: UpdateLinkParams): Promise<ShortLinkData> {
        if (!id) {
            throw new Error("SkyBrance: Link 'id' is required for performing an update.");
        }

        const updatedFields = Object.keys(params).filter(
            (key) => params[key as keyof UpdateLinkParams] !== undefined
        );
        if (updatedFields.length === 0) {
            throw new Error("SkyBrance: At least one field must be provided to update the link resource.");
        }

        if (params.isPasswordProtected && !params.password) {
            throw new Error("SkyBrance: 'password' is required when 'isPasswordProtected' is true.");
        } else if (params.isPasswordProtected && params.password && params.password.length < 4) {
            throw new Error("SkyBrance: 'password' must be at least 4 characters long.");
        }

        const res = await this.client.request<LinkResponse>(`/link-shortener/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                url: params.url,
                alias: params.alias,
                expiry: params.expiry,
                isPasswordProtected: params.isPasswordProtected,
                password: params.isPasswordProtected ? params.password : undefined,
                title: params.title,
                description: params.description,
                expiryTitle: params.expiryTitle,
                expiryMessage: params.expiryMessage,
                expiryUrl: params.expiryUrl
            })
        });
        return res.data;
    }

    /**
     * Fetches a shortened link by its ID, with optional analytics history depth.
    */
    public async getById(id: string, numberOfPastDays?: number): Promise<LinkByIdData> {
        if (!id) {
            throw new Error("SkyBrance: Link 'id' is required for fetching a link.");
        }

        const queryParams = new URLSearchParams();
        if (numberOfPastDays !== undefined) {
            queryParams.set('numberOfPastDays', numberOfPastDays.toString());
        }

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/link-shortener/${id}?${queryString}` : `/link-shortener/${id}`;

        const res = await this.client.request<LinkByIdResponse>(endpoint, {
            method: 'GET'
        });

        return res.data;
    }

    /**
     * Creates an upload URL for the OG image of a link.
    */
    public async uploadOgImage(id: string, params: OgImageUploadParams): Promise<OgImageUploadData> {
        if (!id) {
            throw new Error("SkyBrance: Link 'id' is required for uploading an OG image.");
        }

        if (!params.contentType) {
            throw new Error("SkyBrance: 'contentType' is required for uploading an OG image.");
        }

        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(params.contentType)) {
            throw new Error("SkyBrance: 'contentType' must be one of 'image/jpeg', 'image/png', 'image/jpg', or 'image/webp'.");
        }

        const res = await this.client.request<OgImageUploadResponse>(`/link-shortener/og-image/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                contentType: params.contentType
            })
        });

        return res.data;
    }

    /**
     * Deletes a shortened link by its ID.
    */
    public async deleteById(id: string): Promise<DeleteLinkResponse> {
        if (!id) {
            throw new Error("SkyBrance: Link 'id' is required for deleting a link.");
        }

        return this.client.request<DeleteLinkResponse>(`/link-shortener/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Retrieves a paginated list of shortened links based on filtering criteria.
     * Maps query parameters beautifully into an HTTP GET string.
     */
    public async getList(filters: ListLinksFilters = {}): Promise<PaginatedLinkResponse> {
        const queryParams = new URLSearchParams();

        if (filters.page !== undefined) queryParams.set('page', filters.page.toString());
        if (filters.limit !== undefined) queryParams.set('limit', filters.limit.toString());
        if (filters.search !== undefined) queryParams.set('search', filters.search);
        if (filters.isPasswordProtected !== undefined) {
            queryParams.set('isPasswordProtected', filters.isPasswordProtected.toString());
        }
        if (filters.minimumclicks !== undefined) {
            queryParams.set('minimumclicks', filters.minimumclicks.toString());
        }

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/link-shortener?${queryString}` : '/link-shortener';

        return this.client.request<PaginatedLinkResponse>(endpoint, {
            method: 'GET'
        });
    }
}