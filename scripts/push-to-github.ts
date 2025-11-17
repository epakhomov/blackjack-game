import { Octokit } from '@octokit/rest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

function getAllFiles(dir: string, baseDir: string = dir, fileList: Array<{path: string, content: string}> = []): Array<{path: string, content: string}> {
  const files = readdirSync(dir);
  
  const ignoreDirs = ['node_modules', '.git', 'dist', '.cache', '.vite', 'attached_assets', 'scripts'];
  const ignoreFiles = ['.env', 'package-lock.json', '.DS_Store'];
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const relativePath = filePath.substring(baseDir.length + 1);
    
    if (ignoreDirs.some(d => relativePath.startsWith(d))) {
      return;
    }
    
    if (ignoreFiles.includes(file)) {
      return;
    }
    
    if (statSync(filePath).isDirectory()) {
      getAllFiles(filePath, baseDir, fileList);
    } else {
      try {
        const content = readFileSync(filePath, 'utf-8');
        fileList.push({
          path: relativePath,
          content: content
        });
      } catch (err) {
        console.log(`Skipping binary file: ${relativePath}`);
      }
    }
  });
  
  return fileList;
}

async function main() {
  const octokit = await getUncachableGitHubClient();
  
  console.log('Getting authenticated user...');
  const { data: user } = await octokit.users.getAuthenticated();
  const owner = user.login;
  const repoName = 'blackjack-game';
  
  console.log(`Pushing to repository: ${owner}/${repoName}`);
  
  let repo;
  try {
    const { data: existingRepo } = await octokit.repos.get({
      owner,
      repo: repoName
    });
    repo = existingRepo;
    console.log(`Using existing repository: ${repo.html_url}`);
  } catch (err: any) {
    if (err.status === 404) {
      console.log('Creating new repository...');
      const { data: newRepo } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: 'A web-based Blackjack card game with casino-style aesthetics, built with React and Node.js',
        private: false,
        auto_init: true
      });
      repo = newRepo;
      console.log(`Repository created: ${repo.html_url}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      throw err;
    }
  }
  
  let baseSha: string | undefined;
  let isEmptyRepo = false;
  
  try {
    const { data: mainRef } = await octokit.git.getRef({
      owner: repo.owner.login,
      repo: repo.name,
      ref: 'heads/main'
    });
    baseSha = mainRef.object.sha;
  } catch (err: any) {
    if (err.status === 409) {
      console.log('Repository is empty, will create initial commit');
      isEmptyRepo = true;
    } else {
      throw err;
    }
  }
  
  console.log('Collecting project files...');
  const files = getAllFiles('/home/runner/workspace');
  console.log(`Found ${files.length} files to upload`);
  
  console.log('Creating tree...');
  const tree = await Promise.all(
    files.map(async (file) => {
      const { data: blob } = await octokit.git.createBlob({
        owner: repo.owner.login,
        repo: repo.name,
        content: Buffer.from(file.content).toString('base64'),
        encoding: 'base64'
      });
      
      return {
        path: file.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blob.sha
      };
    })
  );
  
  console.log('Creating tree object...');
  const { data: treeData } = await octokit.git.createTree({
    owner: repo.owner.login,
    repo: repo.name,
    tree: tree
  });
  
  console.log('Creating commit...');
  const { data: commit } = await octokit.git.createCommit({
    owner: repo.owner.login,
    repo: repo.name,
    message: isEmptyRepo ? 'Initial commit: Blackjack game' : 'Add Blackjack game code',
    tree: treeData.sha,
    ...(baseSha ? { parents: [baseSha] } : {})
  });
  
  console.log('Updating main branch...');
  if (isEmptyRepo) {
    await octokit.git.createRef({
      owner: repo.owner.login,
      repo: repo.name,
      ref: 'refs/heads/main',
      sha: commit.sha
    });
  } else {
    await octokit.git.updateRef({
      owner: repo.owner.login,
      repo: repo.name,
      ref: 'heads/main',
      sha: commit.sha
    });
  }
  
  console.log('\n✅ Success! Your code has been pushed to GitHub');
  console.log(`🔗 Repository URL: ${repo.html_url}`);
}

main().catch(console.error);
