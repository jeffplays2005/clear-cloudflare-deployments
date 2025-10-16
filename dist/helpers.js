"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDeployments = getAllDeployments;
exports.fetchPage = fetchPage;
exports.deleteDeployment = deleteDeployment;
/**
 * Fetches all deployments for a given Cloudflare Pages project.

 * @param accountId The ID of the Cloudflare account.
 * @param projectName The name of the Cloudflare Pages project.
 * @param authToken The authentication token for the Cloudflare API.
 * @returns A promise that resolves to an array of Deployment objects.
 */
function getAllDeployments(accountId, projectName, authToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const firstPage = yield fetchPage(accountId, projectName, authToken, 1);
        const totalPages = ((_a = firstPage.result_info) === null || _a === void 0 ? void 0 : _a.total_pages) || 1;
        let allDeployments = [...firstPage.result];
        // Fetch remaining pages if they exist
        if (totalPages > 1) {
            const remainingPages = yield Promise.all(Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(accountId, projectName, authToken, i + 2)));
            allDeployments = [...allDeployments, ...remainingPages.flatMap((page) => page.result)];
        }
        return allDeployments;
    });
}
/**
 * Fetches a page of deployments from Cloudflare Pages.
 *
 * @param accountId The Cloudflare account ID.
 * @param projectName The name of the Cloudflare Pages project.
 * @param authToken The authentication token for the Cloudflare API.
 * @param page The page number to fetch.
 * @param per_page The number of deployments per page.
 * @returns A promise that resolves to a CloudflareResponse object.
 */
function fetchPage(accountId_1, projectName_1, authToken_1, page_1) {
    return __awaiter(this, arguments, void 0, function* (accountId, projectName, authToken, page, per_page = 25) {
        const response = yield fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments?page=${page}&per_page=${per_page}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });
        const data = (yield response.json());
        if (!data.success) {
            throw new Error(`Failed to fetch deployments: ${JSON.stringify(data.errors)}`);
        }
        return data;
    });
}
/**
 * Deletes a deployment from Cloudflare Pages.
 *
 * @param accountId The ID of the Cloudflare account.
 * @param projectName The name of the Cloudflare Pages project.
 * @param authToken The authentication token for the Cloudflare API.
 * @param deploymentId The ID of the deployment to delete.
 * @returns A promise that resolves when the deployment is deleted.
 */
function deleteDeployment(accountId, projectName, authToken, deploymentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}?force=true`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });
        const data = (yield response.json());
        if (!data.success) {
            console.error(`Failed to delete deployment ${deploymentId}: ${JSON.stringify(data.errors)}`);
        }
    });
}
