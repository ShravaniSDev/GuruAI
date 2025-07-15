import { useState } from "react";

const questions = [
  "What is your biggest current priority?",
  "Why is this important to you right now?",
  "What would 'success' look like after 21 days?",
  "What actions or habits will get you there?",
  "What distractions or sabotage patterns should we avoid?",
];

function TargetProtocol() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    if (input.trim() === "") return;

    const updatedAnswers = [...answers, input];
    setAnswers(updatedAnswers);
    setInput("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFinished(true); // Show summary screen
    }
  };

  return (
    <div className="text-white max-w-2xl space-y-6">
      {!started ? (
        <>
          <h1 className="text-3xl font-bold">🎯 Target Protocol</h1>
          <p className="text-gray-300">
            Let’s build your 21-day transformation. Answer each question honestly. Your AI will use these to lock your custom mission.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg"
          >
            Start Setup
          </button>
        </>
     ) : finished ? (
  // ======= SUMMARY VIEW =======
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-green-400">✅ Mission Draft Complete</h2>

    {/* Pretty mission summary */}
    <div className="bg-gray-800 rounded-xl p-6 text-gray-200 space-y-4">
      <div>
        <span className="font-semibold text-yellow-400">Priority:</span><br />
        {answers[0]}
      </div>
      <div>
        <span className="font-semibold text-yellow-400">Why it matters:</span><br />
        {answers[1]}
      </div>
      <div>
        <span className="font-semibold text-yellow-400">Success in 21 days:</span><br />
        {answers[2]}
      </div>
      <div>
        <span className="font-semibold text-yellow-400">Actions / Habits:</span><br />
        {answers[3]}
      </div>
      <div>
        <span className="font-semibold text-yellow-400">Avoid:</span><br />
        {answers[4]}
      </div>
    </div>

    {/* Lock button */}
    <button
      onClick={() => {
        localStorage.setItem("guruai_target_protocol", JSON.stringify(answers));
        setStarted(false);        // reset state so user can see locked view
        alert("🎯 Your protocol has been locked and activated! Check Progress tab daily.");
      }}
      className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg"
    >
      🔐 Lock & Activate Protocol
    </button>
  </div>
) : (

        <>
          <h2 className="text-xl font-semibold">{questions[currentQuestion]}</h2>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-2 rounded-md text-black"
            placeholder="Type your answer here..."
          />
          <button
            onClick={handleNext}
            className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}

export default TargetProtocol;
