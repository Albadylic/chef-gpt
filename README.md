## ChefGPT

This app was created during my learning on Encode's AI and GPTs Bootcamp.

In Week 2, we looked at building Web Apps integrated with OpenAI's API. In the second lesson we built a simple chat app where a user could prompt the AI and have a conversation. We looked at adjusting the system prompt to be a chef who would provide a random recipe on request or respond to a prompt.

I took this concept and went a little further with my implementation. Rather than a random recipe, I wanted to allow a user to choose a cuisine and type of food. They can then click the generate button and the AI will be prompted to respond with a relevant recipe. Like so:

```jsx
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
```

The append function is from OpenAI's useChat library.

Clicking the generate button will make a POST request to the server (`route.ts`) and return a response by called the ChatGPT API.

### Adding images

...
