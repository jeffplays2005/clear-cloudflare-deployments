import type { CloudflareResponse, Deployment } from "./types"

/**
 * Fetches all deployments for a given Cloudflare Pages project.

 * @param accountId The ID of the Cloudflare account.
 * @param projectName The name of the Cloudflare Pages project.
 * @param authToken The authentication token for the Cloudflare API.
 * @returns A promise that resolves to an array of Deployment objects.
 */
export async function getAllDeployments(
  accountId: string,
  projectName: string,
  authToken: string,
): Promise<Deployment[]> {
  const firstPage = await fetchPage(accountId, projectName, authToken, 1)
  const totalPages = firstPage.result_info?.total_pages || 1

  let allDeployments = [...firstPage.result]

  // Fetch remaining pages if they exist
  if (totalPages > 1) {
    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetchPage(accountId, projectName, authToken, i + 2),
      ),
    )

    allDeployments = [...allDeployments, ...remainingPages.flatMap((page) => page.result)]
  }

  return allDeployments
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
export async function fetchPage(
  accountId: string,
  projectName: string,
  authToken: string,
  page: number,
  per_page = 25,
): Promise<CloudflareResponse> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments?page=${page}&per_page=${per_page}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    },
  )

  const data = (await response.json()) as CloudflareResponse
  if (!data.success) {
    throw new Error(`Failed to fetch deployments: ${JSON.stringify(data.errors)}`)
  }

  return data
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
export async function deleteDeployment(
  accountId: string,
  projectName: string,
  authToken: string,
  deploymentId: string,
): Promise<void> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    },
  )

  const data = (await response.json()) as CloudflareResponse
  if (!data.success) {
    console.error(`Failed to delete deployment ${deploymentId}: ${JSON.stringify(data.errors)}`)
  }
}
