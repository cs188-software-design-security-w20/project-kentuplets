import React, {Component} from 'react';
import OrderFilter from "../../OrderFilter/OrderFilter";
import CategoryFilter from "../../CategoryFilter/CategoryFilter";
import {connect} from 'react-redux';



class FilterBar extends Component {

    render() {
        const categoryArray = this.props.items.map(item => item.category);
        const categories = Array.from(new Set(categoryArray));
        return (
            <div className="col-lg-3">
                <div className="row">
                    <CategoryFilter categories={categories}/>
                    <div className="col-12">
                        <OrderFilter/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {

    return {items : state.items.items};

};

export default connect(mapStateToProps, null)(FilterBar);