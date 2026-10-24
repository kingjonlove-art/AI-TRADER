const express = require("express"); 
const app = express(); 
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

app.post("/api/analyze", (req, res) => {
    // আপনার এনালাইসিস বা প্রসেসিং কোড এখানে থাকবে
    res.json({ message: "Data received successfully" });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

