import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const BuyNowButton = ({ className, text = "Buy Now" }) => {
    return (
        <button className={`buy-now-button ${className}`}>
            <div className="content">
                <div className="buy-now">{text}</div>
            </div>
        </button>
    );
};

BuyNowButton.propTypes = {
    text: PropTypes.string,
};
