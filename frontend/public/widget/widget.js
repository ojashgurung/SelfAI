(function () {
  const CONFIG = {
    API_URL: "https://api.selfai.tech/api/v1",
    WIDGET_URL: "https://widget.selfai.tech",
  };

  // Create the fixed container that will hold our iframe
  const createWidgetContainer = () => {
    const c = document.createElement("div");
    c.id = "selfai-widget";
    Object.assign(c.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "9999",
      width: "360px",
      height: "560px",
      borderRadius: "16px",
      overflow: "visible",
      pointerEvents: "auto",
      background: "none",
      backgroundColor: "transparent",
      transition: "all 0.2s ease",
    });
    return c;
  };

  const initWidget = async () => {
    const script = document.querySelector("script[data-user-id]");
    const userId = script?.getAttribute("data-user-id");
    if (!userId) return console.error("User ID missing");

    const resp = await fetch(`${CONFIG.API_URL}/widget/public/user/${userId}`);
    const { id: chatId } = await resp.json();

    const container = createWidgetContainer();
    const iframe = document.createElement("iframe");
    iframe.src = `${CONFIG.WIDGET_URL}/chat/${chatId}`;
    Object.assign(iframe.style, {
      width: "100%", // fill container
      height: "100%",
      border: "none",
      borderRadius: "inherit", // match container
      overflow: "hidden",
      pointerEvents: "auto",
      transition: "inherit",
    });

    // size updater for full view
    const updateSize = () => {
      let [w, h] = ["360px", "560px"];

      requestAnimationFrame(() => {
        iframe.style.width = w;
        iframe.style.height = h;
        container.style.width = w;
        container.style.height = h;
      });
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    container.appendChild(iframe);
    document.body.appendChild(container);

    window.addEventListener("message", ({ origin, data }) => {
      if (origin !== CONFIG.WIDGET_URL) return;
      const { type } = data;

      if (type === "minimize") {
        // shrink down into a circle
        Object.assign(iframe.style, {
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        });
        Object.assign(container.style, {
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          overflow: "hidden",
          clipPath: "circle(32px at 32px 32px)",
          bottom: "20px",
          right: "20px",
        });
      } else if (type === "maximize") {
        updateSize();
        Object.assign(iframe.style, {
          borderRadius: "16px",
        });
        Object.assign(container.style, {
          borderRadius: "16px",
          overflow: "visible",
          clipPath: "none",
        });
      } else if (type === "close") {
        container.style.display = "none";
      }
    });
  };

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initWidget);
  else initWidget();
})();
