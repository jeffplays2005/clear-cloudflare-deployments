import { deleteDeployment, getAllDeployments } from "./helpers"

const accountId = process.env.CF_ACCOUNT_ID as string
const projectName = process.env.CF_PROJECT_NAME as string
const authToken = process.env.CF_AUTH_TOKEN as string

if (!accountId || !projectName || !authToken) {
  console.error("Missing variables: CF_ACCOUNT_ID, CF_PROJECT_NAME, CF_AUTH_TOKEN")
  process.exit(1)
}

async function main() {
  try {
    console.log("Fetching all deployments...")
    const deployments = await getAllDeployments(accountId, projectName, authToken)

    const sortedDeployments = deployments.sort(
      (a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime(),
    )

    if (sortedDeployments.length === 0) {
      console.log("No deployments found.")
      return
    }

    const latestDeployment = sortedDeployments[0]
    console.log(`Latest deployment: ${latestDeployment.id} (${latestDeployment.created_on})`)

    const deploymentsToDelete = sortedDeployments.slice(1)
    console.log(`Found ${deploymentsToDelete.length} older deployments to delete.`)

    for (const deployment of deploymentsToDelete) {
      console.log(`Deleting deployment ${deployment.id} from ${deployment.created_on}...`)
      await deleteDeployment(accountId, projectName, authToken, deployment.id)
      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log("Cleanup complete!")
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : "Unknown error")
    process.exit(1)
  }
}

main()
