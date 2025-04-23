import React from "react";
import "./Definition.css";

export default function Definition({ term, definition, isActive, onClick, searchKey }) {
    return (
        <div
            onClick={onClick}
            className={isActive ? "activated definition-card" : "inactive definition-card"}
        >
            <h1 className="definition-term">{term}</h1>
            <p className="definition-def">{definition}</p>
        </div>
    );
}