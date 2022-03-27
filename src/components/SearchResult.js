import React from "react";

export default function SearchResult(props) {
    return (
        <div className="search-result-container">
            <img src={props.img} alt={props.name} />
            <p>{props.name} ({props.year})</p>
        </div>
    )
}