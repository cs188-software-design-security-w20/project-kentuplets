import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import FilterBar from "../../Containers/FilterBar/FilterBar";
import ProductList from "../../Containers/ProductList/ProductList";
import API, {graphqlOperation} from "@aws-amplify/api";
import {listItemTables} from "../../../graphql/queries";
import {addItems} from "../../../actions/index";

const Home = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await (API.graphql(graphqlOperation(listItemTables, {limit: 100})).then(e => {
                setProducts(e.data.listItemTables.items);
            }).catch(e => {console.log("Failed to retrieve data");}));

        };
        fetchData();
    }, []);
    const dispatch = useDispatch();
    dispatch(addItems(products));

    return (
        <React.Fragment>
            <div className="container" style={{paddingTop: '6rem'}} >
                <div className="row">
                    <FilterBar/>
                    <ProductList/>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Home;
