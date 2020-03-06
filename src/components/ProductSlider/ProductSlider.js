import React, {useState} from 'react';
import './ProductSlider.css';

const ProductSlider = ({images}) => {
    const imageRef = React.createRef();
    const [img, setImg] = useState(images[0]);
    const [aItem, setAItem] = useState(0);

    const changeImage = (i) => {
        setImg(images[i]);
        setAItem(i);
    }
    return (
        <aside className="col-sm-5 border-right">
            <article className="gallery-wrap">
                <div className="img-big-wrap">
                    <div style={{padding: '2rem'}}><a href="#"><img
                        ref={imageRef}
                        src={img}
                        style={{width: '100%',
                                height: '100%'}}
                    /></a></div>
                </div>
                <div className="img-small-wrap">
                    {images.map((img , i ) => (
                        <div key={i} className="item-gallery" onClick={() => {changeImage(i)}}><img src={img}/></div>
                    ))}
                </div>
            </article>
        </aside>
    );
};

export default ProductSlider;