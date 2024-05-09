const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');
import { showHUD } from "@raycast/api";

const desktopDir = path.join(os.homedir(), 'Desktop');

const moveFileToTrash = (filePath) => {
  exec(`osascript -e 'tell application "Finder" to delete POSIX file "${filePath}"'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`File moved to trash: ${filePath}`);
  });
};

fs.readdir(desktopDir, (err, files) => {
  if (err) {
    console.log('Error finding files: ' + err);
    return;
  }

  let movedFilesCount = 0;  // Counter to track moved files

  files.forEach((filename) => {
    if ((filename.startsWith('CleanShot ') || filename.startsWith('Screenshot ')) && filename.endsWith('.png')) {
      const fullPath = path.join(desktopDir, filename);
      moveFileToTrash(fullPath);
      movedFilesCount++;  // Increment counter for each moved file
    }
  });

  if (movedFilesCount === 0) {
    showHUD("No screenshots were found to move to trash.");
  } else {
    showHUD(`${movedFilesCount} screenshots moved to trash.`);
  }
});
