/*
 * ----------------------------------------------------------------------------------------
 *
 *  Description:
 *
 *      This script is designed to automate the process of cloning multiple
 *      Git repositories and counting the lines of source code for each repository
 *      using the `cloc` tool. It reads a list of repository URLs from a text file
 *      named `repolist.txt`, where each line in the file represents a separate GitHub
 *      repository URL.
 *
 *      For each repository, the script does the following:
 *
 *          1. Extracts the repository name and the username from the URL.
 *          2. Creates a local directory structure for storing the cloned repositories,
 *             organized by username.
 *          3. Deletes any existing clone of the repository to ensure a fresh clone.
 *          4. Clones the repository to the local machine.
 *          5. Runs the `cloc` command to count the lines of code, including the number of
 *             files, blank lines, comment lines, and actual code lines.
 *          6. Logs the results to the console in a structured format for easy review.
 *
 *  Prerequisites:
 *      - Make sure you have Git installed on your system, as it is required for cloning
 *        the repositories.
 *      - The `cloc` (Count Lines of Code) tool should be installed.
 *
 *  How to Run the script?
 *      1. Create a file named `repolist.txt` in the same directory as this script. Add one
 *         repository URL per line, such as:
 *
 *          https://github.com/username/repo1.git
 *          https://github.com/username/repo2.git
 *
 *      2. Run this script using Node.js. For example, you can run:
 *
 *          node index.mjs
 *
 *
 *      The script will process each repository listed in `repolist.txt`,
 *      clone it, and output the total number of files, blank lines,
 *      comment lines, and code lines for each repository.
 *
 *  Author:
 *      David Nester - 2024
 *
 * ----------------------------------------------------------------------------------------
 */

import { exec } from "child_process";
import fs from "fs";
import readline from "readline";



/*
 *      Set your personal access token here
 */


const PERSONAL_ACCESS_TOKEN = "your_token_here";


/*
 *      Clone repository
 */

async function cloneAndCountLines(repoUrl, token = null) {

  /*
   *    Extract the repository and user names
   */

  const repoName = repoUrl.split("/").pop().replace(".git", "");
  const userName = repoUrl.split("/")[3];

  if (!fs.existsSync(`./repositories/${userName}`)) {
    fs.mkdirSync(`./repositories/${userName}`, { recursive: true });
  }
  const localDir = `./repositories/${userName}/${repoName}`;
  if (fs.existsSync(localDir)) {
    fs.rmdirSync(localDir, { recursive: true });
  }



  let cloneUrl = repoUrl;
  if (token) {
    const urlParts = repoUrl.split("https://");
    cloneUrl = `https://${token}@${urlParts[1]}`;
  }

  /*
   *    Clone the repository (Make sure you have cloc installed locally)
   */


  exec(`git clone ${cloneUrl} ${localDir}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during git clone: ${error}`);
      return;
    }

    // Run cloc on the cloned repository
    exec(`cloc ${localDir}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running cloc: ${error}`);
        return;
      }
      const lines = stdout.split("\n");
      const figures = {};
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("SUM")) {
          const columns = lines[i].split(/\s+/);
          figures["files"] = columns[1];
          figures["blank"] = columns[2];
          figures["comment"] = columns[3];
          figures["code"] = columns[4];
          break;
        }
      }
      if (Object.keys(figures).length > 0) {
        console.log(
          `Total figures for repo ${repoName} under user ${userName} is: ${JSON.stringify(
            figures
          )}`
        );
      } else {
        console.log("No figures found");
      }
    });
  });
}

async function processRepoList(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const repoUrl = line.trim();

    if (repoUrl) {
      console.log(`Processing repository: ${repoUrl}`);
      await cloneAndCountLines(repoUrl, PERSONAL_ACCESS_TOKEN);
    }
  }
}


/* 
 *    Main 
 */


processRepoList("repolist.txt").catch(console.error);

/*
 * EOF
 */
