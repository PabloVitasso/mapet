import express, { Request, Response, RequestHandler } from "express";
import bodyParser from "body-parser";
import pptrGpt from "./client";
import morgan from "morgan";
import cors from "cors";
import { v4 as uuid } from "uuid";

const getAnswerFromQuestion = async (question: string) => {
    // DRY: shared logic for both endpoints
    return await pptrGpt.singleMessage(question);
};

const server = async ({
    port = 3000,
    headless = true,
}) => {
    const app = express();
    const chats: { [id: string]: any } = {};

    app.use(bodyParser.json());
    app.use(morgan("dev"));
    app.use(
        cors({
            origin: "*",
        })
    );

    await pptrGpt.init({
        screenshots: true,
        headless,
    });

    app.get("/", (req, res) => {
        res.json({
            message: "pptr-gpt api running"
        });
    });

    app.post(
        "/ask",
        (async (req: Request, res: Response) => {
            try {
                const { question } = req.body;

                const answer = await getAnswerFromQuestion(question);

                res.json({ answer });
            } catch (error) {
                console.log('err', error);

                res.status(500).json({ error: "Something went wrong" });
            }
        }) as unknown as RequestHandler
    );

app.post(
    "/v1/chat/completions",
    (async (req: Request, res: Response) => {
        try {
            const { messages, model } = req.body;
            // Only support single user message for now
            const userMsg = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : "";
            const answer = await getAnswerFromQuestion(userMsg);

            res.json({
                id: "chatcmpl-" + uuid(),
                object: "chat.completion",
                created: Math.floor(Date.now() / 1000),
                model: model || "gpt-3.5-turbo",
                choices: [
                    {
                        index: 0,
                        message: {
                            role: "assistant",
                            content: answer
                        },
                        finish_reason: "stop"
                    }
                ],
                usage: {
                    prompt_tokens: userMsg.length,
                    completion_tokens: answer.length,
                    total_tokens: userMsg.length + answer.length
                }
            });
        } catch (error) {
            console.log('err', error);
            res.status(500).json({ error: "Something went wrong" });
        }
    }) as unknown as RequestHandler
);

app.post(
    "/create-chat",
    (async (req: Request, res: Response) => {
        try {
            const { message } = req.body;
            const id = uuid();

            const chat = await pptrGpt.createChat(message);

            chats[id] = {
                ...chat,
                lastUpdated: Date.now(),
            };

            res.json({ id, answer: chat.response });
        } catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }
    }) as unknown as RequestHandler
);

app.post(
    "/chat/send-message",
    (async (req: Request, res: Response) => {
        try {
            const { id, message } = req.body;

            const chat = chats[id];

            if (!chat) {
                return res.status(404).json({ error: "Chat not found" });
            }

            const answer = await chat.send(message);

            chat["lastUpdated"] = Date.now();

            res.json({ answer });
        } catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }
    }) as unknown as RequestHandler
);
// Minimal bearer token middleware (always allow)
app.use("/chat/completions", (req, res, next) => {
    const auth = req.headers["authorization"];
    // Accept any Bearer token, always allow
    next();
});
// Alias for OpenAI-compatible endpoint
app.use("/v1/chat/completions", (req, res, next) => {
    const auth = req.headers["authorization"];
    // Accept any Bearer token, always allow
    next();
});


app.post(
    "/chat/completions",
    (async (req: Request, res: Response) => {
        try {
            const { model, messages, max_tokens = 1024, temperature = 1.0 } = req.body;

            // Validate required fields
            if (typeof model !== "string" || !Array.isArray(messages)) {
                return res.status(400).json({ error: "Missing required fields: model, messages" });
            }
            // Validate messages array
            for (const msg of messages) {
                if (
                    typeof msg !== "object" ||
                    typeof msg.role !== "string" ||
                    typeof msg.content !== "string"
                ) {
                    return res.status(400).json({ error: "Invalid message format" });
                }
            }

            // Dummy response
            res.json({
                choices: [
                    {
                        message: {
                            role: "assistant",
                            content: "This is a dummy response."
                        }
                    }
                ],
                usage: {
                    total_tokens: 42
                }
            });
        } catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }
    }) as unknown as RequestHandler
);

app.get(
    "/chat/:id/close",
    (async (req: Request, res: Response) => {
        const { id } = req.params;

        const chat = chats[id];

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        await chat.close();
    }) as unknown as RequestHandler
);


    app.listen(port, () => {
        setInterval(async () => {
            console.log("checking chats for closing");
            for (const id in chats) {
                const chat = chats[id];

                if (chat.lastUpdated + 1000 * 60 * 60 * 3 < Date.now()) {
                    console.log("closing chat", id);
                    await chat.close();
                }
            }
        }, 1000 * 60 * 5);
        console.log('Hello')
        console.log(`pptr-gpt running on port ${port}`);
    });

    // process on exit
    process.on("SIGINT", async () => {
        await pptrGpt.close();
        process.exit();
    });

    process.on("SIGTERM", async () => {
        await pptrGpt.close();
        process.exit();
    });
};

export = server