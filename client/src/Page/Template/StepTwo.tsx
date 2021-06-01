import { useHistory } from 'react-router-dom';
import { LocalStorageEnum } from '../../Util/Constant/LocalStorageEnum';

import './StepTwo.scss';

const StepTwo = ({ nextUrl }) => {
  const history = useHistory();

  const onCancel = () => {
    history.push('/');
  };

  // TODO Match tweet
  const matchTweet = () => {
    localStorage.setItem(LocalStorageEnum.IS_FIRST_COUNTDOWN, 'true');
    history.push(nextUrl);
  };

  return (
    <div className='step-two'>
      <div className='step-two__animation'></div>
      <div className='step-two__description'>
        <br />
        <p>Matching you to a news tweet...</p>
      </div>
      <button className='step-two__button' onClick={onCancel}>
        Cancel
      </button>
      <button className='step-two__button' onClick={matchTweet}>
        Next
      </button>
    </div>
  );
};

export default StepTwo;
