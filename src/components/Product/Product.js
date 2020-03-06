
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {formatMoney} from "../Pipes/priceFormatter";

import './Product.css';


const Product = (props) => {

    const {
        itemID, images, name, description,marketPrice
    } = props.product;

    const imageRef = React.createRef();
    const [img] = useState(images[0]);


    return (
        <div className="card h-100 product">
            <Link to={`/products/${itemID}`} className="product__link"><img
                className="card-img-top product__img" src={img} alt={name} ref={imageRef}/>

            </Link>
            <div className="card-body product__text">
                <h4 className="card-title product__title">
                    <Link to={`/products/${itemID}`}>{name}</Link>
                </h4>
                <h5 className="product__price">${formatMoney(marketPrice)}</h5>
                <p className="card-text product__description">{description}</p>
            </div>
        </div>
    );
};

export default connect()(Product);
