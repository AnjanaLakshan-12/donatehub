import api from "./axios";

// Base path matches @RequestMapping("/api/v1/donationrequest")

// Organization functions - Submit donation requests
export const submitDonationRequest = (donationId, purpose, requestedQuantity = 1) => {
    return api.post(`/donationrequest/submit/${donationId}`, null, {
        params: { purpose, requestedQuantity }
    });
};

// Donor functions - Approve/Reject requests
export const handleRequestStatus = (requestId, status) => {
    return api.put(`/donationrequest/${requestId}/action`, null, {
        params: { status }
    });
};

// Admin/General functions - View donation requests
export const getDonationRequestsByStatus = (status) => {
    return api.get(`/donationrequest/status/${status}`);
};

export const getAllDonationRequests = (endpoint = "/getall") => {
    return api.get(`/donationrequest${endpoint}`);
};

export const getAllDonationRequestsPaginated = (page = 0, size = 10, sortBy = "id", direction = "DESC") => {
    return api.get(`/donationrequest/getall/paginated`, {
        params: {
            page,
            size,
            sortBy,
            direction
        }
    });
};

export const getDonationRequestsByUserAndStatus = (status) => {
    return api.get(`/donationrequest/user/${status}`);
};

// Get donation requests by donation ID
export const getDonationRequestsByDonationId = (donationId) => {
    return api.get(`/donationrequest/donation/${donationId}`);
};
