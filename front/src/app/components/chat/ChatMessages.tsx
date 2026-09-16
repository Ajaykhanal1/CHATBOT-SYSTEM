const messages = [
  {
    role: "user",
    content: "Explain React Server Components.",
  },
  {
    role: "assistant",
    content:
      "React Server Components allow components to render on the server. They can fetch data directly on the server and reduce the amount of JavaScript sent to the browser.",
  },
];

export default function ChatMessages() {
  return (
    <div className="flex-1 overflow-y-auto">

      <div className="mx-auto max-w-3xl px-4 py-8">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-8 flex gap-4 ${ message.role === "user" ? "justify-end" : "justify-start" }`
          }
          >

            {/* Avatar */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                message.role === "user"
                  ? "bg-gray-200"
                  : "bg-black text-white"
              }`}
            >
              {message.role === "user" ? "A" : "AI"}
            </div>

            {/* Message */}
            <div className="min-w-0 pt-1">
              <p className="mb-1 text-sm font-semibold">
                {message.role === "user" ? "You" : "AI"}
              </p>

              <p className="whitespace-pre-wrap leading-7 text-gray-700">
                {message.content}
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}