import React from 'react';
import './Product.css';

const Product = (props) => {
    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 product">
                <a className="product__link">
                    <img className="card-img-top product__img" src={props.img}/>
                </a>
                <div className="card-body product__text">
                    <h5 className="product__price">
                        {props.name}
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default Product;
