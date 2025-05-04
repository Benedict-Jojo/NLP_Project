// import React from "react";
// import Graph from "./Graph";
// import "./ItemCard.css"

// import { useState } from "react";

// export default function ItemCard(props) {
//     const [graphVisibility, setGraphVisibility] = useState(-1)
//     const [graph, setGraph] = useState(0)

//     return (
//         <div className={graphVisibility === 1? "card-div active" : "card-div"} onClick={() => setGraphVisibility(graphVisibility * -1)}>
//             <div className="info" onClick={() => {setGraph(<Graph companyFile={props.file} />)}}>
//                 <p className="ticker">({props.ticker})</p>
//                 <p className="name">{props.name}</p>
//                 <p className="price">${props.price}</p>
//                 <p className={props.change > 0? "positive change": "negative change"}>%{props.change}</p>
//             </div>

//             <div className={graphVisibility === -1? "graph hide": "graph"}>
//                 {graph}
//             </div>
//         </div>
//     )
// }
import React, { useState } from "react";
import Graph from "./Graph";
import "./ItemCard.css";

export default function ItemCard(props) {
    const [graphVisibility, setGraphVisibility] = useState(-1);
    const [graph, setGraph] = useState(0);

    return (
        <div 
            className={graphVisibility === 1 ? "card-div active" : "card-div"} 
            onClick={() => setGraphVisibility(graphVisibility * -1)}
        >
            <div 
                className="info" 
                onClick={() => { 
                    setGraph(<Graph companyFile={props.file} companyName={props.name} />);
                }}
            >
                <p className="ticker">({props.ticker})</p>
                <p className="name">{props.name}</p>
                <p className="price">${props.price}</p>
                <p className={props.change > 0 ? "positive change" : "negative change"}>
                    %{props.change}
                </p>
            </div>

            <div className={graphVisibility === -1 ? "graph hide" : "graph"}>
                {graph}
            </div>
        </div>
    );
}
