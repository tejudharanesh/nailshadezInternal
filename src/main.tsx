import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed:", error);
      });
  });
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Save the event so it can be triggered later
  deferredPrompt = e;

  // Delay the prompt by 5 seconds after page load
  setTimeout(() => {
    showInstallPrompt();
  }, 5000); // Adjust the delay time as desired
});

function showInstallPrompt() {
  if (deferredPrompt) {
    // Show the prompt
    deferredPrompt.prompt();
    // Handle the user's response
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      // Reset the prompt to prevent re-showing
      deferredPrompt = null;
    });
  }
}
