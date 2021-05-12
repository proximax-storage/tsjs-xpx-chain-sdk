import React from 'react';
import './Error404.scss';

const Error404: React.FC = () => {
    return(  
        <div className='error-404'>
            <p className='error-404__oops'>
                Oops. Something bad happened.
            </p>
            
            <p className='error-404__description'>
                The page you're looking for doesn't exist yet, so 
                we gave you this one instead. 
                You can reach us on Twitter <span className="twitter">@masscheckhelp</span> and
                let us know your problem.
            </p>
        </div>
    );
};

export default Error404;