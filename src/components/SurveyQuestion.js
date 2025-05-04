import React from "react";
import './SurveyQuestion.css'

export default function SurveyQuestion(props) {
    return (
        <div className="container">
            <h1 className="question">{props.question}</h1>
            <div className="options">
                {props.leftLabel}
                <input className="radio" type="radio" name={props.question} value="1"/>
                <input className="radio" type="radio" name={props.question} value="2"/>
                <input className="radio" type="radio" name={props.question} value="3"/>
                {props.rightLabel}
            </div>
        </div>
    )
}