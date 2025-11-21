import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason
} from "@whiskeysockets/baileys";

import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

let sock;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");

    sock = makeWASocket({
        auth: state,
        browser: ["AmCoderBot", "Chrome", "1.0.0"]
    });

    // Save session on updates
    sock.ev.on("creds.update", saveCreds);

    // Connection events
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Print QR in terminal
        if (qr) {
            console.log("\n\nSCAN THIS QR CODE:\n", qr, "\n\n");
        }

        if (connection === "close") {
            const statusCode = lastDisconnect?.error?.output?.statusCode;

            if (statusCode !== DisconnectReason.loggedOut) {
                console.log("🔁 Reconnecting...");
                startBot();
            } else {
                console.log("❌ Logged out. Delete auth_info folder and restart to re-scan QR.");
            }
        }

        if (connection === "open") {
            console.log("✅ WhatsApp bot connected!");
        }
    });
}

startBot();

// API to send message
app.post("/send", async (req, res) => {
    try {
        const { phone, message } = req.body;

        if (!sock) {
            return res.status(503).json({
                success: false,
                message: "WhatsApp bot not ready"
            });
        }

        const jid = phone + "@s.whatsapp.net";

        await sock.sendMessage(jid, { text: message });

        return res.json({ success: true });
    } catch (err) {
        console.error("Send error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Start webserver
app.listen(3001, () => console.log("🚀 WhatsApp service running on port 3001"));
