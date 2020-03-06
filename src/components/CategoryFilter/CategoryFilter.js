import React from 'react';
import {connect} from 'react-redux';
import './CategoryFilter.css';
import {addCategoryToFilter, removeCategoryFromFilter} from "../../actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTags} from '@fortawesome/free-solid-svg-icons'

const CategoryFilter = (props) => {

    const {dispatch, catergoriesCount, categories} = props;

    const handleSelectBox = (e) => {
        const name = e.target.name;
        const value = e.target.checked;

        if(e.target.checked) {
            dispatch(addCategoryToFilter(name));
        } else {
            dispatch(removeCategoryFromFilter(name));
        }
    };

        return (
            <div className="card mb-3">
                <div className="card-header">
                    <h5>Categories <span className="ml-3"><FontAwesomeIcon icon={faTags} /></span></h5>
                </div>
                <ul className="list-group flex-row flex-wrap">
                    {categories.map(category => (
                        <li key={category} className="list-group-item flex-50">
                            <label className="custom-checkbox text-capitalize">{category} ({catergoriesCount[category]})
                                <input type="checkbox"
                                       name={category}
                                       className="custom-checkbox__input" onInput={handleSelectBox}/>
                                <span className="custom-checkbox__span"></span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        );

};

const mapStateToProps = (state) => {

    const catergoriesCount = {};

    state.items.items.forEach(p => {
        catergoriesCount[p.category] = catergoriesCount[p.category] + 1 || 1;
    });
    return {
        catergoriesCount
    }

};

export default connect(mapStateToProps)(CategoryFilter);