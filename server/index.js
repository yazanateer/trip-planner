const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: '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' });

async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "generate for me a 3-days trip in three zones in israel by car ",
      },
    ],
    model: "llama3-8b-8192",
  });
}

main();
