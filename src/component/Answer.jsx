import { useEffect, useState } from "react";

const Answer = ({ answer, key }) => {
    // console.log(answer,key);
    useEffect(() => {
        console.log(answer, checkHeading(answer));
        
    }, [])

    function checkHeading(str) {

    return /^(\*)(\*)(.*)$/.test(str);
    }

    return (
        <div key={key} className="bg-zinc-800 w-full p-1">
            {answer}
        </div>
    )
}

export default Answer;