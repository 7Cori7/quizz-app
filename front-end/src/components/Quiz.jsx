import { useRef, useState, useEffect } from "react";
import './quiz.css';

export default function Quiz(){

    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState({});
    const [data, setData] = useState([]);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [userDetails, setUserDetails] = useState({ name: "", email: "" });
    const [startQuiz, setStartQuiz] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState(null);

    const Option1 = useRef(null);
    const Option2 = useRef(null);
    const Option3 = useRef(null);
    const Option4 = useRef(null);

    const option_array = [Option1, Option2, Option3, Option4];

    useEffect(() => {

      async function fetchQuestions() {

        if(startQuiz){

          try {
              
            setLoading(true);

            const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

            const response = await fetch(`${apiUrl}/api/questions`);

            if (!response.ok) throw new Error("Failed to fetch");

            let questions = await response.json();

            questions = questions.map(q => ({
              ...q,
              options: [q.option1, q.option2, q.option3, q.option4],
              answer: q.ans, 
            }));

            if(questions.length > 0){

              setData(questions);
              setQuestion(questions[0]);
              setLoading(false);
            }else{

              throw new Error("No questions found");
            }

          }catch(error){

            console.error("Error fetching questions:", error);
            setLoading(false);
            setErrMsg(error.message);
          }
        }
      };
    
      fetchQuestions();

    }, [startQuiz]);

    function handleInputChange(e) {

      const { name, value } = e.target;

      setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));

    };
    
    function handleSubmit(e) {

      e.preventDefault();

      if (userDetails.name && userDetails.email) {

        setStartQuiz(true);
      } else {

        alert("Name and email are required to start the quiz.");
      }
    };
    
    function checkAns(e, ans) {

        if (lock === false) {

          if (question && question.answer === ans) {
            e.target.classList.add("correct");
            setLock(true);
            setScore((prev) => prev + 1);
          } else {
            e.target.classList.add("wrong");
            setLock(true);
            option_array[question.answer - 1].current.classList.add("correct");
          }

        }
    };
    
    function next() {

        if (lock === true) {

          if (index === data.length - 1) {

            setResult(true);

          } else {

            setIndex((prevIndex) => prevIndex + 1);
            setQuestion(data[index + 1]);
            setLock(false);

            option_array.forEach((option) => {
              option.current.classList.remove("wrong");
              option.current.classList.remove("correct");
            });

          }

        }
    };
    
    function reset() {

      setIndex(0);
      setQuestion(data[0]);
      setScore(0);
      setLock(false);
      setResult(false);
      setStartQuiz(false);
      setUserDetails({ name: "", email: "" });

    };

    if (!startQuiz) {
        return (
          <div className="container">
            <h1>Quiz App</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Start Quiz</button>
            </form>
          </div>
        );
    }
    
    return (
        <div className="container">

          <div className="header">
            <h1>Quiz App</h1>
            <p>{userDetails.name}</p>
          </div>
          
          { loading && <div style={{textAlign:'center', fontSize:'30px'}}>Loading⌛...please wait</div> }

          { errMsg !== null && <div style={{textAlign:'center'}}>An Error Occurred ! ❌ {errMsg}</div> }

          {result ? (
            <>
              {score === data.length
                ? <div style={{textAlign:'center', margin:'20px 0'}}><h1>🎉CONGRATULATIONS!🎉</h1><h2>You got a perfect score!</h2></div>
                : <h2 style={{textAlign:'center'}}>You Scored {score} out of {data.length}</h2>
              }
              
              {score < data.length / 2  && <h2 style={{fontWeight:'bold', textAlign:'center'}}>Study more! 😿</h2>}

              <button onClick={reset}>Reset</button>
            </>
          ) : (
            <>
              <h2>
                {index + 1}. {question?.question}
              </h2>
              <ul>
                {question?.options?.map((option, idx) => (
                  <li
                    key={idx}
                    ref={option_array[idx]}
                    onClick={(e) => {
                      checkAns(e, idx + 1);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <button onClick={next}>Next</button>
              <div className="index">
                {index + 1} of {data.length} questions
              </div>
            </>
          )}
        </div>
    );
}