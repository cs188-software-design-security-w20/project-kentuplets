import React, {Component} from 'react';
import {connect} from 'react-redux';
import Product from "../../Product/Product";
import {categoryFilter} from "../../Pipes/categoryFilter";
import {orderByFilter} from "../../Pipes/orderByFilter";
import {paginationPipe} from "../../Pipes/paginationFilter";
import Pagination from "../../Pagination/Pagination";

class ProductList extends Component {
    state = {
        colValue : 'col-lg-4',
        perPage: 12,
        currentPage: 1,
        pagesToShow: 3,
        gridValue: 3
    };

    onPrev = () => {
        const updatedState = {...this.state};
        updatedState.currentPage = this.state.currentPage - 1;
        this.setState(updatedState);
    };


    onNext = () => {
        this.setState({
            ...this.state,
            currentPage: this.state.currentPage + 1
        });
    };

    goPage = (n) => {
        this.setState({
            ...this.state,
            currentPage: n
        });
    };


    render() {
        return (
            <div className="col-lg-9">
                <div className="row">
                    {paginationPipe(this.props.items, this.state).map(product =>{
                        let classes = `${this.state.colValue} col-md-6 mb-4`;
                        return (<div key={product.itemID} className={classes}>
                            <Product product={product} />
                        </div>)
                    })}
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        totalItemsCount={this.props.items.length}
                        currentPage={this.state.currentPage}
                        perPage={this.state.perPage}
                        pagesToShow={this.state.pagesToShow}
                        onGoPage={this.goPage}
                        onPrevPage={this.onPrev}
                        onNextPage={this.onNext}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {

    const categories = state.categoryFilter;
    const orderBy = state.orderBy;

    const filterByCategoryArr = categoryFilter(state.items.items, categories);
    const filterByOrderArr = orderByFilter(filterByCategoryArr, orderBy);

    return {items: filterByOrderArr}
};

export default connect(mapStateToProps, null)(ProductList);