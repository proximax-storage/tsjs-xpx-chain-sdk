import { useHistory } from 'react-router-dom';
import './StepOne.scss';

const StepOne = ({ role, onNextPage }) => {
  return (
    <div className='step-one'>
      <div className='step-one__image'></div>
      <div className='step-one_description'>
        <p>
          Want to unearth the truth? Contribute to our cause and detect fake
          news by being a <strong>{role}</strong>.
        </p>
        <br />
        <p>Click on the button to be queued for a news tweet!</p>
      </div>
      <button className='step-one__button' onClick={onNextPage}>
        Give me a tweet!
      </button>
    </div>
  );
};

export default StepOne;
