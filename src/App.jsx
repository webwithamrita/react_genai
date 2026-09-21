import { useState } from 'react'
import './App.css'
import { URL, API_KEY } from './constant'
import Answer from './component/Answer'

function App() {
	const [question, setQuestion] = useState("");
	const [result, setResult] = useState(undefined);
	// const payload = {
	// 	"contents": [
	// 		{
	// 			"parts": [
	// 				{
	// 					"text": "Explain how AI works in a few words"
	// 				}
	// 			]
	// 		}
	// 	]
	// }
	// const askQuestion = async () => {
	// 	console.log(question);
	// 	let response = await fetch(
	// 		URL,
	// 		{
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				"X-goog-api-key": API_KEY,
	// 			},
	// 			body: JSON.stringify(payload),
	// 		},

	// 	)
	// 	let respond = await response.json();
	// 	console.log(respond);
	// };
	// working code with retry logic
	const askQuestion = async () => {
    console.log(question);

    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: question
                    }
                ]
            }
        ]
    };


	
    try {
        let response;

        for (let i = 0; i < 3; i++) {
            response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": API_KEY,
                },
                body: JSON.stringify(payload),
            });

            if (response.status !== 503) {
                break;
            }

            console.log(`Gemini busy. Retrying... ${i + 1}/3`);

            await new Promise(resolve =>
                setTimeout(resolve, 2000)
            );
        }

        const result = await response.json();
		// console.log(result.candidates[0].content.parts[0].text);
		let dataString = result.candidates[0].content.parts[0].text;
		dataString = dataString.split('#');
		dataString = dataString.map((item) => item.trim());
		//this console.log displays the response of the questions asked in tge input field eg 
			// 		### 1. Casual & Friendly (For friends, family, and close coworkers)
			// *   **"Morning!"** (Short, sweet, and very common)
			// *   **"Rise and shine!"** (Cheerful and encouraging)


        setResult(dataString || "No response received.");
        console.log("Status:", response.status);
        console.log(result);

    } catch (error) {
        console.error("Error:", error);
		setResult("Something went wrong. Please try again.");
    }
};

	return (
		<>
			<div className='grid grid-cols-5 h-screen text-center'>
				<div className='col-span-1 bg-zinc-800'>
					{/* left side */}
					left side
				</div>
				<div className='col-span-4 p-10'>
					{/* right side */}
					right side
					<div className="container h-110 overflow-scroll bg-zinc-800 p-5 rounded-4xl border border-zinc-500 mb-5">
						<div className="text-white">
							<ul>
								{result && result.map((item, index) => (
									<li className='text-left p-1'><Answer key={index} answer={item} /></li>
								))}
							</ul>
						</div>
						{/* <div className="text-white">
							{result && result.map((item, index) => (
								
							))}
						</div> */}
					</div>
					<div className='bg-zinc-800 w-1/2 p-1 text-white m-auto rounded-4xl border border-zinc-500 flex h-16 pr-5'>
						<input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className='w-full g-full p-3 outline-none' placeholder='Ask me anything' />
						<button onClick={askQuestion}>Ask</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default App
