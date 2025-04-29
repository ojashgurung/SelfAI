(function () {
  const CONFIG = {
    API_URL: "https://api.selfai.tech/api/v1",
    WIDGET_URL: "https://widget.selfai.tech",
  };

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
    container.style.pointerEvents = "none";
    return container;
  };

  const initWidget = async () => {
    const script = document.querySelector("script[data-user-id]");
    const userId = script?.getAttribute("data-user-id");

    if (!userId) {
      console.error("User ID is not provided.");
      return;
    }

    try {
      const response = await fetch(
        `${CONFIG.API_URL}/widget/public/user/${userId}`
      );
      const widgetConfig = await response.json();

      const container = createWidgetContainer();
      const iframe = document.createElement("iframe");
      iframe.src = `${CONFIG.WIDGET_URL}/chat/${widgetConfig.id}`;
      iframe.style.border = "none";
      iframe.style.backgroundColor = "transparent";
      iframe.style.backdropFilter = "none";
      iframe.style.borderRadius = "16px";
      iframe.style.overflow = "hidden";
      iframe.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      iframe.style.transformOrigin = "bottom right";

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

      window.addEventListener("resize", updateSize);
      updateSize();

      container.appendChild(iframe);
      document.body.appendChild(container);

      window.addEventListener("message", (event) => {
        if (event.origin !== CONFIG.WIDGET_URL) return;
        const { type } = event.data;

        if (type === "minimize") {
          // shrink the iframe
          iframe.style.width = "60px";
          iframe.style.height = "60px";

          container.style.width = "60px";
          container.style.height = "60px";
          container.style.borderRadius = "50%";
          container.style.overflow = "hidden";
          container.style.clipPath = "circle(30px at 100% 100%)";

          container.style.pointerEvents = "auto";
        } else if (type === "maximize") {
          updateSize();

          container.style.borderRadius = "16px";
          container.style.overflow = "visible";
          container.style.clipPath = "none";

          container.style.pointerEvents = "auto";
        }
      });
    } catch (error) {
      console.error("Failed to initialize widget:", error);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
