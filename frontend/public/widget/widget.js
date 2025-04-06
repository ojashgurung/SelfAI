(function () {
  // Create widget container
  const createWidgetContainer = () => {
    const container = document.createElement("div");
    container.id = "selfai-widget";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    return container;
  };

  // Initialize widget
  const initWidget = async () => {
    const script = document.currentScript;
    const widgetId = script.getAttribute("data-widget-id");

    if (!widgetId) {
      console.error("Widget ID is required");
      return;
    }

    try {
      // Fetch widget configuration
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/widget/${widgetId}`
      );
      const widgetConfig = await response.json();

      // Create and inject widget iframe
      const iframe = document.createElement("iframe");
      iframe.src = `${process.env.NEXT_PUBLIC_URL}/widget/chat/${widgetId}`;
      iframe.style.border = "none";
      iframe.style.width = "350px";
      iframe.style.height = "600px";
      iframe.style.borderRadius = "10px";
      iframe.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";

      const container = createWidgetContainer();
      container.appendChild(iframe);
      document.body.appendChild(container);

      // Handle messages from iframe
      window.addEventListener("message", (event) => {
        if (event.origin === process.env.NEXT_PUBLIC_API_URL) {
          // Handle widget events (minimize, maximize, etc.)
        }
      });
    } catch (error) {
      console.error("Failed to initialize widget:", error);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
