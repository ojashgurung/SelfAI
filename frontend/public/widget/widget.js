(function () {
  // Create widget container
  const createWidgetContainer = () => {
    const container = document.createElement("div");
    container.id = "selfai-widget";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.background = "none";
    container.style.backgroundColor = "transparent";
    container.style.backdropFilter = "none";
    return container;
  };

  // Initialize widget
  const initWidget = async () => {
    const script = document.querySelector("script[data-widget-id]");
    const widgetId = script?.getAttribute("data-widget-id");

    if (!widgetId) {
      console.error("Widget ID is required");
      return;
    }

    try {
      // Fetch widget config
      const response = await fetch(
        `http://localhost:8000/api/v1/widget/public/${widgetId}`
      );
      const widgetConfig = await response.json();

      const container = createWidgetContainer();
      const iframe = document.createElement("iframe");
      iframe.src = `http://localhost:3001/chat/${widgetId}`;
      iframe.style.border = "none";
      iframe.style.backgroundColor = "transparent";
      iframe.style.backdropFilter = "none";
      iframe.style.borderRadius = "16px";
      iframe.style.overflow = "hidden";
      iframe.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      iframe.style.transformOrigin = "bottom right";

      // Dynamic size logic
      const updateSize = () => {
        const screenWidth = window.innerWidth;

        let width = "360px";
        let height = "560px";

        if (screenWidth >= 1536 && screenWidth < 1920) {
          width = "400px";
          height = "600px";
        } else if (screenWidth >= 1920) {
          width = "400px";
          height = "580px";
        }

        iframe.style.width = width;
        iframe.style.height = height;
        container.style.width = width;
        container.style.height = height;
      };

      // Listen for resize
      window.addEventListener("resize", updateSize);
      updateSize(); // initial sizing

      // Append elements
      container.appendChild(iframe);
      document.body.appendChild(container);

      // Handle iframe messages
      window.addEventListener("message", (event) => {
        if (event.origin !== "http://localhost:3001") return;

        const { type } = event.data;
        if (type === "minimize") {
          iframe.style.width = "60px";
          iframe.style.height = "60px";
          container.style.width = "60px";
          container.style.height = "60px";
        } else if (type === "maximize") {
          updateSize();
        }
      });
    } catch (error) {
      console.error("Failed to initialize widget:", error);
    }
  };

  // Wait for DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
