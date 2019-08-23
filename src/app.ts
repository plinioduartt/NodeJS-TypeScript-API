import app from "./server";

app.listen(process.env.PORT, process.env.HOST, (req, res) => {
    console.log(`plinioduartt@api online no end: ${process.env.HOST+":"+process.env.PORT}`);
});