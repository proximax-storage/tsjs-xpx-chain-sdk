import React from 'react';

import './Tweet.scss';

interface TweetInfo {
  name: string;
  tag: string;
  content: string;
  submitBy: string;
  submitTime: Date;
  authenticityScore: number;
  stage: string;
}

const Tweet: React.FC<TweetInfo> = (props: any) => {
  return (
    <div className='tweet'>
      <p>
        <span className='tweet__name'>{props.name}</span>{' '}
        <span className='tweet__tag'>{props.tag}</span>
      </p>
      <p className='tweet__content'>{props.content}</p>
      <br />
      <p className='tweet__submit-by'>
        Submitted by {props.submitBy} {props.submitTime.toString()}
      </p>
      <p>
        <span className='tweet__authenticity-score'>
          {props.authenticityScore}% Real
        </span>{' '}
        | <span className='tweet__stage'>{props.stage}</span>
      </p>
    </div>
  );
};

export default Tweet;
