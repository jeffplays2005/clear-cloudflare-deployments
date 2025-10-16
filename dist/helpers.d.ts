import type { CloudflareResponse, Deployment } from "./types";
/**
 * Fetches all deployments for a given Cloudflare Pages project.

 * @param accountId The ID of the Cloudflare account.
 * @param projectName The name of the Cloudflare Pages project.
 * @param authToken The authentication token for the Cloudflare API.
 * @returns A promise that resolves to an array of Deployment objects.
 */
export declare function getAllDeployments(accountId: string, projectName: string, authToken: string): Promise<Deployment[]>;
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
export declare function fetchPage(accountId: string, projectName: string, authToken: string, page: number, per_page?: number): Promise<CloudflareResponse>;
/**
 * Deletes a deployment from Cloudflare Pages.
 *
 * @param accountId The ID of the Cloudflare account.
 * @param projectName The name of the Cloudflare Pages project.
 * @param authToken The authentication token for the Cloudflare API.
 * @param deploymentId The ID of the deployment to delete.
 * @returns A promise that resolves when the deployment is deleted.
 */
export declare function deleteDeployment(accountId: string, projectName: string, authToken: string, deploymentId: string): Promise<void>;
