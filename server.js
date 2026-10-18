require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error("ERROR: .env file-e API key nei!");
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: apiKey
});

// Server test
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "AI Trading Server is running!"
    });
});

// AI Market Analysis
app.post("/api/analyze", async (req, res) => {
    try {
        const { pair, candles } = req.body;

        if (
            typeof pair !== "string" ||
            pair.length > 20 ||
            !Array.isArray(candles) ||
            candles.length < 10 ||
            candles.length > 200
        ) {
            return res.status(400).json({
                error: "Invalid currency pair or candle data."
            });
        }

        const validData = candles.every(c =>
            c &&
            Number.isFinite(c.close) &&
            c.close > 0
        );

        if (!validData) {
            return res.status(400).json({
                error: "Invalid candle data."
            });
        }

        const result = await openai.responses.create({
            model: "gpt-5",
            instructions:
                "You are a cautious market analysis assistant. " +
                "Analyze only the supplied price data. " +
                "Return BUY, SELL, or WAIT as a possible signal. " +
                "Explain uncertainty and financial risks. " +
                "Never guarantee profit.",
            input: JSON.stringify({
                currency_pair: pair,
                candles: candles,
                task:
                    "Analyze the possible market direction. " +
                    "Return the signal and a short explanation."
            }),
            max_output_tokens: 300
        });

        res.json({
            success: true,
            pair: pair,
            analysis: result.output_text
        });

    } catch (error) {
        console.error("AI Analysis Error:", error.message);

        res.status(500).json({
            error:
                "AI analysis failed. Check API key, model access, and internet."
        });
    }
});

// Start server
app.listen(PORT, "127.0.0.1", () => {
    console.log(
        "AI Trading Server running at http://127.0.0.1:" + PORT
    );
});
