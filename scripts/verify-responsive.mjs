import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const password = process.env.SITE_PASSWORD;
const baseUrl = process.env.SITE_URL || "http://localhost:3000";
const chromePath = process.env.CHROME_BIN || "google-chrome";
const port = Number(process.env.CHROME_PORT || 9333);

if (!password) {
  process.stderr.write("Set SITE_PASSWORD before running this check.\n");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForJson(url) {
  let lastError;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      lastError = error;
    }
    await sleep(100);
  }
  throw lastError || new Error(`Timed out waiting for ${url}`);
}

class Cdp {
  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.waiters = new Map();
    this.socket = new WebSocket(url);
  }

  async open() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      const waiters = this.waiters.get(message.method);
      if (!waiters?.length) return;
      const resolve = waiters.shift();
      resolve(message.params);
    });
  }

  command(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  once(method) {
    return new Promise((resolve) => {
      const waiters = this.waiters.get(method) || [];
      waiters.push(resolve);
      this.waiters.set(method, waiters);
    });
  }

  close() {
    this.socket.close();
  }
}

function assert(check, message) {
  if (!check) throw new Error(message);
}

async function evaluate(cdp, expression) {
  const result = await cdp.command("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }
  return result.result.value;
}

async function navigate(cdp, url) {
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.command("Page.navigate", { url });
  await loaded;
}

async function capture(cdp, path) {
  const result = await cdp.command("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });
  writeFileSync(path, Buffer.from(result.data, "base64"));
}

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=/tmp/nice-responsive-${process.pid}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

try {
  const targets = await waitForJson(`http://127.0.0.1:${port}/json/list`);
  const page = targets.find((target) => target.type === "page");
  if (!page?.webSocketDebuggerUrl) throw new Error("Chrome page target missing");

  const cdp = new Cdp(page.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.command("Page.enable");
  await cdp.command("Runtime.enable");
  await cdp.command("Network.enable");

  const token = createHash("sha256")
    .update(`nice-gtm:${password}`)
    .digest("hex");
  const cookie = await cdp.command("Network.setCookie", {
    name: "nice_gtm_session",
    value: token,
    url: baseUrl,
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
  });
  assert(cookie.success, "Could not set the site session cookie");

  await cdp.command("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate(cdp, baseUrl);
  await sleep(400);
  await capture(cdp, "/tmp/nice-desktop.png");
  await evaluate(
    cdp,
    `document.querySelector("#roster")?.scrollIntoView({ block: "start" });`,
  );
  await sleep(200);
  await capture(cdp, "/tmp/nice-fleet-desktop.png");

  await evaluate(
    cdp,
    `document.querySelector(".job-more > summary")?.click(); document.querySelector(".job-more")?.scrollIntoView({ block: "center" });`,
  );
  await sleep(2800);
  await capture(cdp, "/tmp/nice-demo-desktop.png");

  const desktop = await evaluate(
    cdp,
    `(() => {
      const rect = (selector) => {
        const node = document.querySelector(selector);
        if (!node) return null;
        const box = node.getBoundingClientRect();
        return { left: box.left, right: box.right, top: box.top, width: box.width, height: box.height };
      };
      const logo = document.querySelector(".site-header .brand-nice");
      const logoBox = logo?.getBoundingClientRect();
      return {
        title: document.title,
        heading: document.querySelector("h1")?.textContent,
        viewport: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        heroJobCount: document.querySelectorAll(".hero-phone-jobs button").length,
        heroPhone: rect(".hero-phone"),
        fleetComputers: document.querySelectorAll(".fleet-computer").length,
        artifacts: document.querySelectorAll(".chapter-payoff").length,
        quotes: document.querySelectorAll(".quote-row").length,
        quoteSources: document.querySelectorAll(".quote-row .quote-source").length,
        chat: rect(".job-more .gb-thread"),
        computer: rect(".job-more .pc-desk"),
        logo: logo ? {
          src: logo.src,
          naturalWidth: logo.naturalWidth,
          width: logoBox?.width,
          height: logoBox?.height
        } : null
      };
    })()`,
  );

  const heroThreads = await evaluate(
    cdp,
    `(async () => {
      const buttons = [...document.querySelectorAll(".hero-phone-jobs button")];
      const threads = [];
      for (const button of buttons) {
        button.click();
        await new Promise((resolve) => setTimeout(resolve, 40));
        threads.push({
          label: button.textContent?.trim(),
          title: document.querySelector(".hero-phone-header strong")?.textContent,
          work: document.querySelector(".hero-phone-work-label")?.textContent?.trim(),
          meta: document.querySelectorAll(".hero-phone-work-meta").length,
          messages: document.querySelectorAll(".hero-phone-message").length,
          result: document.querySelector(".hero-phone-work > strong")?.textContent,
        });
      }
      return threads;
    })()`,
  );

  assert(desktop.title === "NiCE x SpaceXAI", "Desktop title is wrong");
  assert(desktop.scrollWidth <= desktop.viewport + 1, "Desktop overflows");
  assert(desktop.heroJobCount === 8, "Hero does not have eight jobs");
  assert(desktop.heroPhone?.width > 0, "Hero phone is missing");
  assert(heroThreads.length === 8, "Not every hero thread opened");
  assert(
    heroThreads.every(
      (thread) =>
        thread.label &&
        thread.title &&
        thread.work &&
        thread.meta === 2 &&
        thread.messages === 2 &&
        thread.result,
    ),
    "A hero thread is incomplete",
  );
  assert(desktop.fleetComputers === 3, "Desktop fleet is incomplete");
  assert(desktop.artifacts === 3, "A storyboard artifact is missing");
  assert(desktop.quotes === 6, "Quote wall does not have six quotes");
  assert(desktop.quoteSources === 6, "A quote is missing its source");
  assert(desktop.chat && desktop.computer, "Desktop demo split is missing");
  assert(
    desktop.chat.left < desktop.computer.left,
    "Desktop computer is not to the right of chat",
  );
  assert(
    desktop.logo?.height >= 15 && desktop.logo?.height <= 18,
    "Header wordmark height is outside the requested range",
  );
  assert(desktop.logo?.naturalWidth > 0, "Official wordmark did not load");

  await cdp.command("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await navigate(cdp, baseUrl);
  await sleep(400);
  await capture(cdp, "/tmp/nice-mobile.png");
  await evaluate(
    cdp,
    `document.querySelector("#roster")?.scrollIntoView({ block: "start" });`,
  );
  await sleep(200);
  await capture(cdp, "/tmp/nice-fleet-mobile.png");

  await evaluate(
    cdp,
    `document.querySelector(".job-more > summary")?.click(); document.querySelector(".job-more")?.scrollIntoView({ block: "start" });`,
  );
  await sleep(2400);
  await evaluate(cdp, `document.querySelector(".mobile-pc-toggle")?.click();`);
  await sleep(300);
  await capture(cdp, "/tmp/nice-demo-mobile.png");

  const mobile = await evaluate(
    cdp,
    `(() => {
      const visible = (selector) => {
        const node = document.querySelector(selector);
        if (!node) return false;
        const style = getComputedStyle(node);
        const box = node.getBoundingClientRect();
        return style.display !== "none" && box.width > 0 && box.height > 0;
      };
      const logo = document.querySelector(".site-header .brand-nice");
      const logoBox = logo?.getBoundingClientRect();
      return {
        viewport: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        brandVisible: visible(".site-header .brand-lockup"),
        heroJobCount: document.querySelectorAll(".hero-phone-jobs button").length,
        heroPhoneVisible: visible(".hero-phone"),
        fleetComputers: document.querySelectorAll(".fleet-computer").length,
        phoneComputerVisible: visible(".pc-phone"),
        desktopComputerVisible: visible(".pc-desk"),
        logo: logo ? {
          naturalWidth: logo.naturalWidth,
          width: logoBox?.width,
          height: logoBox?.height
        } : null
      };
    })()`,
  );

  assert(mobile.scrollWidth <= mobile.viewport + 1, "Mobile overflows");
  assert(mobile.brandVisible, "Mobile brand lockup is hidden");
  assert(mobile.logo?.naturalWidth > 0, "Mobile official wordmark did not load");
  assert(mobile.heroJobCount === 8, "Mobile hero does not have eight jobs");
  assert(mobile.heroPhoneVisible, "Mobile hero phone is hidden");
  assert(mobile.fleetComputers === 3, "Mobile fleet is incomplete");
  assert(mobile.phoneComputerVisible, "Mobile computer cannot be opened");
  assert(!mobile.desktopComputerVisible, "Desktop computer leaked into mobile");

  process.stdout.write(
    `${JSON.stringify({ desktop, mobile }, null, 2)}\n`,
  );
  cdp.close();
} finally {
  chrome.kill("SIGTERM");
}
