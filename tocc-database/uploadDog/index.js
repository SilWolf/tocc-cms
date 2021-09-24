const Octokat = require("octokat");
const fs = require("fs");

(async () => {
  const repoOwner = "SilWolf";
  const repoName = "tocc-database";

  const octo = new Octokat({
    token: "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",
  });
  const repo = octo.repos(repoOwner, repoName);

  // 1. get head reference
  const headRef = await repo.git.refs.heads("master").fetch();

  // 2. create a new branch
  const newBranchName = `uploadDog-${Date.now().toString()}`;
  const newBranch = await repo.git.refs.create({
    ref: `refs/heads/${newBranchName}`,
    sha: headRef.object.sha,
  });

  // 3. create all file's blob
  const blobs = await Promise.all([
    repo.git.blobs.create({
      content: '{ "key": "value" }',
      encoding: "utf-8",
    }),
    repo.git.blobs.create({
      content: Buffer.from(fs.readFileSync("./dog.jpg")).toString("base64"),
      encoding: "base64",
    }),
  ]);

  // 4. create new tree
  const oldTree = await repo.git.trees(headRef.object.sha).fetch();
  const newTree = await repo.git.trees.create({
    tree: [
      {
        path: "newFile.json",
        mode: "100644",
        type: "blob",
        sha: blobs[0].sha,
      },
      {
        path: "dog.jpg",
        mode: "100644",
        type: "blob",
        sha: blobs[1].sha,
      },
    ],
    base_tree: oldTree.sha,
  });

  // 5. create commit
  const newCommit = await repo.git.commits.create({
    message: "chore: commit two new files",
    tree: newTree.sha,
    parents: [headRef.object.sha],
  });

  // 6. update new branch's head to new commit
  await repo.git.refs.heads(newBranchName).update({
    sha: newCommit.sha,
  });

  // 7. create Pull Request with new commit
  const newPullRequest = await repo.pulls.create({
    title: "新增圖片: dog.jpg",
    body: "新增圖片 dog.jpg. This is more content.\n\nTry new line.\n\n# Header\n## Header 2\n- Bullet\n- Buttet 2",
    head: newBranchName,
    base: "master",
  });

  console.log("Pull Request created.");

  return true;
})();
