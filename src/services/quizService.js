import { nanoid } from "nanoid";

export const fetchQuizData = async (categoryId, quizType) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=5&category=${categoryId}&difficulty=${quizType}&type=multiple`
    );
    const data = await response.json();
    return data.results.map((item) => {
      const shuffledOptions = [
        ...item.incorrect_answers,
        item.correct_answer,
      ].sort(() => Math.random() - 0.5);
      return {
        id: nanoid(),
        option1: shuffledOptions[0],
        option2: shuffledOptions[1],
        option3: shuffledOptions[2],
        option4: shuffledOptions[3],
        question: item.question,
        answer: item.correct_answer,
      };
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
