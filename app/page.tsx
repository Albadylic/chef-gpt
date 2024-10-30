"use client";

import { useChat } from "ai/react";
import { useEffect, useState, useRef } from "react";

export default function Chat() {
  const { messages, isLoading, append } = useChat();
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const cuisines = [
    {
      emoji: "🇮🇹",
      value: "Italian",
    },
    {
      emoji: "🇻🇳",
      value: "Vietnamese",
    },
    {
      emoji: "🇫🇷",
      value: "French",
    },
    {
      emoji: "🇪🇹",
      value: "Ethiopian",
    },
  ];

  const types = [
    {
      emoji: "🥗",
      value: "Healthy",
    },
    {
      emoji: "🍲",
      value: "Comfort",
    },
    {
      emoji: "🧁",
      value: "Dessert",
    },
    {
      emoji: "🍔",
      value: "Sandwich",
    },
  ];

  const [state, setState] = useState({
    cuisine: "",
    type: "",
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return (
    <>
      <div className="flex justify-center py-2">
        <div className="space-y-4 bg-opacity-25 bg-gray-200 rounded-lg p-4 mx-2">
          <h3 className="text-xl font-semibold">Cuisine</h3>
          {cuisines.map(({ value, emoji }) => (
            <div
              key={value}
              className="m-2 bg-opacity-25 bg-gray-600 rounded-lg"
            >
              <input
                id={value}
                type="radio"
                value={value}
                name="cuisine"
                onChange={handleChange}
              />
              <label className="ml-2" htmlFor={value}>
                {`${emoji} ${value}`}
              </label>
            </div>
          ))}
        </div>

        <div className="space-y-4 bg-opacity-25 bg-gray-200 rounded-lg p-4 mx-2">
          <h3 className="text-xl font-semibold">Type</h3>

          {types.map(({ value, emoji }) => (
            <div
              key={value}
              className="m-2 bg-opacity-25 bg-gray-600 rounded-lg"
            >
              <input
                id={value}
                type="radio"
                value={value}
                name="type"
                onChange={handleChange}
              />
              <label className="ml-2" htmlFor={value}>
                {`${emoji} ${value}`}
              </label>
            </div>
          ))}
        </div>
        <button
          className="bg-green-800 p-2 text-white rounded shadow-xl mx-2"
          disabled={isLoading}
          onClick={() =>
            append({
              role: "user",
              content: `Give me a recipe for a ${state.cuisine}, ${state.type} meal`,
            })
          }
        >
          Generate Recipe
        </button>

        <button
          className="bg-blue-500 p-2 text-white rounded shadow-xl"
          disabled={isLoading || messages.length < 1}
          onClick={async () => {
            setImage(null);
            setImageIsLoading(true);
            const response = await fetch("api/images", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: messages[messages.length - 1].content,
              }),
            });
            const data = await response.json();
            setImage(data);
            setImageIsLoading(false);
          }}
        >
          Generate image
        </button>
      </div>

      <div className="flex flex-col w-5/6 max-h-96 py-8 mx-auto stretch overflow-hidden">
        <div className="overflow-auto w-full" ref={messagesContainerRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-green-400 p-3 m-2 rounded-lg"
                  : "bg-slate-400 p-3 m-2 rounded-lg"
              }`}
            >
              {m.content}
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-end pr-4">
            <span className="animate-pulse text-2xl">...</span>
          </div>
        )}
      </div>

      {imageIsLoading && (
        <div className="flex justify-center items-center max-h-96">
          <div className="loader">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            </div>
          </div>
        </div>
      )}

      {image && (
        <div className="flex flex-col p-4 justify-center gap-4 max-h-96">
          <img
            src={`data:image/jpeg;base64,${image}`}
            className="max-h-96 max-w-96"
          />
        </div>
      )}
    </>
  );
}
