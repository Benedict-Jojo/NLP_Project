import React from "react";
import "./GridContainer.css"
import { useState } from "react";

export default function GridContainer(props) {
    const [searchTerm, setSearchTerm] = useState("")

    let searchBar = <input onChange={(event) => {setSearchTerm(event.target.value)}} className="search" type="text" placeholder={"Search for " + props.placeholder + "..."}></input>

    return (
        <div className="outer-container">
            <div className={"content " + props.flexStyle}>
                {props.noSearch? "" : searchBar}
                {props.noSearch? props.children : props.children.filter((item) => item.props.searchKey.toLowerCase().includes(searchTerm.toLowerCase()))}
            </div>
        </div>
    )
}
