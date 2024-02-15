import React from "react";
import { BuyNowButton } from "./BuyNowButton";
import "./style.css";

export const IphoneProMax = () => {
    return (
        <div className="iphone-pro-max">
            <div className="div">
                <img className="item-description" alt="Item description" src="item-description.png" />
                <img className="title" alt="Title" src="title.png" />
                <img className="asking-price-label" alt="Asking price label" src="asking-price-label.png" />
                <img className="asking-price" alt="Asking price" src="asking-price.png" />
                <img className="similar-items-label" alt="Similar items label" src="similar-items-label.png" />
                <img className="best-offer-label" alt="Best offer label" src="best-offer-label.png" />
                <div className="overlap">
                    <div className="home-button" />
                    <div className="user-profile-button" />
                    <div className="search-button" />
                    <div className="post-button" />
                    <img className="search-logo" alt="Search logo" src="search-logo.svg" />
                    <img className="home-logo" alt="Home logo" src="home-logo.png" />
                    <img className="post-logo" alt="Post logo" src="post-logo.svg" />
                    <img className="user-logo" alt="User logo" src="user-logo.svg" />
                    <img className="separator" alt="Separator" src="separator-2.png" />
                    <img className="img" alt="Separator" src="separator-1.png" />
                    <img className="separator-2" alt="Separator" src="separator-3.png" />
                </div>
                <div className="item-photo" />
                <img className="next-image" alt="Next image" src="next-image.svg" />
                <img className="previous-image" alt="Previous image" src="previous-image.svg" />
                <img className="back-button" alt="Back button" src="back-button.png" />
                <div className="overlap-group">
                    <BuyNowButton className="submit-offer-button" text="Submit Offer" />
                    <div className="best-offer-enter">
                        <div className="img-wrapper">
                            <img className="img-2" alt="Img" src="image.png" />
                        </div>
                    </div>
                </div>
                <BuyNowButton className="buy-now-button-instance" text="Buy Now" />
                <div className="similar-item" />
                <div className="similar-item-2" />
                <div className="similar-item-3" />
                <div className="seller-info">
                    <img className="seller-profile" alt="Seller profile" src="seller-profile-picture.svg" />
                    <img className="seller-username" alt="Seller username" src="seller-username.png" />
                    <div className="rating">
                        <img className="star" alt="Star" src="star.svg" />
                        <img className="rating-2" alt="Rating" src="rating.png" />
                    </div>
                    <img className="time-posted" alt="Time posted" src="time-posted.png" />
                </div>
                <img className="screen-separator" alt="Screen separator" src="screen-separator.svg" />
            </div>
        </div>
    );
};
