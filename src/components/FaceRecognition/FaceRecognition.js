import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, boxes}) => {
    console.log(imageUrl);
    
    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img id="input-image" src={imageUrl} alt="" width='500px' height='auto' />
                {
                    boxes.map((box, i) => {
                        return (
                            <div 
                                className="bounding-box" 
                                style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}
                                key={i}>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default FaceRecognition;