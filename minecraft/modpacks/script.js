document.addEventListener("DOMContentLoaded", () => {
  // Handle downloads
  document.querySelectorAll(".download-btn").forEach(button => {
    button.addEventListener("click", () => {
      const file = button.dataset.file;
      const name = button.dataset.filename || file.split("/").pop();

      if (!file) {
        alert("Error: Missing file path.");
        return;
      }

      if (confirm(`Are you sure you want to download "${name}"?`)) {
        const a = document.createElement("a");
        a.href = file;
        a.download = name;
        a.click();
      }
    });
  });

  // Handle unavailable buttons
  document.querySelectorAll(".unavailable").forEach(button => {
    button.addEventListener("click", () => {
      alert("This file is unavailable!");
    });
  });
});