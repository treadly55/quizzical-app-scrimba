import { nanoid } from "nanoid";

export const fetchQuizData = async (categoryId, quizType) => {
  try {
    const response = await fetch(
      // URL remains unchanged as requested
      `https://opentdb.com/api.php?amount=5&category=${categoryId}&difficulty=${quizType}&type=multiple`
    );

    // --- ADDED: Check for HTTP errors ---
    if (!response.ok) {
      // If response status is not 2xx, throw an error
      throw new Error(`HTTP error! Status: ${response.status} ${response.statusText || ''}`);
    }
    // --- END OF ADDED CHECK ---

    const data = await response.json();

    // Check if the API indicates an error in its own way (e.g., response_code !== 0)
    // OTDB uses response_code: 0 for success, 1 for no results, 2 for invalid parameter etc.
     if (data.response_code !== 0) {
       // Handle API-specific error conditions if needed, e.g., no questions found
       // For now, returning an empty array might be okay, App.js handles it.
       console.warn(`OpenTDB API responded with code: ${data.response_code}`);
       return []; // Or throw a specific error: throw new Error('No questions found for this selection.');
     }

    // Check if data.results actually exists and is an array
    if (!data.results || !Array.isArray(data.results)) {
        throw new Error("Invalid data format received from API.");
    }


    return data.results.map((item) => {
      // Keep existing shuffling logic as requested
      const shuffledOptions = [
        ...item.incorrect_answers,
        item.correct_answer,
      ].sort(() => Math.random() - 0.5);

      // --- MODIFIED: Return 'options' array instead of option1, option2... ---
      return {
        id: nanoid(),
        question: item.question,
        answer: item.correct_answer,
        options: shuffledOptions // Return the shuffled options as an array
      };
      // --- END OF MODIFICATION ---
    });
  } catch (error) {
    // Log the specific error (could be the HTTP error we threw or a network/parsing error)
    console.error("Error fetching or processing quiz data:", error);
    // Re-throw the error so the calling component (App.js) can handle it
    throw error;
  }
};