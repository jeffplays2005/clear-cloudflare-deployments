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
const core_1 = require("@actions/core");
const helpers_1 = require("./helpers");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const accountId = (0, core_1.getInput)("CF_ACCOUNT_ID", { required: true });
        const projectName = (0, core_1.getInput)("CF_PROJECT_NAME", { required: true });
        const authToken = (0, core_1.getInput)("CF_AUTH_TOKEN", { required: true });
        try {
            console.log("Fetching all deployments...");
            const deployments = yield (0, helpers_1.getAllDeployments)(accountId, projectName, authToken);
            const sortedDeployments = deployments.sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime());
            if (sortedDeployments.length === 0) {
                console.log("No deployments found.");
                return;
            }
            const latestDeployment = sortedDeployments[0];
            console.log(`Latest deployment: ${latestDeployment.id} (${latestDeployment.created_on})`);
            const deploymentsToDelete = sortedDeployments.slice(1);
            console.log(`Found ${deploymentsToDelete.length} older deployments to delete.`);
            for (const deployment of deploymentsToDelete) {
                console.log(`Deleting deployment ${deployment.id} from ${deployment.created_on}...`);
                yield (0, helpers_1.deleteDeployment)(accountId, projectName, authToken, deployment.id);
                // Add delay to avoid rate limiting
                yield new Promise((resolve) => setTimeout(resolve, 1000));
            }
            console.log("Cleanup complete!");
        }
        catch (error) {
            console.error("Error:", error instanceof Error ? error.message : "Unknown error");
            process.exit(1);
        }
    });
}
main();
