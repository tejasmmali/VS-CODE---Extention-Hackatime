const vscode = require("vscode");
const axios = require("axios");

const API_BASE = "https://hackatime.hackclub.com/api/v1";
// messages
const IDLE_TEXT = "\u{1F525} Click to check your streak";
const LOADING_TEXT = "\u{1F525} Cooking your streak...";
const NO_STREAK_TEXT = "\u{1F494} No streak yet - start coding today!";

function formatStreakText(streakValue) {
  return `\u{1F525} ${streakValue} Days streak`;
}

function readStreak(data) {
  const raw = data?.daily_streak ?? data?.streak ?? data?.user?.streak;
  if (raw === undefined || raw === null || raw === "") {
    return null;
  }

  const n = Number(raw);
  if (Number.isFinite(n) && n <= 0) {
    return null;
  }

  return String(raw);
}

async function fetchUserStats(username) {
  const safeUser = encodeURIComponent(username.trim());
  const url = `${API_BASE}/users/${safeUser}/stats`;

  try {
    const response = await axios.get(url, {
      headers: { Accept: "application/json" },
      timeout: 10000,
    });
    return response?.data?.data ?? null;
  } catch (error) {
    const status = error?.response?.status;
    if (status === 404) {
      throw new Error("User not found. Check your Hackatime username.");
    }
    if (status) {
      throw new Error(`Hackatime request failed (HTTP ${status}).`);
    }
    throw new Error("Unable to reach Hackatime API. Check your internet connection.");
  }
}

function activate(context) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
  statusBarItem.command = "hackatime-stats.showStats";
  statusBarItem.tooltip = "Click to fetch Hackatime streak";
  statusBarItem.text = IDLE_TEXT;
  statusBarItem.show();

  const command = vscode.commands.registerCommand("hackatime-stats.showStats", async () => {
    const username = await vscode.window.showInputBox({
      prompt: "Enter your Hackatime username",
      placeHolder: "example: tejasmali",
      ignoreFocusOut: true,
    });

    if (!username) {
      statusBarItem.text = IDLE_TEXT;
      return;
    }

    statusBarItem.text = LOADING_TEXT;

    try {
      const stats = await fetchUserStats(username);
      if (!stats) {
        throw new Error("Hackatime returned empty stats.");
      }

      const streak = readStreak(stats);
      const text = streak ? formatStreakText(streak) : NO_STREAK_TEXT;

      statusBarItem.text = text;
      vscode.window.showInformationMessage(text);
    } catch (error) {
      statusBarItem.text = IDLE_TEXT;
      vscode.window.showErrorMessage(error.message || "Failed to fetch Hackatime streak.");
    }
  });

  context.subscriptions.push(command, statusBarItem);
}

function deactivate() {}

module.exports = { activate, deactivate };
