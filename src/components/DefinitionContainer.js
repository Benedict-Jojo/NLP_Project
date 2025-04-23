import React, { useState } from "react";
import "./DefinitionContainer.css";
import Definition from "./Definition";

export default function DefinitionContainer({ children, placeholder, noSearch }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeIndex, setActiveIndex] = useState(null);

    const searchBar = (
        <input
            onChange={(event) => setSearchTerm(event.target.value)}
            className="search"
            type="text"
            placeholder={"Search for " + placeholder + "..."}
        />
    );

    const processedChildren = (noSearch ? children : children.filter(
        (item) =>
            item.props.searchKey &&
            item.props.searchKey.toLowerCase().includes(searchTerm.toLowerCase())
    )).map((child, index) => {
        return React.cloneElement(child, {
            isActive: activeIndex === index,
            onClick: () => setActiveIndex(activeIndex === index ? null : index),
            key: index
        });
    });

    return (
        <div className="definition-container">
            {noSearch ? null : searchBar}
            <div className="def-container">
                {processedChildren}
            </div>
        </div>
    );
}
